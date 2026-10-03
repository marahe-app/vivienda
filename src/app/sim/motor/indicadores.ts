import { PARAMETROS as P } from '../datos/parametros';
import {
  PROPIETARIOS,
  type Ciudad,
  type Contexto,
  type Estado,
  type Flujos,
  type Propietario,
} from '../tipos';

export const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

export function flujosVacios(): Flujos {
  return {
    inmigrantes: 0,
    emancipados: 0,
    desahucios: 0,
    noRenovados: 0,
    logran: 0,
    noLogran: 0,
    construidas: 0,
    nuevaOferta: 0,
    compras: 0,
    contratos: 0,
    compraPublica: 0,
    costeCompraPublica: 0,
  };
}

export function hogares(c: Ciudad): number {
  let n = 0;
  for (const o of PROPIETARIOS) n += c.parque[o].propia + c.parque[o].alquilada;
  return n;
}

export function suma(
  c: Ciudad,
  campo: 'alquilada' | 'ofAlquiler' | 'ofVenta' | 'vacia' | 'propia',
  soloPrivado = false,
): number {
  let n = 0;
  for (const o of PROPIETARIOS) if (!soloPrivado || o !== 'publico') n += c.parque[o][campo];
  return n;
}

/** Todas las viviendas de una ciudad, en cualquier situación. */
export function viviendas(c: Ciudad): number {
  let n = 0;
  for (const o of PROPIETARIOS) {
    const p = c.parque[o];
    n += p.propia + p.alquilada + p.ofAlquiler + p.ofVenta + p.vacia;
  }
  return n;
}

/** Rentabilidad bruta del alquiler por m²: la vivienda media que se alquila es más pequeña que la que se vende. */
export const rentabilidad = (alquiler: number, precio: number) =>
  ((alquiler / P.superficieAlquiler) * 12) / (precio / P.superficieVenta);

/** Años de renta neta que presta un banco: cuota del 35 % de la renta, al tipo y plazo medios, más lo que cubra un aval público. */
export function aniosFinanciables(
  tipo: number,
  plazo: number,
  esfuerzo: number,
  aval: number,
): number {
  const anualidad = tipo > 1e-6 ? (1 - Math.pow(1 + tipo, -plazo)) / tipo : plazo;
  return esfuerzo * anualidad * (1 + aval);
}

/**
 * Presión de vivienda de una ciudad: 0 = ninguna, 1 = los umbrales de PARAMETROS.presion.
 * No se recorta en 1: cada componente puede llegar al doble, así una ciudad que empeora sigue sumando.
 */
export function presion(c: Ciudad): number {
  const u = P.presion;
  const esfuerzo = c.alquiler / ((c.renta * P.rentaBuscadores) / 12);
  const anios = c.precio / c.renta;
  const espera = c.espera / (hogares(c) + c.espera);
  const comp = (x: number) => clamp(x, 0, u.tope);
  return (
    u.pesos.esfuerzo * comp(esfuerzo / u.esfuerzo) +
    u.pesos.aniosCompra * comp(anios / u.aniosCompra) +
    u.pesos.espera * comp(espera / u.espera)
  );
}

export interface PresionNacional {
  /** Media ponderada por hogares (las grandes ciudades pesan doble, el resto de España la mitad). */
  ponderada: number;
  /** Media de las seis grandes áreas urbanas. */
  principales: number;
}

export function presionNacional(e: Estado): PresionNacional {
  let sw = 0,
    sp = 0,
    swP = 0,
    spP = 0;
  for (const c of e.ciudades) {
    const h = hogares(c);
    const p = presion(c);
    const w =
      h * (c.principal ? P.peso.principal : c.id === 'resto' ? P.peso.resto : P.peso.normal);
    sw += w;
    sp += w * p;
    if (c.principal) {
      swP += h;
      spP += h * p;
    }
  }
  return { ponderada: sw ? sp / sw : 0, principales: swP ? spP / swP : 0 };
}

export interface Indicadores {
  hogares: number;
  espera: number;
  alojadas: number;
  aniosCompra: number;
  esfuerzoSmi: number;
  alquilerMercado: number;
  alquilerMedio: number;
  precioMedio: number;
  rentaMedia: number;
  crecAlq: number;
  crecVenta: number;
  ofAlquiler: number;
  ofVenta: number;
  flujos: Flujos;
  /** Viviendas por propietario: en mercado (alquiladas + anunciadas) y en total. */
  mercado: Record<Propietario, number>;
  parque: Record<Propietario, number>;
  /** Viviendas anunciadas en alquiler y en venta, por propietario. */
  enAlquiler: Record<Propietario, number>;
  enVenta: Record<Propietario, number>;
  /** Viviendas privadas vacías e inquilinos del sector privado. */
  vacias: number;
  inquilinos: number;
  presion: PresionNacional;
  cumple: { alojadas: boolean; compra: boolean; alquiler: boolean };
}

