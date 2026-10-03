/**
 * CATÁLOGO DE FACTORES
 * Cada factor es un número con un valor base. Las leyes (y el dinero impreso) no tocan el motor:
 * añaden modificadores sobre estos factores. Las reglas semanales leen siempre el valor ya
 * resuelto (base + sumas) × multiplicadores, acotado a [min, max].
 *
 * Para añadir un factor: declararlo aquí y leerlo desde una regla con f('grupo.nombre').
 * Cada factor declara su fuente; los que no tienen estadística publicada llevan 'supuesto'.
 */
import type { FuenteId } from './fuentes';

export interface DefFactor {
  nombre: string;
  grupo:
    | 'Quién busca casa'
    | 'Lo que pueden pagar'
    | 'Casas que salen al mercado'
    | 'Construcción'
    | 'Precios'
    | 'Reglas del alquiler'
    | 'Clima y dinero público';
  base: number;
  min?: number;
  max?: number;
  formato: 'num' | 'pct' | 'eur' | 'x' | 'anios' | 'meur';
  /** De dónde sale el valor base. 'supuesto' = hipótesis del modelo, sin estadística publicada. */
  fuente: FuenteId | readonly FuenteId[];
  /** true si subir el factor es, en general, malo para el acceso a la vivienda. */
  inverso?: boolean;
}

