import { PARAMETROS as P } from '../../datos/parametros';
import { PROPIETARIOS, type Regla } from '../../tipos';
import { clamp, rentabilidad, sueloAlquilerDe } from '../indicadores';
import { liberar } from './demanda';

/**
 * Intención de alquilar de cada propietario: base legal/fiscal + rentabilidad + confianza.
 * Cuando el alquiler se acerca a lo que cuesta mantener la vivienda (el suelo), nadie alquila.
 */
export const intencion: Regla = {
  id: 'intencion',
  nombre: 'Intención de alquilar o vender',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      c.rentabilidad = rentabilidad(c.alquiler, c.precio);
      const suelo = sueloAlquilerDe(c);
      const cubreCostes = clamp((c.alquiler - suelo) / (0.2 * suelo));
      for (const o of PROPIETARIOS) {
        if (o === 'publico') {
          c.intencion[o] = 1;
          continue;
        }
        const base = f('oferta.intencionAlquilar', { propietario: o, ciudad: c.id });
        const porRentabilidad = P.sensRentabilidad[o] * (c.rentabilidad - P.rentabilidadNeutra);
        c.intencion[o] = clamp(base + porRentabilidad + (e.confianza - 60) / 200) * cubreCostes;
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
      // El propietario no renueva cuando el mercado paga bastante más que su inquilino...
      const brecha = Math.max(0, c.alquiler / c.alquilerVivo - 1);
      const porPrecio = Math.min(3, brecha / P.brechaNoRenovacion);
      for (const o of PROPIETARIOS) {
        const p = c.parque[o];
        // ...o cuando ya no le compensa alquilar y quiere recuperar la vivienda.
        const porSalida = Math.max(0, 0.6 - c.intencion[o]) * 2;
        const freno = o === 'publico' ? 0.2 : 1;
        const desahuciados = p.alquilada * Math.min(1, tasaDesahucio * freno);
        const noRenovados = Math.min(
          p.alquilada - desahuciados,
          p.alquilada * noRenovacion * (porPrecio + porSalida) * freno,
        );
        const x = desahuciados + noRenovados;
        liberar(c, o, x);
        c.espera += x;
        c.flujos.desahucios += desahuciados;
        c.flujos.noRenovados += noRenovados;
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
