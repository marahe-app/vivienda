import type { FactorId } from './datos/factores';
import type { FuenteId } from './datos/fuentes';

export const PROPIETARIOS = ['familias', 'pequenos', 'grandes', 'publico'] as const;
export type Propietario = (typeof PROPIETARIOS)[number];

/** Viviendas de un tipo de propietario en una ciudad, según su situación. */
export interface Parque {
  /** Ocupada por su dueño (solo familias). */
  propia: number;
  alquilada: number;
  /** Anunciada en alquiler y aún sin inquilino. */
  ofAlquiler: number;
  /** Anunciada en venta. */
  ofVenta: number;
  /** Fuera de mercado: vacía, segunda residencia, uso turístico. */
  vacia: number;
}

/** Lo que ha pasado en una semana (hogares o viviendas). */
export interface Flujos {
  inmigrantes: number;
  emancipados: number;
  desahucios: number;
  noRenovados: number;
  logran: number;
  noLogran: number;
  construidas: number;
  nuevaOferta: number;
  compras: number;
  contratos: number;
  /** Viviendas compradas por el Estado y su coste (M€). */
  compraPublica: number;
  costeCompraPublica: number;
}

export interface Ciudad {
  id: string;
  nombre: string;
  lon: number;
  lat: number;
  /** Las seis grandes áreas urbanas pesan más en la tensión social. */
  principal: boolean;
  /** Hogares que buscan vivienda y no la tienen (recién llegados, jóvenes sin emancipar, expulsados). */
  espera: number;
  parque: Record<Propietario, Parque>;
  /** Precio medio de compra (€). */
  precio: number;
  /** Alquiler medio de mercado (€/mes). */
  alquiler: number;
  /** Renta neta anual media del hogar (€). */
  renta: number;
  cuotaInm: number;
  cuotaEman: number;
  /** Viviendas privadas terminadas por semana en la situación de partida. */
  obraBase: number;
  ritmoObra: number;
  ritmoObraPublica: number;
  /** Vivienda asequible que construyen promotores privados sobre suelo público: el Estado solo paga el suelo. */
  ritmoObraConcesion: number;
  /** Precio y alquiler de referencia (crecen con el IPC): miden el margen del promotor y ponen suelo a las caídas. */
  precioRef: number;
  alquilerRef: number;
  /** Crecimientos anuales observados al inicio; sirven para calibrar los ratios neutros. */
  crecAlqRef: number;
  crecVentaRef: number;
  neutroAlq: number;
  neutroVenta: number;
  ratioAlq: number;
  ratioVenta: number;
  /** Crecimiento anualizado actual. */
  crecAlq: number;
  crecVenta: number;
  rentabilidad: number;
  /** Intención de alquilar (0-1) de cada tipo de propietario. */
  intencion: Record<Propietario, number>;
  flujos: Flujos;
}

/**
 * suma: se añade a la base · mult: multiplica por (1 + valor)
 * tope: el resultado no puede superar valor · suelo: no puede bajar de valor
 */
export type Operacion = 'suma' | 'mult' | 'tope' | 'suelo';

export interface Efecto {
  factor: FactorId;
  op: Operacion;
  valor: number;
  /** Si se indica, solo afecta a ese tipo de propietario / esa ciudad. */
  propietario?: Propietario;
  ciudad?: string;
  /** Duración en semanas; sin indicar es permanente. */
  semanas?: number;
}

/** Un efecto activo en la partida: bonificador o penalizador con su origen. */
export interface Modificador extends Efecto {
  origen: string;
  etiqueta: string;
  hasta?: number;
}

export interface Ambito {
  propietario?: Propietario;
  ciudad?: string;
}
export type Resolver = (id: FactorId, ambito?: Ambito) => number;

export type Categoria =
  | 'Impuestos y dinero público'
  | 'Construir más'
  | 'Control de precios'
  | 'Reglas del alquiler'
  | 'Vivienda pública'
  | 'Quién busca casa';

/** Lo que el jugador puede ajustar en una ley: un número entre min y max. */
export interface Parametro {
  nombre: string;
  min: number;
  max: number;
  paso: number;
  defecto: number;
  /** Cómo se muestra el valor: '%' , '€/mes', 'M€/mes', 'meses', 'viviendas/semana'... */
  unidad: string;
}

