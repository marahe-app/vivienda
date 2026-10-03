import type { Propietario } from '../tipos';
import type { FuenteId } from './fuentes';

/**
 * Constantes del modelo que no son objeto de ley.
 * Lo que una ley puede mover vive en factores.ts.
 * FUENTE_PARAMETRO indica de dónde sale cada cifra publicada; lo que no aparece ahí
 * es un supuesto de comportamiento del simulador.
 */
export const PARAMETROS = {
  fechaInicio: '2026-10-05',

  // ── Cifras publicadas ────────────────────────────────────────────────────
  /** SMI 2026: 17.094 €/año, en 12 pagas. */
  smiMensual: 17_094 / 12,
  /** Personas por hogar: convierte personas en familias. */
  tamanoHogar: 2.49,
  /** Saldo migratorio exterior, personas: 2024 y acumulado 2018-2024. */
  saldoExterior2024: 626_268,
  saldoExterior2018a2024: 3_194_410,
  /** Semanas entre el 1-ene-2025 y el inicio: el contador las cubre al ritmo de 2024 (sin dato publicado). */
  semanasSinDatoMigracion: 92,
  /** Renta neta media por hogar: ECV 2025 frente al Atlas 2023, para actualizar las rentas provinciales. */
  rentaHogarEcv2025: 38_994,
  rentaHogarAtlas2023: 38_326,
  /** Hogares en alquiler (mercado + precio reducido): ECV 2025 frente al Censo 2021. */
  pctAlquilerEcv2025: 0.202,
  pctAlquilerCenso2021: 0.161,
  /** Superficie media: vivienda transmitida (Registradores) y vivienda alquilada (SERPAVI). */
  superficieVenta: 100.7,
  superficieAlquiler: 75.6,
  /** Viviendas públicas en alquiler (CCAA + ayuntamientos). */
  viviendaPublicaAlquiler: 318_000,
  /** Del alquiler privado: empresas (personas jurídicas) y particulares con más de 10 viviendas. */
  alquilerEmpresas: 0.08,
  alquilerGrandesParticulares: 0.07,
  /** Viviendas anunciadas en venta (media 2016-2023). */
  ofertaVenta: 820_000,
  /** Déficit de viviendas acumulado 2021-2025. */
  deficitViviendas: 750_000,
  /** Viviendas protegidas terminadas en 2025. */
  terminadasProtegidas: 12_858,
  /** Viviendas de uso turístico sobre el parque total (INE, mayo 2026). */
  pctTuristicas: 0.0128,
  /** Compraventas de vivienda al año: base de las rebajas fiscales a la compra. */
  compraventasAnuales: 700_000,
  /** Coste de una vivienda pública nueva (M€): Casa 47, 260 M€ para 1.629 viviendas. */
  costeViviendaPublica: 0.16,
  /** Dinero público para vivienda al año (M€), PGE 2023. La cartera recibe 1/12 cada mes. */
  presupuestoAnual: 3_472,

  // ── Supuestos del modelo ─────────────────────────────────────────────────
  /** Hogares jóvenes que querrían emanciparse y no pueden: demanda latente que el déficit oficial no recoge. */
  jovenesLatentes: 590_000,
  /** Anuncios de alquiler sin inquilino, sobre viviendas alquiladas. */
  ofertaAlquilerInicial: 0.008,

  objetivos: {
    /** Familias con vivienda sobre el total de familias (alojadas + en espera). */
    alojadas: 0.95,
    /** Precio de compra (con impuestos) en años de renta neta del hogar medio: el nivel de finales de los noventa. */
    aniosCompra: 6,
    /** Alquiler medio como parte del salario mínimo. */
    esfuerzoSmi: 0.35,
  },

  /** Renta de quien busca vivienda respecto a la media (jóvenes y recién llegados ganan menos). */
  rentaBuscadores: 0.8,
  /** Alquiler de la vivienda pública, como parte del SMI. */
  alquilerSocialPctSmi: 0.25,
  /** Dureza del corte de accesibilidad: cuanto mayor, más brusco. */
  exponenteAcceso: 3.5,

  /** Inquilinos que intentan comprar cada semana. */
  inquilinosCompran: 0.0007,
  /** Parte de la oferta que puede cerrarse en una semana. */
  rotacionVenta: 0.03,
  rotacionAlquiler: 0.5,
  /** Oferta "normal" absorbida por semana: referencia para el ratio demanda/oferta. */
  absorcionVenta: 0.01,
  absorcionAlquiler: 0.25,
  /** Compras de inversores por semana y por hogar de la ciudad (≈ 1.850 y 1.230 a la semana en toda España al inicio). */
  inversionBase: { familias: 0, pequenos: 0.000093, grandes: 0.000062, publico: 0 } as Record<
    Propietario,
    number
  >,

  /** Cuánto pesa la rentabilidad bruta en la intención de alquilar. */
  sensRentabilidad: { familias: 5, pequenos: 7, grandes: 9, publico: 0 } as Record<
    Propietario,
    number
  >,
  rentabilidadNeutra: 0.05,
  /** Rapidez relativa con la que cada propietario saca vivienda vacía al mercado. */
  movilizacion: { familias: 1, pequenos: 2.5, grandes: 6, publico: 20 } as Record<
    Propietario,
    number
  >,

  /** Destino de la vivienda de un hogar que desaparece (herencias). */
  herencia: { venta: 0.55, alquiler: 0.15, vacia: 0.3 },
  /** Quién promueve la obra nueva privada. */
  repartoObra: { familias: 0.1, pequenos: 0.3, grandes: 0.6 },
  /** Parte de la obra de grandes promotores destinada a alquiler. */
  obraParaAlquiler: 0.25,

  /** Por debajo de esta parte del precio de partida (actualizado con el IPC) no se vende ni se alquila: no cubre costes. */
  sueloPrecio: 0.55,
  sueloAlquiler: 0.5,

  /** Cuando la inflación se desvía de la base, salarios y SMI recogen esta parte del exceso. */
  traspasoInflacion: 0.7,
  /** Puntos de IPC que añade cada 1.000 M€ impresos, y durante cuántas semanas. */
  inflacionPorMilMillones: 0.0008,
  semanasInflacionImpresa: 104,
  /** Lo que se imprime de golpe (M€). */
  tramoImpresion: 1000,

  /** Índice de presión de una ciudad: 100 = estos umbrales. Cada componente puede llegar al doble. */
  presion: {
    esfuerzo: 0.7,
    aniosCompra: 13,
    espera: 0.12,
    tope: 2,
    pesos: { esfuerzo: 0.35, aniosCompra: 0.25, espera: 0.4 },
  },
  /** Hogares a partir de los cuales una provincia es una «gran área urbana». */
  principalMinHogares: 700_000,
  /** Peso de cada hogar en la tensión social según dónde vive. */
  peso: { principal: 2, normal: 1, resto: 0.5 },
  /** Familias expulsadas del alquiler por semana que se consideran «normales» (CGPJ + no renovaciones). */
  expulsadosRef: 1000,

  semanasCalentamiento: 26,
  maxHistorial: 1600,
};

export const FUENTE_PARAMETRO = {
  smiMensual: 'smi',
  tamanoHogar: 'hogares',
  saldoExterior2024: 'inmigracion',
  saldoExterior2018a2024: 'inmigracion',
  rentaHogarEcv2025: 'rentaHogar',
  rentaHogarAtlas2023: 'rentaProvincia',
  pctAlquilerEcv2025: 'tenenciaEcv',
  pctAlquilerCenso2021: 'tenencia',
  superficieVenta: 'superficieVenta',
  superficieAlquiler: 'superficieAlquiler',
  viviendaPublicaAlquiler: 'viviendaPublica',
  alquilerEmpresas: 'propiedadAlquiler',
  alquilerGrandesParticulares: 'propiedadAlquiler',
  ofertaVenta: 'ofertaVenta',
  deficitViviendas: 'deficit',
  terminadasProtegidas: 'terminadas',
  pctTuristicas: 'turisticas',
  compraventasAnuales: 'compraventas',
  costeViviendaPublica: 'casa47',
  presupuestoAnual: 'pge',
} as const satisfies Partial<Record<keyof typeof PARAMETROS, FuenteId>>;
