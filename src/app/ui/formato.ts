import type { DefFactor } from '../sim/datos/factores';
import type { Propietario } from '../sim/tipos';

const entero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const num = (v: number) => entero.format(Math.round(v));
export const dec = (v: number) => decimal.format(v);
export const pct = (v: number, d = 1) =>
  (v * 100).toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' %';
export const eur = (v: number) => num(v) + ' €';
/** 1.340.000 → "1,34 M" · 22.600 → "22,6 mil" */
export function compacto(v: number): string {
  const a = Math.abs(v);
  if (a >= 1e6) return (v / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' M';
  if (a >= 1e4) return (v / 1e3).toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' mil';
  return num(v);
}
export const signo = (v: number, texto: string) =>
  (v > 0 ? '+' : v < 0 ? '−' : '') + texto.replace('-', '');

export function valorFactor(def: DefFactor, v: number): string {
  switch (def.formato) {
    case 'pct':
      return Math.abs(v) < 0.005 ? pct(v, 3) : pct(v, 1);
    case 'eur':
      return eur(v);
    case 'x':
      return '×' + v.toLocaleString('es-ES', { maximumFractionDigits: 2 });
    case 'anios':
      return dec(v) + ' años';
    case 'meur':
      return num(v) + ' M€';
    default:
      return num(v);
  }
}

export type Unidad = 'relativa' | 'puntosPct' | 'puntos';
export interface Tendencia {
  /** -1 baja, 0 igual, 1 sube. */
  sentido: -1 | 0 | 1;
  texto: string;
  /** 'bien' | 'mal' | '' según si el cambio ayuda o perjudica. */
  tono: string;
}

/**
 * «▼ baja 10,3 % desde el inicio». Las magnitudes que ya son un porcentaje o un índice
 * se comparan en puntos, no en porcentaje de porcentaje.
 * bueno: qué sentido es favorable (1 subir, -1 bajar, 0 ninguno en particular).
 */
export function tendencia(
  inicio: number,
  actual: number,
  unidad: Unidad = 'relativa',
  bueno: -1 | 0 | 1 = 0,
): Tendencia {
  const d = actual - inicio;
  let cuanto: string;
  let nulo: boolean;
  if (unidad === 'puntosPct') {
    nulo = Math.abs(d) < 0.0005;
    cuanto =
      (Math.abs(d) * 100).toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + ' pt';
  } else if (unidad === 'puntos') {
    nulo = Math.abs(d) < 0.5;
    cuanto = num(Math.abs(d)) + ' pt';
  } else {
    const rel = inicio ? d / Math.abs(inicio) : 0;
    nulo = inicio ? Math.abs(rel) < 0.0005 : Math.abs(d) < 0.5;
    cuanto = inicio ? pct(Math.abs(rel)) : num(Math.abs(d));
  }
  const sentido = nulo ? 0 : d > 0 ? 1 : -1;
  return {
    sentido,
    texto:
      sentido === 0
        ? '= igual que al inicio'
        : `${sentido > 0 ? '▲ sube' : '▼ baja'} ${cuanto} desde el inicio`,
    tono: sentido === 0 || bueno === 0 ? '' : sentido === bueno ? 'bien' : 'mal',
  };
}

// Las categorías siguen la única estadística de titularidad publicada (Banco de España).
export const NOMBRE_PROPIETARIO: Record<Propietario, string> = {
  familias: 'Familias y pequeños propietarios',
  pequenos: 'Particulares con más de 10 viviendas',
  grandes: 'Empresas y fondos',
  publico: 'Parque público',
};

/** Rampa secuencial de un solo tono para el mapa de calor (oscuro = poca presión, rojo vivo = mucha). */
const RAMPA = [
  [58, 38, 34],
  [106, 44, 38],
  [156, 46, 40],
  [204, 44, 40],
  [240, 40, 40],
];
export function colorCalor(p: number): string {
  const x = Math.max(0, Math.min(1, p)) * (RAMPA.length - 1);
  const i = Math.min(RAMPA.length - 2, Math.floor(x));
  const t = x - i;
  const c = RAMPA[i].map((a, k) => Math.round(a + (RAMPA[i + 1][k] - a) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}
