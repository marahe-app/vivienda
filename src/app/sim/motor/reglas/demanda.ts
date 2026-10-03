import { PARAMETROS as P } from '../../datos/parametros';
import type { Regla } from '../../tipos';

/** Familias que llegan del exterior y jóvenes que quieren emanciparse: entran en la lista de espera. */
export const demanda: Regla = {
  id: 'demanda',
  nombre: 'Llegadas y emancipación',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      const inm = f('demanda.inmigracion', ambito) * c.cuotaInm;
      const eman = f('demanda.emancipacion', ambito) * c.cuotaEman;
      c.espera += inm + eman - c.espera * f('demanda.abandono', ambito);
      c.flujos.inmigrantes = inm;
      c.flujos.emancipados = eman;
      e.contadores.inmigrantesDesde2018 += inm;
    }
  },
};

/** Hogares propietarios que desaparecen: su vivienda se hereda y se vende, se alquila o queda vacía. */
export const disoluciones: Regla = {
  id: 'disoluciones',
  nombre: 'Herencias',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const fam = c.parque.familias;
      const d = (fam.propia * f('demanda.disolucion', { ciudad: c.id })) / 52;
      fam.propia -= d;
      fam.ofVenta += d * P.herencia.venta;
      fam.ofAlquiler += d * P.herencia.alquiler;
      fam.vacia += d * P.herencia.vacia;
      c.flujos.nuevaOferta += d * (P.herencia.venta + P.herencia.alquiler);
    }
  },
};