export const FACTORES = {
  // ── Quién busca casa ─────────────────────────────────────────────────────
  'demanda.inmigracion': {
    nombre: 'Familias que llegan del extranjero cada semana',
    grupo: 'Quién busca casa',
    base: 4840,
    min: 0,
    formato: 'num',
    inverso: true,
    fuente: 'inmigracion',
  },
  'demanda.emancipacion': {
    nombre: 'Familias nuevas (jóvenes que se independizan) cada semana',
    grupo: 'Quién busca casa',
    base: 3700,
    min: 0,
    formato: 'num',
    inverso: true,
    fuente: ['emancipacionDerivada', 'emancipacion'],
  },
  'demanda.busqueda': {
    nombre: 'De las familias sin casa, cuántas buscan activamente cada semana',
    grupo: 'Quién busca casa',
    base: 0.02,
    min: 0,
    max: 1,
    formato: 'pct',
    fuente: 'supuesto',
  },
  'demanda.abandono': {
    nombre: 'Familias sin casa que desisten (comparten piso o se marchan) cada semana',
    grupo: 'Quién busca casa',
    base: 0.001,
    min: 0,
    max: 1,
    formato: 'pct',
    fuente: 'supuesto',
  },
  'demanda.disolucion': {
    nombre: 'Hogares propietarios que desaparecen al año (herencias)',
    grupo: 'Quién busca casa',
    base: 0.009,
    min: 0,
    formato: 'pct',
    fuente: ['defunciones', 'supuesto'],
  },
  'demanda.preferenciaCompra': {
    nombre: 'Familias que prefieren comprar antes que alquilar',
    grupo: 'Quién busca casa',
    base: 0.4,
    min: 0,
    max: 1,
    formato: 'pct',
    fuente: 'supuesto',
  },

  // ── Lo que pueden pagar ──────────────────────────────────────────────────
  'renta.crecimiento': {
    nombre: 'Subida anual de los ingresos de los hogares',
    grupo: 'Lo que pueden pagar',
    base: 0.04,
    formato: 'pct',
    fuente: 'salarios',
  },
  'smi.crecimiento': {
    nombre: 'Subida anual del salario mínimo',
    grupo: 'Lo que pueden pagar',
    base: 0.04,
    formato: 'pct',
    fuente: ['smi', 'salarios'],
  },
  'acceso.esfuerzoAlquiler': {
    nombre: 'Parte de los ingresos que una familia puede dedicar al alquiler',
    grupo: 'Lo que pueden pagar',
    base: 0.4,
    min: 0.1,
    max: 0.8,
    formato: 'pct',
    fuente: ['esfuerzoAlquiler', 'supuesto'],
  },
  'acceso.ayudaAlquiler': {
    nombre: 'Ayuda pública al alquiler (€/mes)',
    grupo: 'Lo que pueden pagar',
    base: 0,
    min: 0,
    formato: 'eur',
    fuente: 'bonoJoven',
  },
  'hipoteca.tipo': {
    nombre: 'Tipo de interés de las hipotecas',
    grupo: 'Lo que pueden pagar',
    base: 0.029,
    min: 0.001,
    formato: 'pct',
    inverso: true,
    fuente: 'hipotecas',
  },
  'hipoteca.plazo': {
    nombre: 'Años de hipoteca',
    grupo: 'Lo que pueden pagar',
    base: 25,
    min: 5,
    max: 50,
    formato: 'anios',
    fuente: 'hipotecas',
  },
  'hipoteca.esfuerzo': {
    nombre: 'Parte de los ingresos que el banco deja dedicar a la cuota',
    grupo: 'Lo que pueden pagar',
    base: 0.35,
    min: 0.1,
    max: 0.6,
    formato: 'pct',
    fuente: ['esfuerzoBde', 'supuesto'],
  },
  'hipoteca.aval': {
    nombre: 'Parte extra del precio que el banco financia gracias a un aval público',
    grupo: 'Lo que pueden pagar',
    base: 0,
    min: 0,
    max: 0.5,
    formato: 'pct',
    fuente: 'avalesIco',
  },
  'impuesto.compra': {
    nombre: 'Impuestos al comprar una casa (ITP o IVA)',
    grupo: 'Lo que pueden pagar',
    base: 0.1,
    min: 0,
    max: 0.3,
    formato: 'pct',
    inverso: true,
    fuente: 'impuestoCompra',
  },

  // ── Casas que salen al mercado (ya construidas) ──────────────────────────
  'oferta.intencionAlquilar': {
    nombre: 'Ganas del propietario de alquilar (en vez de vender o dejar vacío)',
    grupo: 'Casas que salen al mercado',
    base: 0.6,
    min: 0,
    max: 1,
    formato: 'pct',
    fuente: ['rentabilidad', 'supuesto'],
  },
  'oferta.movilizacion': {
    nombre: 'Casas vacías que salen al mercado cada semana',
    grupo: 'Casas que salen al mercado',
    base: 0.00025,
    min: 0,
    formato: 'pct',
    fuente: 'supuesto',
  },
  'oferta.retirada': {
    nombre: 'Anuncios de alquiler que se retiran cada semana',
    grupo: 'Casas que salen al mercado',
    base: 0.02,
    min: 0,
    max: 1,
    formato: 'pct',
    inverso: true,
    fuente: 'supuesto',
  },
  'inversion.demanda': {
    nombre: 'Ganas de los inversores de comprar vivienda',
    grupo: 'Casas que salen al mercado',
    base: 1,
    min: 0,
    formato: 'x',
    inverso: true,
    fuente: 'supuesto',
  },
  'compra.publica': {
    nombre: 'Casas que compra el Estado cada semana para alquiler social',
    grupo: 'Casas que salen al mercado',
    base: 0,
    min: 0,
    formato: 'num',
    fuente: 'casa47',
  },

  // ── Construcción ─────────────────────────────────────────────────────────
  'construccion.privada': {
    nombre: 'Ritmo de la construcción privada',
    grupo: 'Construcción',
    base: 1,
    min: 0,
    formato: 'x',
    fuente: 'terminadas',
  },
  'construccion.publica': {
    nombre: 'Vivienda pública que se empieza cada semana',
    grupo: 'Construcción',
    base: 247,
    min: 0,
    formato: 'num',
    fuente: 'terminadas',
  },
  'construccion.concesion': {
    nombre: 'Vivienda asequible en suelo público que empiezan promotores privados cada semana',
    grupo: 'Construcción',
    base: 0,
    min: 0,
    formato: 'num',
    fuente: 'planEstatal',
  },
  'construccion.capacidad': {
    nombre: 'Máximo que puede construir el sector (viviendas por semana)',
    grupo: 'Construcción',
    base: 4200,
    min: 0,
    formato: 'num',
    fuente: ['visados', 'manoObra', 'supuesto'],
  },
  'construccion.retraso': {
    nombre: 'Semanas desde que se decide construir hasta que se entrega',
    grupo: 'Construcción',
    base: 90,
    min: 20,
    formato: 'num',
    inverso: true,
    fuente: 'licencias',
  },

  // ── Precios ──────────────────────────────────────────────────────────────
  'inflacion.general': {
    nombre: 'Inflación (IPC anual)',
    grupo: 'Precios',
    base: 0.031,
    formato: 'pct',
    inverso: true,
    fuente: ['ipc', 'imprimir'],
  },
  'alquiler.sensibilidad': {
    nombre: 'Cuánto reacciona el alquiler cuando falta (o sobra) vivienda',
    grupo: 'Precios',
    base: 0.2,
    min: 0,
    formato: 'x',
    fuente: 'supuesto',
  },
  'alquiler.crecimientoMax': {
    nombre: 'Subida máxima del alquiler al año',
    grupo: 'Precios',
    base: 0.18,
    formato: 'pct',
    inverso: true,
    fuente: 'supuesto',
  },
  'alquiler.crecimientoMin': {
    nombre: 'Bajada máxima del alquiler al año',
    grupo: 'Precios',
    base: -0.12,
    formato: 'pct',
    fuente: 'supuesto',
  },
  'venta.sensibilidad': {
    nombre: 'Cuánto reacciona el precio de venta cuando falta (o sobra) vivienda',
    grupo: 'Precios',
    base: 0.22,
    min: 0,
    formato: 'x',
    fuente: 'supuesto',
  },
  'venta.crecimientoMax': {
    nombre: 'Subida máxima del precio de venta al año',
    grupo: 'Precios',
    base: 0.15,
    formato: 'pct',
    inverso: true,
    fuente: 'supuesto',
  },
  'venta.crecimientoMin': {
    nombre: 'Bajada máxima del precio de venta al año',
    grupo: 'Precios',
    base: -0.1,
    formato: 'pct',
    fuente: 'supuesto',
  },

  // ── Reglas del alquiler ──────────────────────────────────────────────────
  'desahucios.tasa': {
    nombre: 'Inquilinos desahuciados cada semana',
    grupo: 'Reglas del alquiler',
    base: 0.0000877,
    min: 0,
    formato: 'pct',
    inverso: true,
    fuente: 'lanzamientos',
  },
  'contratos.noRenovacion': {
    nombre: 'Contratos que el casero no renueva cada semana (base)',
    grupo: 'Reglas del alquiler',
    base: 0.0006,
    min: 0,
    formato: 'pct',
    inverso: true,
    fuente: 'noRenovaciones',
  },

  // ── Clima político y dinero público ──────────────────────────────────────
  'confianza.objetivo': {
    nombre: 'Confianza de propietarios e inversores',
    grupo: 'Clima y dinero público',
    base: 60,
    min: 0,
    max: 100,
    formato: 'num',
    fuente: 'supuesto',
  },
  'tension.extra': {
    nombre: 'Tensión social que añaden o quitan las leyes',
    grupo: 'Clima y dinero público',
    base: 0,
    formato: 'num',
    inverso: true,
    fuente: 'supuesto',
  },
  'presupuesto.mensual': {
    nombre: 'Dinero público para vivienda cada mes (M€)',
    grupo: 'Clima y dinero público',
    base: 290,
    min: 0,
    formato: 'meur',
    fuente: ['pge', 'eurostatVivienda'],
  },
} as const satisfies Record<string, DefFactor>;

export type FactorId = keyof typeof FACTORES;
