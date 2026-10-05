import { DECRETO_POR_ID } from '../datos/decretos';
import { PARAMETROS as P } from '../datos/parametros';
import type { Contexto, Estado } from '../tipos';

/** Lo que cuesta cada año (M€) la vivienda pública que se está construyendo y comprando, más las leyes en vigor. */
export function gastoAnual(e: Estado, ctx: Contexto): number {
  let g = 0;
  // Construir cuesta más a medida que suben los precios y cuanto más cargado va el sector.
  const coste = P.costeViviendaPublica * e.nivelPrecios * e.costeObra;
  for (const c of e.ciudades) {
    // Las concesiones las paga el promotor: el Estado solo pone el suelo (≈ 30 %).
    g +=
      (c.ritmoObraPublica + c.ritmoObraConcesion * 0.3) * 52 * coste +
      c.flujos.costeCompraPublica * 52;
  }
  for (const [id, v] of Object.entries(e.vigentes)) {
    const d = DECRETO_POR_ID.get(id);
    if (d?.coste) g += d.coste(v, ctx);
  }
  return g;
}

/**
 * Ingresos propios al año (M€): el alquiler social del parque público que el Estado posee (no el cedido
 * en concesión), menos lo que cuesta gestionarlo, y el IVA de la obra nueva que se añade a la de partida
 * (negativo si se construye menos que al inicio).
 */
export function ingresosAnual(e: Estado): number {
  const alquilerSocial = e.smi * P.alquilerSocialPctSmi * 12;
  const gestion = P.gestionPublica * e.nivelPrecios;
  let g = 0;
  for (const c of e.ciudades) {
    const p = c.parque.publico;
    const total = p.alquilada + p.ofAlquiler + p.vacia;
    const propio = total > 0 ? Math.max(0, 1 - c.concesion / total) : 0;
    g += propio * (p.alquilada * alquilerSocial - total * gestion);
    g += (c.ritmoObra - c.obraBase) * 52 * c.precio * P.retornoFiscalObra;
  }
  return g / 1e6;
}

/**
 * Coste anual previsto (M€) de una ley con un valor dado, para enseñarlo antes de promulgarla.
 * La vivienda pública no tiene `coste`: se paga por lo que realmente se construye, así que aquí se estima.
 */
export function costeLey(id: string, v: number, ctx: Contexto, nivelPrecios = 1): number {
  const d = DECRETO_POR_ID.get(id);
  if (!d) return 0;
  if (d.coste) return d.coste(v, ctx);
  const coste = P.costeViviendaPublica * nivelPrecios * ctx.costeObra;
  switch (id) {
    case 'plan-vivienda-publica':
      return v * 52 * coste;
    case 'suelo-publico-concesion':
      return v * 52 * coste * 0.3;
    case 'reserva-protegida':
      return 1550 * (v / 100) * 0.5 * 52 * coste * 0.3;
    case 'compra-publica':
      return (v * 52 * ctx.precioMedio * 1.1) / 1e6;
    default:
      return 0;
  }
}
