import { PARAMETROS as P } from '../../datos/parametros';
import type { Regla } from '../../tipos';
import { clamp } from '../indicadores';

/**
 * Precios: IPC + sensibilidad × ln(demanda/oferta respecto al ratio neutro).
 * El ratio neutro de cada ciudad se calibra al inicio para reproducir la subida observada hoy.
 */
export const precios: Regla = {
  id: 'precios',
  nombre: 'Alquileres y precios de venta',
  ejecutar(e, f) {
    if (e.calibrando) return;
    const ipc = f('inflacion.general');
    const kAlq = f('alquiler.sensibilidad');
    const kVenta = f('venta.sensibilidad');
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      if (!c.neutroAlq) c.neutroAlq = c.ratioAlq / Math.exp((c.crecAlqRef - ipc) / kAlq);
      if (!c.neutroVenta) c.neutroVenta = c.ratioVenta / Math.exp((c.crecVentaRef - ipc) / kVenta);

      const objAlq = ipc + kAlq * Math.log(Math.max(1e-6, c.ratioAlq) / c.neutroAlq);
      c.crecAlq += (objAlq - c.crecAlq) * 0.25;
      c.crecAlq = clamp(
        c.crecAlq,
        f('alquiler.crecimientoMin', ambito),
        f('alquiler.crecimientoMax', ambito),
      );
      c.alquiler *= 1 + c.crecAlq / 52;
      // Suelo a las caídas: por debajo de lo que cuesta mantener y construir, la oferta se retira antes que bajar más.
      if (c.crecAlq < 0) c.alquiler = Math.max(c.alquiler, c.alquilerRef * P.sueloAlquiler);

      const objVenta = ipc + kVenta * Math.log(Math.max(1e-6, c.ratioVenta) / c.neutroVenta);
      c.crecVenta += (objVenta - c.crecVenta) * 0.25;
      c.crecVenta = clamp(
        c.crecVenta,
        f('venta.crecimientoMin', ambito),
        f('venta.crecimientoMax', ambito),
      );
      c.precio *= 1 + c.crecVenta / 52;
      if (c.crecVenta < 0) c.precio = Math.max(c.precio, c.precioRef * P.sueloPrecio);
    }
  },
};
