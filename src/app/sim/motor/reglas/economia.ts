import { FACTORES } from '../../datos/factores';
import { PARAMETROS as P } from '../../datos/parametros';
import type { Regla } from '../../tipos';
import { flujosVacios } from '../indicadores';

const IPC_BASE = FACTORES['inflacion.general'].base;

/**
 * Caduca modificadores temporales y actualiza rentas, salario mínimo e IPC.
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
      e.smi *= 1 + (f('smi.crecimiento') + traspaso) / 52;
      e.nivelPrecios *= 1 + ipc / 52;
    }
    for (const c of e.ciudades) {
      c.flujos = flujosVacios();
      if (quieto) continue;
      c.renta *= 1 + (f('renta.crecimiento', { ciudad: c.id }) + traspaso) / 52;
      c.precioRef *= 1 + ipc / 52;
      c.alquilerRef *= 1 + ipc / 52;
    }
  },
};