/** Cifras de la partida que necesitan los costes de las leyes (se calculan una vez por semana). */
export interface Contexto {
  /** Contratos de alquiler y compras de familias por semana. */
  contratos: number;
  compras: number;
  precioMedio: number;
  alquilerMedio: number;
  /** Hogares inquilinos del sector privado y viviendas vacías privadas. */
  inquilinos: number;
  vacias: number;
  /** Viviendas en manos de empresas y fondos. */
  parqueGrandes: number;
}

export interface Decreto {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  /** eco: -2 Estado … +2 mercado · soc: -2 aperturista … +2 restrictivo */
  ideologia: { eco: number; soc: number };
  /** Si la ley tiene un ajuste, aquí va. Sin él, la ley se activa o se deroga. */
  parametro?: Parametro;
  /** Al promulgarlo deroga las demás leyes del mismo grupo; no pueden ir dos en el mismo decreto. */
  grupo?: string;
  /** Efectos para un valor del parámetro (1 si la ley no tiene parámetro). Pueden mirar el estado. */
  efectos: (v: number, e: Estado) => Efecto[];
  /** Coste anual en M€ (negativo = recauda). */
  coste?: (v: number, ctx: Contexto) => number;
  /** Efecto inmediato y puntual que no se puede expresar como modificador. Se repite si se vuelve a promulgar. */
  alAplicar?: (e: Estado, v: number) => void;
  notaInmediata?: (v: number) => string;
  /** Si la ley se puede volver a promulgar con el mismo valor (su efecto inmediato se repite). */
  repetible?: boolean;
  /** Ley o propuesta real en la que se inspira, y estudios sobre su efecto. */
  fuentes: FuenteId[];
}

/** Un cambio dentro de un decreto: fijar una ley a un valor, o derogarla (valor null). */
export interface Cambio {
  id: string;
  valor: number | null;
}

export interface PuntoHistorial {
  semana: number;
  alojadas: number;
  /** Hogares que buscan vivienda y no la tienen. */
  espera: number;
  aniosCompra: number;
  esfuerzoSmi: number;
  tension: number;
  confianza: number;
  /** Lo ocurrido esa semana en todo el país y los precios del momento. */
  flujos: Flujos;
  alquiler: number;
  precio: number;
  smi: number;
  impuestoCompra: number;
  ipc: number;
  gasto: number;
  saldo: number;
  /** Viviendas anunciadas, por propietario. */
  ofAlquiler: Record<Propietario, number>;
  ofVenta: Record<Propietario, number>;
}

/** El dinero del que dispone el gobierno para vivienda. */
export interface Cartera {
  /** Lo que queda este mes (M€). Puede ser negativo: números rojos. */
  saldo: number;
  /** Lo que entra cada mes (M€). */
  presupuestoMensual: number;
  /** Dinero creado de la nada desde el inicio y en el año en curso (M€). */
  impreso: number;
  impresoAnio: number;
}

export interface Estado {
  semana: number;
  fecha: Date;
  /** Salario mínimo bruto mensual (12 pagas). */
  smi: number;
  ciudades: Ciudad[];
  modificadores: Modificador[];
  /** Valor en vigor de cada ley (id → valor del parámetro, o 1 si no tiene). */
  vigentes: Record<string, number>;
  /** Historial de cambios: valor null = derogación. */
  decretosPromulgados: { id: string; semana: number; valor: number | null }[];
  decretoDisponible: boolean;
  confianza: number;
  tension: number;
  /** Gasto neto anual en política de vivienda (M€). */
  gastoAnual: number;
  /** Nivel de precios al consumo respecto al inicio (1 = octubre de 2026): actualiza costes y presupuesto. */
  nivelPrecios: number;
  cartera: Cartera;
  contadores: { inmigrantesDesde2018: number; expulsados: number; construidas: number };
  historial: PuntoHistorial[];
  fin: null | 'victoria' | 'derrota';
  /** Durante el calentamiento inicial no se mueven precios ni rentas. */
  calibrando: boolean;
}

export type Regla = { id: string; nombre: string; ejecutar: (e: Estado, f: Resolver) => void };
