import { PARAMETROS as P } from '../../datos/parametros';
import type { Regla } from '../../tipos';
import { clamp, suma } from '../indicadores';

/** Obra nueva privada, pública y en concesión (con retraso) y compra pública. Cada vivienda se asigna a quien la promueve. */
export const construccion: Regla = {
  id: 'construccion',
  nombre: 'Construcción y compra pública',
  ejecutar(e, f) {
    const esperaTotal = e.ciudades.reduce((s, c) => s + c.espera, 0) || 1;
    const publicaNacional = f('construccion.publica');
    const concesionNacional = f('construccion.concesion');
    const compraNacional = f('compra.publica');

    // Objetivo de cada ciudad; si entre todas superan la capacidad del sector, se reparte.
    const objetivos = e.ciudades.map((c) => {
      const margen = clamp(Math.pow(c.precio / c.precioRef, 0.8), 0.5, 1.6);
      const privada =
        c.obraBase *
        f('construccion.privada', { ciudad: c.id }) *
        (0.5 + e.confianza / 120) *
        margen;
      const cuota = c.espera / esperaTotal;
      return { privada, publica: publicaNacional * cuota, concesion: concesionNacional * cuota };
    });
    const total = objetivos.reduce((s, o) => s + o.privada + o.publica + o.concesion, 0);
    const escala = Math.min(1, f('construccion.capacidad') / (total || 1));
    const retraso = f('construccion.retraso');

    e.ciudades.forEach((c, k) => {
      c.ritmoObra += (objetivos[k].privada * escala - c.ritmoObra) / retraso;
      c.ritmoObraPublica += (objetivos[k].publica * escala - c.ritmoObraPublica) / retraso;
      c.ritmoObraConcesion += (objetivos[k].concesion * escala - c.ritmoObraConcesion) / retraso;

      const n = c.ritmoObra;
      const paraAlquiler =
        c.intencion.grandes > 0.5 ? n * P.repartoObra.grandes * P.obraParaAlquiler : 0;
      c.parque.familias.ofVenta += n * P.repartoObra.familias;
      c.parque.pequenos.ofVenta += n * P.repartoObra.pequenos;
      c.parque.grandes.ofVenta += n * P.repartoObra.grandes - paraAlquiler;
      c.parque.grandes.ofAlquiler += paraAlquiler;
      c.parque.publico.ofAlquiler += c.ritmoObraPublica + c.ritmoObraConcesion;

      // Compra pública: como mucho el 2 % de lo que hay en venta cada semana, al precio de la ciudad.
      const enVenta = suma(c, 'ofVenta', true);
      const compra = Math.min((compraNacional * c.espera) / esperaTotal, enVenta * 0.02);
      if (compra > 0) {
        for (const o of ['familias', 'pequenos', 'grandes'] as const) {
          c.parque[o].ofVenta -= (compra * c.parque[o].ofVenta) / enVenta;
        }
        c.parque.publico.ofAlquiler += compra;
        c.flujos.compraPublica = compra;
        c.flujos.costeCompraPublica =
          (compra * c.precio * (1 + f('impuesto.compra', { ciudad: c.id }))) / 1e6;
      }

      c.flujos.construidas = n + c.ritmoObraPublica + c.ritmoObraConcesion;
      e.contadores.construidas += c.flujos.construidas;
    });
  },
};
