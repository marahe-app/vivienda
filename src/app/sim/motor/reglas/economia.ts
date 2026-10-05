import { FACTORES } from '../../datos/factores';
import { PARAMETROS as P } from '../../datos/parametros';
import type { Ambito, Estado, Regla, Resolver } from '../../tipos';
import { flujosVacios } from '../indicadores';

export const IPC_BASE = FACTORES['inflacion.general'].base;

/** Número al azar entre 0 y 1 (mulberry32). Avanza el estado guardado en la partida, así que es repetible. */
export function azar(e: Estado): number {
  e.azar = (e.azar + 0x6d2b79f5) | 0;
  let t = Math.imul(e.azar ^ (e.azar >>> 15), 1 | e.azar);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Lo que el tipo de interés se aparta de su base: sigue a la inflación, sube cuando falta confianza
 * y acompaña al ciclo (el banco central sube tipos en la expansión y los baja en la recesión).
 */
const sobretipo = (e: Estado, f: Resolver) =>
  f('inflacion.general') -
  IPC_BASE +
  (P.primaRiesgo * Math.max(0, 60 - e.confianza)) / 60 +
  P.ciclo.tipo * e.coyuntura;

/** Tipo de las hipotecas en vigor esta semana. */
export const tipoHipoteca = (e: Estado, f: Resolver, ambito?: Ambito) =>
  Math.max(0.001, f('hipoteca.tipo', ambito) + sobretipo(e, f));

/** Interés que paga la deuda de la cartera. */
export const tipoDeuda = (e: Estado, f: Resolver) => Math.max(0, P.deuda.interes + sobretipo(e, f));

/** Ayuda pública al alquiler en euros de la semana: la ley la fija en euros de inicio y se actualiza con el IPC. */
export const ayudaAlquiler = (e: Estado, f: Resolver, ambito?: Ambito) =>
  f('acceso.ayudaAlquiler', ambito) * e.nivelPrecios;

/**
 * Caduca modificadores temporales, mueve la coyuntura y actualiza rentas, salario mínimo e IPC.
 * Si la inflación se desvía de la base (por dinero impreso o por el SMI), salarios y SMI
 * solo recogen una parte del exceso: el resto es pérdida de poder adquisitivo.
 */
export const economia: Regla = {
  id: 'economia',
  nombre: 'Rentas, salario mínimo e IPC',
  ejecutar(e, f) {
    e.modificadores = e.modificadores.filter((m) => m.hasta === undefined || m.hasta > e.semana);
    const quieto = e.calibrando;
    const ipc = f('inflacion.general');
    const traspaso = (ipc - IPC_BASE) * P.traspasoInflacion;
    if (!quieto) {
      // La coyuntura arrastra su pasado y recibe un choque al azar cada semana: salen ciclos de varios años.
      const choque = (azar(e) + azar(e) + azar(e) - 1.5) * 2 * P.ciclo.choque;
      e.coyuntura = Math.max(-1, Math.min(1, e.coyuntura * P.ciclo.persistencia + choque));
      e.smi *= 1 + (f('smi.crecimiento') + traspaso) / 52;
      e.nivelPrecios *= 1 + ipc / 52;
    }
    for (const c of e.ciudades) {
      c.flujos = flujosVacios();
      if (quieto) continue;
      c.renta *=
        1 +
        (f('renta.crecimiento', { ciudad: c.id }) + traspaso + P.ciclo.renta * e.coyuntura) / 52;
      c.precioRef *= 1 + ipc / 52;
      c.alquilerRef *= 1 + ipc / 52;
    }
  },
};
