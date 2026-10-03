import { PARAMETROS as P } from '../../datos/parametros';
import { PROPIETARIOS, type Regla } from '../../tipos';
import { clamp, rentabilidad } from '../indicadores';

/** Intención de alquilar de cada propietario: base legal/fiscal + rentabilidad + confianza. */
export const intencion: Regla = {
  id: 'intencion',
  nombre: 'Intención de alquilar o vender',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      c.rentabilidad = rentabilidad(c.alquiler, c.precio);
      for (const o of PROPIETARIOS) {
        if (o === 'publico') {
          c.intencion[o] = 1;
          continue;
        }
        const base = f('oferta.intencionAlquilar', { propietario: o, ciudad: c.id });
        const porRentabilidad = P.sensRentabilidad[o] * (c.rentabilidad - P.rentabilidadNeutra);
        c.intencion[o] = clamp(base + porRentabilidad + (e.confianza - 60) / 200);
      }
    }
  },
};

/** Inquilinos que pierden su casa: desahucios y contratos que el propietario no renueva. */
export const expulsiones: Regla = {
  id: 'expulsiones',
  nombre: 'Desahucios y no renovaciones',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      const tasaDesahucio = f('desahucios.tasa', ambito);
      const noRenovacion = f('contratos.noRenovacion', ambito);
      // El propietario no renueva cuando el mercado sube más que las rentas...
      const exceso = Math.max(0, c.crecAlq - f('renta.crecimiento', ambito));
      const porPrecio = Math.min(3, exceso / 0.05);
      for (const o of PROPIETARIOS) {
        const p = c.parque[o];
        const i = c.intencion[o];
        // ...o cuando ya no le compensa alquilar y quiere recuperar la vivienda.
        const porSalida = Math.max(0, 0.6 - i) * 2;
        const freno = o === 'publico' ? 0.2 : 1;
        const desahuciados = p.alquilada * tasaDesahucio * freno;
        const noRenovados = p.alquilada * noRenovacion * (porPrecio + porSalida) * freno;
        const x = desahuciados + noRenovados;
        p.alquilada -= x;
        p.ofAlquiler += x * i;
        p.ofVenta += x * (1 - i) * 0.6;
        p.vacia += x * (1 - i) * 0.4;
        c.espera += x;
        c.flujos.desahucios += desahuciados;
        c.flujos.noRenovados += noRenovados;
        c.flujos.nuevaOferta += x * i + x * (1 - i) * 0.6;
        e.contadores.expulsados += x;
      }
    }
  },
};

/** Vivienda vacía que sale al mercado y anuncios de alquiler que se retiran. */
export const ofertaExistente: Regla = {
  id: 'oferta-existente',
  nombre: 'Movilización de vivienda vacía',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      for (const o of PROPIETARIOS) {
        const p = c.parque[o];
        const i = c.intencion[o];
        const ambito = { propietario: o, ciudad: c.id };
        const sale = Math.min(
          p.vacia,
          p.vacia * f('oferta.movilizacion', ambito) * P.movilizacion[o],
        );
        p.vacia -= sale;
        p.ofAlquiler += sale * i;
        p.ofVenta += sale * (1 - i);
        c.flujos.nuevaOferta += sale;
        if (o === 'publico') continue;
        const retirada = p.ofAlquiler * Math.min(1, f('oferta.retirada', ambito) * (1 - i));
        p.ofAlquiler -= retirada;
        p.vacia += retirada;
      }
    }
  },
};
