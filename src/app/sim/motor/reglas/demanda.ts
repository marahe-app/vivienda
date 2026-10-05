import { PARAMETROS as P } from '../../datos/parametros';
import { PROPIETARIOS, type Ciudad, type Propietario, type Regla } from '../../tipos';
import { clamp, esfuerzoEntrada } from '../indicadores';
import { ayudaAlquiler } from './economia';

/**
 * Familias que llegan del exterior y jóvenes que quieren emanciparse: entran en la lista de espera.
 * Cuanto más cuesta alquilar respecto al inicio, menos llegan y menos se emancipan (y al revés).
 */
export const demanda: Regla = {
  id: 'demanda',
  nombre: 'Llegadas y emancipación',
  ejecutar(e, f) {
    const el = P.elasticidadDemanda;
    // Las llegadas parten de un año récord y van bajando; ambas siguen además a la coyuntura.
    const demografia =
      1 - P.demografia.caidaInmigracion * Math.min(1, e.semana / 52 / P.demografia.anios);
    const llegadas = demografia * (1 + P.ciclo.llegadas * e.coyuntura);
    const empleo = 1 + P.ciclo.emancipacion * e.coyuntura;
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      const alivio =
        c.esfuerzoRef / Math.max(1e-6, esfuerzoEntrada(c, ayudaAlquiler(e, f, ambito)));
      const freno = (elasticidad: number) => clamp(Math.pow(alivio, elasticidad), el.min, el.max);
      const inm = f('demanda.inmigracion', ambito) * c.cuotaInm * freno(el.inmigracion) * llegadas;
      const eman =
        f('demanda.emancipacion', ambito) * c.cuotaEman * freno(el.emancipacion) * empleo;
      c.espera += inm + eman - c.espera * f('demanda.abandono', ambito);
      c.flujos.inmigrantes = inm;
      c.flujos.emancipados = eman;
      e.contadores.inmigrantesDesde2018 += inm;
    }
  },
};

/** Familias en espera que se van de las ciudades donde alquilar cuesta más esfuerzo a las que cuesta menos. */
export const mudanzas: Regla = {
  id: 'mudanzas',
  nombre: 'Mudanzas entre ciudades',
  ejecutar(e, f) {
    if (e.calibrando) return;
    const esfuerzo = e.ciudades.map((c) =>
      esfuerzoEntrada(c, ayudaAlquiler(e, f, { ciudad: c.id })),
    );
    const tamano = e.ciudades.map((c) =>
      PROPIETARIOS.reduce((s, o) => s + c.parque[o].alquilada + c.parque[o].propia, 0),
    );
    const total = tamano.reduce((s, h) => s + h, 0);
    const medio = esfuerzo.reduce((s, x, k) => s + x * tamano[k], 0) / total;
    let salen = 0;
    let hueco = 0;
    const cambio = e.ciudades.map((c, k) => {
      const exceso = esfuerzo[k] / medio - 1;
      if (exceso > 0) {
        const x = c.espera * Math.min(1, P.movilidad * exceso);
        salen += x;
        return -x;
      }
      hueco += tamano[k] * -exceso;
      return tamano[k] * -exceso;
    });
    if (!hueco) return;
    e.ciudades.forEach((c, k) => {
      c.espera += cambio[k] < 0 ? cambio[k] : (salen * cambio[k]) / hueco;
    });
  },
};

/** Una vivienda alquilada queda libre: su dueño la vuelve a alquilar, la vende o la deja vacía, según su intención. */
export function liberar(c: Ciudad, o: Propietario, n: number) {
  const p = c.parque[o];
  const i = c.intencion[o];
  p.alquilada -= n;
  p.ofAlquiler += n * i;
  p.ofVenta += n * (1 - i) * 0.6;
  p.vacia += n * (1 - i) * 0.4;
  c.flujos.nuevaOferta += n * i + n * (1 - i) * 0.6;
}

/**
 * Hogares que desaparecen. La vivienda del propietario se hereda y se vende, se alquila o queda vacía;
 * la del inquilino vuelve a su dueño.
 */
export const disoluciones: Regla = {
  id: 'disoluciones',
  nombre: 'Herencias',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const tasa = f('demanda.disolucion', { ciudad: c.id }) / 52;
      const fam = c.parque.familias;
      const d = fam.propia * tasa;
      fam.propia -= d;
      fam.ofVenta += d * P.herencia.venta;
      fam.ofAlquiler += d * P.herencia.alquiler;
      fam.vacia += d * P.herencia.vacia;
      c.flujos.nuevaOferta += d * (P.herencia.venta + P.herencia.alquiler);
      for (const o of PROPIETARIOS)
        liberar(c, o, c.parque[o].alquilada * tasa * P.disolucionInquilinos);
    }
  },
};
