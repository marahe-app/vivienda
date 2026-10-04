import { DECRETO_POR_ID } from '../sim/datos/decretos';
import type { Estado } from '../sim/tipos';
import { textoValor } from './decretos';

/** Un decreto sobre una gráfica temporal: dónde cae y qué leyes cambió. */
export interface Hito {
  x: number;
  leyes: string[];
}

/**
 * Sitúa los decretos promulgados sobre una gráfica de ancho `ancho` cuyos puntos son de las
 * semanas dadas (en orden). Las leyes de un mismo decreto comparten marca.
 */
export function hitosDecretos(
  promulgados: Estado['decretosPromulgados'],
  semanas: number[],
  ancho: number,
): Hito[] {
  const n = semanas.length;
  if (n < 2) return [];
  const porSemana = new Map<number, string[]>();
  for (const p of promulgados) {
    const d = DECRETO_POR_ID.get(p.id);
    if (!d || p.semana < semanas[0]) continue;
    const texto =
      p.valor === null
        ? `Derogada: ${d.titulo}`
        : d.parametro
          ? `${d.titulo}: ${textoValor(d, p.valor)}`
          : d.titulo;
    porSemana.set(p.semana, [...(porSemana.get(p.semana) ?? []), texto]);
  }
  return [...porSemana].map(([semana, leyes]) => {
    // El historial puede estar diezmado: se interpola entre los dos puntos que rodean la semana.
    const j = semanas.findIndex((s) => s >= semana);
    const i =
      j < 0
        ? n - 1
        : j === 0
          ? 0
          : j - 1 + (semana - semanas[j - 1]) / (semanas[j] - semanas[j - 1]);
    return { x: (i / (n - 1)) * ancho, leyes };
  });
}

/** Las leyes del decreto más próximo a la posición `x` del cursor, si hay alguno a un paso. */
export function hitoCercano(hitos: Hito[], x: number, ancho: number): string[] {
  let mejor: Hito | null = null;
  for (const h of hitos)
    if (Math.abs(h.x - x) <= ancho * 0.02 && (!mejor || Math.abs(h.x - x) < Math.abs(mejor.x - x)))
      mejor = h;
  return mejor?.leyes ?? [];
}