export function indicadores(e: Estado, impuestoCompra: number): Indicadores {
  const flujos = flujosVacios();
  const mercado = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const parque = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const enAlquiler = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const enVenta = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  let h = 0,
    espera = 0,
    precio = 0,
    renta = 0,
    alqMercado = 0,
    crecAlq = 0,
    crecVenta = 0;
  let alqPriv = 0,
    alqPub = 0,
    ofAlquiler = 0,
    ofVenta = 0,
    vacias = 0;

  for (const c of e.ciudades) {
    const hc = hogares(c);
    h += hc;
    espera += c.espera;
    precio += c.precio * hc;
    renta += c.renta * hc;
    crecVenta += c.crecVenta * hc;
    const priv = suma(c, 'alquilada', true);
    alqPriv += priv;
    alqPub += c.parque.publico.alquilada;
    alqMercado += c.alquiler * priv;
    crecAlq += c.crecAlq * priv;
    ofAlquiler += suma(c, 'ofAlquiler');
    ofVenta += suma(c, 'ofVenta');
    vacias += suma(c, 'vacia', true);
    for (const o of PROPIETARIOS) {
      const p = c.parque[o];
      mercado[o] += p.alquilada + p.ofAlquiler + p.ofVenta;
      parque[o] += p.propia + p.alquilada + p.ofAlquiler + p.ofVenta + p.vacia;
      enAlquiler[o] += p.ofAlquiler;
      enVenta[o] += p.ofVenta;
    }
    let k: keyof Flujos;
    for (k in flujos) flujos[k] += c.flujos[k];
  }

  const alquilerMercado = alqMercado / alqPriv;
  const alquilerMedio = (alqMercado + alqPub * e.smi * P.alquilerSocialPctSmi) / (alqPriv + alqPub);
  const precioMedio = precio / h;
  const rentaMedia = renta / h;
  const alojadas = h / (h + espera);
  const aniosCompra = (precioMedio * (1 + impuestoCompra)) / rentaMedia;
  const esfuerzoSmi = alquilerMedio / e.smi;

  return {
    hogares: h,
    espera,
    alojadas,
    aniosCompra,
    esfuerzoSmi,
    alquilerMercado,
    alquilerMedio,
    precioMedio,
    rentaMedia,
    crecAlq: crecAlq / alqPriv,
    crecVenta: crecVenta / h,
    ofAlquiler,
    ofVenta,
    flujos,
    mercado,
    parque,
    enAlquiler,
    enVenta,
    vacias,
    inquilinos: alqPriv,
    presion: presionNacional(e),
    cumple: {
      alojadas: alojadas >= P.objetivos.alojadas,
      compra: aniosCompra <= P.objetivos.aniosCompra,
      alquiler: esfuerzoSmi <= P.objetivos.esfuerzoSmi,
    },
  };
}

/** Las cifras que necesitan las leyes para calcular lo que cuestan. */
export function contexto(i: Indicadores): Contexto {
  return {
    contratos: i.flujos.contratos,
    compras: i.flujos.compras,
    precioMedio: i.precioMedio,
    alquilerMedio: i.alquilerMercado,
    inquilinos: i.inquilinos,
    vacias: i.vacias,
    parqueGrandes: i.parque.grandes,
  };
}

export interface Postura {
  eco: number;
  soc: number;
  etiqueta: string;
}

export function postura(decretos: { eco: number; soc: number }[]): Postura {
  if (!decretos.length) return { eco: 0, soc: 0, etiqueta: 'Sin definir' };
  const eco = decretos.reduce((s, d) => s + d.eco, 0) / decretos.length;
  const soc = decretos.reduce((s, d) => s + d.soc, 0) / decretos.length;
  let etiqueta =
    eco < -1.1
      ? 'Intervencionista'
      : eco < -0.35
        ? 'Socialdemócrata'
        : eco <= 0.35
          ? 'Centrista'
          : eco <= 1.1
            ? 'Liberal'
            : 'Ultraliberal';
  if (soc > 0.25) etiqueta += ' · restrictivo';
  else if (soc < -0.25) etiqueta += ' · aperturista';
  return { eco, soc, etiqueta };
}
