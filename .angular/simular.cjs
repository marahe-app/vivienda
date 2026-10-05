// src/app/sim/datos/ciudades.ts
var RESTO = "resto";
var NOMBRE_CIUDAD = {};
var CIUDADES = [
  {
    id: "madrid",
    nombre: "Madrid",
    lon: -3.7,
    lat: 40.42,
    hogares: 2769834,
    viviendas: 3054762,
    pctAlquiler: 0.2065,
    precioM2: 5065,
    alquilerM2: 21.6,
    renta: 48806,
    saldoExterior: 113964,
    terminadasLibres: 13496,
    crecAlq: 0.0565,
    crecVenta: 0.069
  },
  {
    id: "barcelona",
    nombre: "Barcelona",
    lon: 2.17,
    lat: 41.39,
    hogares: 2341715,
    viviendas: 2647478,
    pctAlquiler: 0.2378,
    precioM2: 3506,
    alquilerM2: 17.2,
    renta: 44243,
    saldoExterior: 100718,
    terminadasLibres: 7886,
    crecAlq: 0.0158,
    crecVenta: 0.115
  },
  {
    id: "valencia",
    nombre: "Valencia",
    lon: -0.38,
    lat: 39.47,
    hogares: 1125639,
    viviendas: 1508589,
    pctAlquiler: 0.1381,
    precioM2: 2208,
    alquilerM2: 14.2,
    renta: 36532,
    saldoExterior: 53118,
    terminadasLibres: 2752,
    crecAlq: 0.0503,
    crecVenta: 0.151
  },
  {
    id: "sevilla",
    nombre: "Sevilla",
    lon: -5.98,
    lat: 37.39,
    hogares: 768819,
    viviendas: 936812,
    pctAlquiler: 0.1041,
    precioM2: 2080,
    alquilerM2: 12.2,
    renta: 34269,
    saldoExterior: 10965,
    terminadasLibres: 4552,
    crecAlq: 0.0406,
    crecVenta: 0.147
  },
  {
    id: "malaga",
    nombre: "M\xE1laga",
    lon: -4.42,
    lat: 36.72,
    hogares: 718981,
    viviendas: 1025676,
    pctAlquiler: 0.131,
    precioM2: 4317,
    alquilerM2: 18.8,
    renta: 33868,
    saldoExterior: 21066,
    terminadasLibres: 6248,
    crecAlq: 0.057,
    crecVenta: 0.066
  },
  {
    id: "alicante",
    nombre: "Alicante",
    lon: -0.48,
    lat: 38.35,
    hogares: 843929,
    viviendas: 1373953,
    pctAlquiler: 0.1522,
    precioM2: 2767,
    alquilerM2: 12.7,
    renta: 31507,
    saldoExterior: 40933,
    terminadasLibres: 5266,
    crecAlq: 0.0713,
    crecVenta: 0.078
  },
  {
    id: "baleares",
    nombre: "Palma",
    lon: 2.65,
    lat: 39.57,
    hogares: 472869,
    viviendas: 667439,
    pctAlquiler: 0.2345,
    precioM2: 5593,
    alquilerM2: 20.2,
    renta: 44812,
    saldoExterior: 15735,
    terminadasLibres: 2482,
    crecAlq: 0.0363,
    crecVenta: 0.041
  },
  {
    id: "laspalmas",
    nombre: "Las Palmas",
    lon: -15.43,
    lat: 28.12,
    hogares: 451626,
    viviendas: 558773,
    pctAlquiler: 0.2177,
    precioM2: 3113,
    alquilerM2: 15.1,
    renta: 37032,
    saldoExterior: 14628,
    terminadasLibres: 1879,
    crecAlq: 0.0395,
    crecVenta: 0.104
  },
  {
    id: "tenerife",
    nombre: "Sta. Cruz de Tenerife",
    lon: -16.25,
    lat: 28.47,
    hogares: 420534,
    viviendas: 543425,
    pctAlquiler: 0.2218,
    precioM2: 3514,
    alquilerM2: 15.3,
    renta: 35654,
    saldoExterior: 12703,
    terminadasLibres: 1273,
    crecAlq: 0.0452,
    crecVenta: 0.037
  },
  {
    id: "zaragoza",
    nombre: "Zaragoza",
    lon: -0.88,
    lat: 41.65,
    hogares: 426221,
    viviendas: 552858,
    pctAlquiler: 0.1657,
    precioM2: 1777,
    alquilerM2: 11.7,
    renta: 38230,
    saldoExterior: 12398,
    terminadasLibres: 1306,
    crecAlq: 0.0971,
    crecVenta: 0.144
  },
  {
    id: "bizkaia",
    nombre: "Bilbao",
    lon: -2.93,
    lat: 43.26,
    hogares: 503573,
    viviendas: 567818,
    pctAlquiler: 0.1226,
    precioM2: 3588,
    alquilerM2: 15.3,
    renta: 44425,
    saldoExterior: 12536,
    terminadasLibres: 1541,
    crecAlq: 0.0316,
    crecVenta: 0.096
  },
  {
    id: "murcia",
    nombre: "Murcia",
    lon: -1.13,
    lat: 37.99,
    hogares: 595361,
    viviendas: 856348,
    pctAlquiler: 0.1565,
    precioM2: 1689,
    alquilerM2: 9.5,
    renta: 34951,
    saldoExterior: 18704,
    terminadasLibres: 2969,
    crecAlq: 0.0479,
    crecVenta: 0.139
  },
  {
    id: "coruna",
    nombre: "A Coru\xF1a",
    lon: -8.41,
    lat: 43.36,
    hogares: 476055,
    viviendas: 693598,
    pctAlquiler: 0.139,
    precioM2: 1773,
    alquilerM2: 9.9,
    renta: 36978,
    saldoExterior: 13086,
    terminadasLibres: 976,
    crecAlq: 0.0252,
    crecVenta: 0.133
  },
  {
    id: "valladolid",
    nombre: "Valladolid",
    lon: -4.72,
    lat: 41.65,
    hogares: 230083,
    viviendas: 303301,
    pctAlquiler: 0.1346,
    precioM2: 1693,
    alquilerM2: 9.7,
    renta: 36785,
    saldoExterior: 4239,
    terminadasLibres: 1163,
    crecAlq: 0.0635,
    crecVenta: 0.13
  },
  {
    id: "granada",
    nombre: "Granada",
    lon: -3.6,
    lat: 37.18,
    hogares: 397625,
    viviendas: 581448,
    pctAlquiler: 0.1277,
    precioM2: 1890,
    alquilerM2: 10.3,
    renta: 31314,
    saldoExterior: 7465,
    terminadasLibres: 1394,
    crecAlq: 0.036,
    crecVenta: 0.13
  },
  {
    id: "asturias",
    nombre: "Oviedo-Gij\xF3n",
    lon: -5.85,
    lat: 43.36,
    hogares: 464062,
    viviendas: 685892,
    pctAlquiler: 0.1303,
    precioM2: 1892,
    alquilerM2: 10.9,
    renta: 35265,
    saldoExterior: 10340,
    terminadasLibres: 1627,
    crecAlq: 0.0931,
    crecVenta: 0.126
  },
  {
    id: RESTO,
    nombre: "Resto de Espa\xF1a",
    lon: -3.2,
    lat: 39.4,
    hogares: 6867934,
    viviendas: 10541386,
    pctAlquiler: 0.1279,
    precioM2: 1555,
    alquilerM2: 9.4,
    renta: 34546,
    saldoExterior: 163670,
    terminadasLibres: 23982,
    crecAlq: 0.0616,
    crecVenta: 0.103
  }
];
for (const c of CIUDADES) NOMBRE_CIUDAD[c.id] = c.nombre;
var COSTA = [
  "malaga",
  "alicante",
  "baleares",
  "laspalmas",
  "tenerife",
  "barcelona",
  "valencia",
  "murcia",
  "madrid"
];

// src/app/sim/datos/parametros.ts
var PARAMETROS = {
  fechaInicio: "2026-10-05",
  // ── Cifras publicadas ────────────────────────────────────────────────────
  /** SMI 2026: 17.094 €/año, en 12 pagas. */
  smiMensual: 17094 / 12,
  /** Personas por hogar: convierte personas en familias. */
  tamanoHogar: 2.49,
  /** Saldo migratorio exterior, personas: 2024 y acumulado 2018-2024. */
  saldoExterior2024: 626268,
  saldoExterior2018a2024: 3194410,
  /** Semanas entre el 1-ene-2025 y el inicio: el contador las cubre al ritmo de 2024 (sin dato publicado). */
  semanasSinDatoMigracion: 92,
  /** Renta neta media por hogar: ECV 2025 frente al Atlas 2023, para actualizar las rentas provinciales. */
  rentaHogarEcv2025: 38994,
  rentaHogarAtlas2023: 38326,
  /** Hogares en alquiler (mercado + precio reducido): ECV 2025 frente al Censo 2021. */
  pctAlquilerEcv2025: 0.202,
  pctAlquilerCenso2021: 0.161,
  /** Superficie media: vivienda transmitida (Registradores) y vivienda alquilada (SERPAVI). */
  superficieVenta: 100.7,
  superficieAlquiler: 75.6,
  /** Viviendas públicas en alquiler (CCAA + ayuntamientos). */
  viviendaPublicaAlquiler: 318e3,
  /** Del alquiler privado: empresas (personas jurídicas) y particulares con más de 10 viviendas. */
  alquilerEmpresas: 0.08,
  alquilerGrandesParticulares: 0.07,
  /** Viviendas anunciadas en venta (media 2016-2023). */
  ofertaVenta: 82e4,
  /** Déficit de viviendas acumulado 2021-2025. */
  deficitViviendas: 75e4,
  /** Viviendas protegidas terminadas en 2025. */
  terminadasProtegidas: 12858,
  /** Viviendas de uso turístico sobre el parque total (INE, mayo 2026). */
  pctTuristicas: 0.0128,
  /** Compraventas de vivienda al año: base de las rebajas fiscales a la compra. */
  compraventasAnuales: 7e5,
  /** Coste de una vivienda pública nueva (M€): Casa 47, 260 M€ para 1.629 viviendas. */
  costeViviendaPublica: 0.16,
  /** Dinero público para vivienda al año (M€), PGE 2023. La cartera recibe 1/12 cada mes. */
  presupuestoAnual: 3472,
  /** Coste de construir un m² (ejecución más honorarios y gastos, sin suelo), 2025. */
  costeConstruccionM2: 1350,
  // ── Supuestos del modelo ─────────────────────────────────────────────────
  /** Hogares jóvenes que querrían emanciparse y no pueden: demanda latente que el déficit oficial no recoge. */
  jovenesLatentes: 59e4,
  /** Anuncios de alquiler sin inquilino, sobre viviendas alquiladas. */
  ofertaAlquilerInicial: 8e-3,
  /** Lo que paga de media un inquilino con contrato, respecto al precio de un anuncio de hoy. */
  alquilerVivoInicial: 0.88,
  /** Semanas que tarda un contrato en renegociarse a precio de mercado: cinco años más las prórrogas. */
  semanasContrato: 364,
  /** Cuando el mercado paga esto más que el inquilino, el casero deja de renovar el doble de contratos. */
  brechaNoRenovacion: 0.45,
  /** Hogares inquilinos que desaparecen, respecto a los propietarios: son más jóvenes. */
  disolucionInquilinos: 0.5,
  /**
   * Cuánto bajan las llegadas y la emancipación cuando alquilar cuesta más esfuerzo que al inicio
   * (y cuánto suben si cuesta menos), y entre qué límites.
   */
  elasticidadDemanda: { inmigracion: 0.5, emancipacion: 1, min: 0.5, max: 1.1 },
  /** Ahorro (propio y de la familia) con el que cuenta quien quiere comprar, en años de su renta: de ahí sale la entrada. */
  ahorroCompra: 1.9,
  /** Autónomos afiliados (≈ 3,3 millones): base de la rebaja de su cuota. */
  autonomos: 33e5,
  /** Lo que cuesta al año gestionar y mantener una vivienda pública (comunidad, reparaciones, impagos, vacantes), en € de inicio. */
  gestionPublica: 1600,
  /** Parte del precio de la obra nueva que se añade (respecto a la de partida) que vuelve a la cartera como IVA. */
  retornoFiscalObra: 0.1,
  /** La vivienda usada se vende por debajo de lo que costaría construirla: suelo absoluto del precio. */
  descuentoUsada: 0.75,
  /** Rentabilidad bruta por debajo de la cual nadie pone un piso en alquiler: suelo absoluto del alquiler. */
  rentabilidadMin: 0.035,
  /**
   * Construir se encarece cuando el sector va más cargado que al inicio (ocupaba la mitad de su capacidad):
   * coste = (uso / usoBase)^exponente, hasta un máximo.
   */
  costeObra: { usoBase: 0.5, exponente: 0.5, max: 1.6 },
  /** Cuánto sube el apetito inversor por cada punto que el precio sube por encima del IPC (y baja si cae). */
  expectativas: 3,
  /**
   * Propietarios: cuando el precio real cae más del umbral desde su máximo reciente, cada punto de caída
   * suma tensión y resta confianza. El máximo se olvida a este ritmo anual.
   */
  propietarios: { umbral: 0.05, tension: 100, confianza: 60, olvido: 0.02 },
  /** Puntos de apoyo al gobierno que da (o quita) la coyuntura en su extremo: «es la economía». */
  apoyoCoyuntura: 10,
  /** Familias en espera que cada semana se van a una ciudad más barata, por cada 100 % de sobreesfuerzo respecto a la media. */
  movilidad: 2e-3,
  /** Las llegadas del exterior parten del récord de 2024 y bajan esta parte a lo largo de estos años. */
  demografia: { caidaInmigracion: 0.4, anios: 15 },
  /**
   * Suelo urbanizable al inicio, en años de obra al ritmo de partida, y reserva (en años al ritmo actual)
   * por debajo de la cual la obra privada se frena.
   */
  suelo: { aniosPrincipal: 8, aniosResto: 20, reserva: 4 },
  /** Semanas que tarda el comportamiento (caseros, promotores, inversores) en adaptarse del todo a una ley. */
  semanasDespliegue: 13,
  /**
   * Coyuntura: persistencia semanal y tamaño del choque, y cuánto mueve en su extremo
   * la subida de rentas, las llegadas y la emancipación, el tipo de interés y la confianza.
   */
  ciclo: {
    persistencia: 0.993,
    choque: 0.047,
    renta: 0.03,
    llegadas: 0.3,
    emancipacion: 0.2,
    tipo: 0.01,
    confianza: 15
  },
  /** Elecciones cada cuatro años: se pierden si el apoyo al gobierno queda por debajo del umbral. */
  elecciones: {
    cada: 208,
    umbral: 38,
    /** Puntos de apoyo que resta cada punto de tensión por encima de 60, y que suma cada punto de mejora desde las anteriores. */
    tension: 0.7,
    mejora: 0.4
  },
  /** Los tribunales tardan entre dos y tres años en anular una ley. */
  semanasAnulacion: { min: 104, margen: 52 },
  objetivos: {
    /** Familias con vivienda sobre el total de familias (alojadas + en espera). */
    alojadas: 0.95,
    /** Precio de compra (con impuestos) en años de renta neta del hogar medio: el nivel de finales de los noventa. */
    aniosCompra: 6,
    /** Alquiler medio como parte del salario mínimo. */
    esfuerzoSmi: 0.35
  },
  /** Renta de quien busca vivienda respecto a la media (jóvenes y recién llegados ganan menos). */
  rentaBuscadores: 0.8,
  /** Alquiler de la vivienda pública, como parte del SMI. */
  alquilerSocialPctSmi: 0.25,
  /** Dureza del corte de accesibilidad: cuanto mayor, más brusco. */
  exponenteAcceso: 3.5,
  /** Inquilinos que intentan comprar cada semana. */
  inquilinosCompran: 7e-4,
  /** Parte de la oferta que puede cerrarse en una semana. */
  rotacionVenta: 0.03,
  rotacionAlquiler: 0.5,
  /** Oferta "normal" absorbida por semana: referencia para el ratio demanda/oferta. */
  absorcionVenta: 0.01,
  absorcionAlquiler: 0.25,
  /** Compras de inversores por semana y por hogar de la ciudad (≈ 1.850 y 1.230 a la semana en toda España al inicio). */
  inversionBase: { familias: 0, pequenos: 93e-6, grandes: 62e-6, publico: 0 },
  /** Cuánto pesa la rentabilidad bruta en la intención de alquilar. */
  sensRentabilidad: { familias: 5, pequenos: 7, grandes: 9, publico: 0 },
  rentabilidadNeutra: 0.05,
  /** Rapidez relativa con la que cada propietario saca vivienda vacía al mercado. */
  movilizacion: { familias: 1, pequenos: 2.5, grandes: 6, publico: 20 },
  /** Destino de la vivienda de un hogar que desaparece (herencias). */
  herencia: { venta: 0.55, alquiler: 0.15, vacia: 0.3 },
  /** Quién promueve la obra nueva privada. */
  repartoObra: { familias: 0.1, pequenos: 0.3, grandes: 0.6 },
  /** Parte de la obra de grandes promotores destinada a alquiler. */
  obraParaAlquiler: 0.25,
  /** Por debajo de esta parte del precio de partida (actualizado con el IPC) no se vende ni se alquila; además rigen los suelos absolutos de coste y rentabilidad. */
  sueloPrecio: 0.55,
  sueloAlquiler: 0.5,
  /** Cuando la inflación se desvía de la base, salarios y SMI recogen esta parte del exceso. */
  traspasoInflacion: 0.7,
  /** Puntos de IPC que añade cada 1.000 M€ impresos, y durante cuántas semanas. */
  inflacionPorMilMillones: 8e-4,
  semanasInflacionImpresa: 104,
  /** Lo que se imprime de golpe (M€ de inicio). */
  tramoImpresion: 1e3,
  /**
   * Deuda de la cartera: interés anual de partida, y puntos de tensión y de confianza
   * por cada 1.000 M€ (de inicio) que se deben.
   */
  deuda: { interes: 0.03, tensionPorMil: 0.1, confianzaPorMil: 0.1 },
  /** Puntos que sube el tipo de interés (hipotecas y deuda) cuando la confianza cae de 60 a 0. */
  primaRiesgo: 0.02,
  /** Parte de una subida del salario mínimo que llega a la renta media de los hogares. */
  traspasoSmiRenta: 0.15,
  /** Techo del salario mínimo anual, como parte de la renta media del hogar (hoy es el 44 %): por encima destruye empleo y no se sube. */
  smiMaxSobreRenta: 0.6,
  /** Índice de presión de una ciudad: 100 = estos umbrales. Cada componente puede llegar al doble. */
  presion: {
    esfuerzo: 0.7,
    aniosCompra: 13,
    espera: 0.12,
    tope: 2,
    pesos: { esfuerzo: 0.3, aniosCompra: 0.2, espera: 0.5 }
  },
  /** Hogares a partir de los cuales una provincia es una «gran área urbana». */
  principalMinHogares: 7e5,
  /** Peso de cada hogar en la tensión social según dónde vive. */
  peso: { principal: 2, normal: 1, resto: 0.5 },
  /** Parte de los inquilinos del sector privado expulsada por semana que se considera «normal» (CGPJ + no renovaciones): unas 1.000 familias al inicio. */
  expulsadosRef: 26e-5,
  semanasCalentamiento: 26,
  maxHistorial: 1600
};

// src/app/sim/tipos.ts
var PROPIETARIOS = ["familias", "pequenos", "grandes", "publico"];

// src/app/sim/motor/indicadores.ts
var clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
function flujosVacios() {
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
    costeCompraPublica: 0
  };
}
function hogares(c) {
  let n2 = 0;
  for (const o of PROPIETARIOS) n2 += c.parque[o].propia + c.parque[o].alquilada;
  return n2;
}
function suma(c, campo, soloPrivado = false) {
  let n2 = 0;
  for (const o of PROPIETARIOS) if (!soloPrivado || o !== "publico") n2 += c.parque[o][campo];
  return n2;
}
function viviendas(c) {
  let n2 = 0;
  for (const o of PROPIETARIOS) {
    const p = c.parque[o];
    n2 += p.propia + p.alquilada + p.ofAlquiler + p.ofVenta + p.vacia;
  }
  return n2;
}
var sueloPrecioDe = (c, e) => Math.max(
  c.precioRef * PARAMETROS.sueloPrecio,
  PARAMETROS.costeConstruccionM2 * PARAMETROS.superficieVenta * e.nivelPrecios * e.costeObra * PARAMETROS.descuentoUsada
);
var sueloAlquilerDe = (c) => Math.max(
  c.alquilerRef * PARAMETROS.sueloAlquiler,
  PARAMETROS.rentabilidadMin * c.precio * PARAMETROS.superficieAlquiler / (12 * PARAMETROS.superficieVenta)
);
var rentabilidad = (alquiler, precio) => alquiler / PARAMETROS.superficieAlquiler * 12 / (precio / PARAMETROS.superficieVenta);
function aniosFinanciables(tipo, plazo, esfuerzo, aval) {
  const anualidad = tipo > 1e-6 ? (1 - Math.pow(1 + tipo, -plazo)) / tipo : plazo;
  return esfuerzo * anualidad * (1 + aval);
}
var esfuerzoEntrada = (c, ayuda = 0) => Math.max(0, c.alquiler - ayuda) / (c.renta * PARAMETROS.rentaBuscadores / 12);
function presion(c, ayuda = 0) {
  const u = PARAMETROS.presion;
  const esfuerzo = (esfuerzoEntrada(c, ayuda) + c.alquilerVivo / (c.renta * PARAMETROS.rentaBuscadores / 12)) / 2;
  const anios2 = c.precio / c.renta;
  const espera = c.espera / (hogares(c) + c.espera);
  const comp = (x) => clamp(x, 0, u.tope);
  return u.pesos.esfuerzo * comp(esfuerzo / u.esfuerzo) + u.pesos.aniosCompra * comp(anios2 / u.aniosCompra) + u.pesos.espera * comp(espera / u.espera);
}
function presionNacional(e, ayuda = 0) {
  let sw = 0, sp = 0, swP = 0, spP = 0;
  for (const c of e.ciudades) {
    const h = hogares(c);
    const p = presion(c, ayuda);
    const w = h * (c.principal ? PARAMETROS.peso.principal : c.id === "resto" ? PARAMETROS.peso.resto : PARAMETROS.peso.normal);
    sw += w;
    sp += w * p;
    if (c.principal) {
      swP += h;
      spP += h * p;
    }
  }
  return { ponderada: sw ? sp / sw : 0, principales: swP ? spP / swP : 0 };
}
function indicadores(e, impuestoCompra, ayuda = 0) {
  const flujos = flujosVacios();
  const mercado = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const parque3 = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const enAlquiler = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  const enVenta = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
  let h = 0, espera = 0, precio = 0, renta = 0, alqMercado = 0, alqPagado = 0, crecAlq = 0, crecVenta = 0;
  let alqPriv = 0, alqPub = 0, ofAlquiler = 0, ofVenta = 0, vacias = 0;
  for (const c of e.ciudades) {
    const hc = hogares(c);
    h += hc;
    espera += c.espera;
    precio += c.precio * hc;
    renta += c.renta * hc;
    crecVenta += c.crecVenta * hc;
    const priv = suma(c, "alquilada", true);
    alqPriv += priv;
    alqPub += c.parque.publico.alquilada;
    alqMercado += c.alquiler * priv;
    alqPagado += c.alquilerVivo * priv;
    crecAlq += c.crecAlq * priv;
    ofAlquiler += suma(c, "ofAlquiler");
    ofVenta += suma(c, "ofVenta");
    vacias += suma(c, "vacia", true);
    for (const o of PROPIETARIOS) {
      const p = c.parque[o];
      mercado[o] += p.alquilada + p.ofAlquiler + p.ofVenta;
      parque3[o] += p.propia + p.alquilada + p.ofAlquiler + p.ofVenta + p.vacia;
      enAlquiler[o] += p.ofAlquiler;
      enVenta[o] += p.ofVenta;
    }
    let k;
    for (k in flujos) flujos[k] += c.flujos[k];
  }
  const alquilerMercado = alqMercado / alqPriv;
  const alquilerPagado = alqPagado / alqPriv;
  const alquilerMedio = (alqPagado + alqPub * e.smi * PARAMETROS.alquilerSocialPctSmi) / (alqPriv + alqPub);
  const precioMedio = precio / h;
  const rentaMedia = renta / h;
  const alojadas = h / (h + espera);
  const aniosCompra = precioMedio * (1 + impuestoCompra) / rentaMedia;
  const esfuerzoSmi = alquilerMedio / e.smi;
  return {
    hogares: h,
    espera,
    alojadas,
    aniosCompra,
    esfuerzoSmi,
    alquilerMercado,
    alquilerPagado,
    alquilerMedio,
    precioMedio,
    rentaMedia,
    crecAlq: crecAlq / alqPriv,
    crecVenta: crecVenta / h,
    ofAlquiler,
    ofVenta,
    flujos,
    mercado,
    parque: parque3,
    enAlquiler,
    enVenta,
    vacias,
    inquilinos: alqPriv,
    presion: presionNacional(e, ayuda),
    nivelPrecios: e.nivelPrecios,
    costeObra: e.costeObra,
    cumple: {
      alojadas: alojadas >= PARAMETROS.objetivos.alojadas,
      compra: aniosCompra <= PARAMETROS.objetivos.aniosCompra,
      alquiler: esfuerzoSmi <= PARAMETROS.objetivos.esfuerzoSmi
    }
  };
}
function contexto(i) {
  return {
    contratos: i.flujos.contratos,
    compras: i.flujos.compras,
    precioMedio: i.precioMedio,
    alquilerMedio: i.alquilerPagado,
    nivelPrecios: i.nivelPrecios,
    costeObra: i.costeObra,
    rentaHogares: i.rentaMedia * i.hogares,
    inquilinos: i.inquilinos,
    vacias: i.vacias,
    parqueGrandes: i.parque.grandes
  };
}

// src/app/sim/datos/decretos.ts
var suma2 = (factor, valor, extra = {}) => ({
  factor,
  op: "suma",
  valor,
  ...extra
});
var mult = (factor, valor, extra = {}) => ({
  factor,
  op: "mult",
  valor,
  ...extra
});
var tope = (factor, valor, extra = {}) => ({
  factor,
  op: "tope",
  valor,
  ...extra
});
var DOS_ANIOS = { semanas: 104 };
var PRIVADOS = ["familias", "pequenos", "grandes"];
var principales = (e) => e.ciudades.filter((c) => c.principal);
var tensionadas = (e) => e.ciudades.filter((c) => presion(c) >= 0.6);
var pct = (v) => v / 100;
var HIPOTECAS_VIVAS = 4e6;
function sacarVacias(e, cuantas, solo) {
  for (const c of e.ciudades) {
    if (solo && !solo(c)) continue;
    const total = cuantas(c);
    const vacias = PRIVADOS.reduce((s, o) => s + c.parque[o].vacia, 0);
    if (!vacias || !total) continue;
    for (const o of PRIVADOS) {
      const p = c.parque[o];
      const n2 = Math.min(p.vacia, total * p.vacia / vacias);
      p.vacia -= n2;
      p.ofAlquiler += n2 * c.intencion[o];
      p.ofVenta += n2 * (1 - c.intencion[o]);
    }
  }
}
function smiSobreRenta(e) {
  let h = 0;
  let renta = 0;
  for (const c of e.ciudades) {
    const n2 = hogares(c);
    h += n2;
    renta += c.renta * n2;
  }
  return e.smi * 12 / (renta / h);
}
var subidaSmi = (e, v) => Math.max(0, Math.min(pct(v), PARAMETROS.smiMaxSobreRenta / smiSobreRenta(e) - 1));
var pesoSmi = (e) => Math.pow(smiSobreRenta(e) / (PARAMETROS.smiMensual * 12 / PARAMETROS.rentaHogarEcv2025), 2);
var sueloInicial = (c) => c.obraBase * 52 * (c.principal ? PARAMETROS.suelo.aniosPrincipal : PARAMETROS.suelo.aniosResto);
var ganaPorAutonomos = (e, v) => {
  const hogaresPais = e.ciudades.reduce((s, c) => s + hogares(c), 0);
  return PARAMETROS.autonomos * 12 * v * e.nivelPrecios / hogaresPais;
};
function pasarAPublico(e, parte) {
  for (const c of e.ciudades) {
    const n2 = c.parque.grandes.vacia * parte;
    c.parque.grandes.vacia -= n2;
    c.parque.publico.ofAlquiler += n2;
  }
}
var DECRETOS = [
  // ══ Impuestos y dinero público ═══════════════════════════════════════════
  {
    id: "presupuesto-extra",
    titulo: "M\xE1s dinero p\xFAblico para vivienda",
    descripcion: "Quitar dinero de otras partidas (o subir impuestos) para la cartera de vivienda. Espa\xF1a gasta en vivienda el 0,1 % del PIB; la media europea es el 0,4 %. Lo que se recorta en otro sitio molesta.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Dinero extra al mes",
      min: 100,
      max: 1e3,
      paso: 100,
      defecto: 200,
      unidad: "M\u20AC/mes"
    },
    efectos: (v) => [
      suma2("presupuesto.mensual", v),
      suma2("tension.extra", v / 100),
      suma2("confianza.objetivo", -v / 200)
    ],
    fuentes: ["eurostatVivienda", "pge"]
  },
  {
    id: "bajar-itp",
    titulo: "Bajar los impuestos al comprar casa",
    descripcion: "Rebaja del ITP (vivienda usada) y del IVA (nueva) para quien compra para vivir. Es caro: lo disfrutan las 700.000 compras del a\xF1o.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    parametro: { nombre: "Rebaja", min: 1, max: 6, paso: 1, defecto: 2, unidad: "puntos" },
    efectos: (v) => [suma2("impuesto.compra", -pct(v))],
    coste: (v, ctx) => PARAMETROS.compraventasAnuales * ctx.precioMedio * 0.8 * pct(v) / 1e6,
    fuentes: ["impuestoCompra", "compraventas"]
  },
  {
    id: "bonificar-arrendador",
    titulo: "Rebajar el IRPF a quien alquila su piso",
    descripcion: "Hoy el casero ya descuenta el 50 % de lo que cobra. Subir la rebaja anima a alquilar en vez de vender o dejar vac\xEDo. El RD-ley 26/2026 llega al 100 % si el alquiler es barato.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: "Parte del alquiler libre de IRPF",
      min: 60,
      max: 100,
      paso: 10,
      defecto: 70,
      unidad: "%"
    },
    efectos: (v) => [
      suma2("oferta.intencionAlquilar", 0.03 + 0.1 * ((v - 50) / 50)),
      suma2("confianza.objetivo", 1 + 3 * ((v - 50) / 50))
    ],
    coste: (v, ctx) => ctx.inquilinos * ctx.alquilerMedio * 12 * 0.19 * ((v - 50) / 100) / 1e6,
    fuentes: ["rdl26"]
  },
  {
    id: "recargo-vacias",
    titulo: "Recargo del IBI a los pisos vac\xEDos",
    descripcion: "Los ayuntamientos cobran m\xE1s IBI a la vivienda que lleva a\xF1os vac\xEDa sin motivo. Empuja a alquilarla o venderla y recauda algo.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Recargo sobre el IBI",
      min: 50,
      max: 150,
      paso: 25,
      defecto: 50,
      unidad: "%"
    },
    efectos: (v) => [
      mult("oferta.movilizacion", 0.5 * pct(v)),
      suma2("confianza.objetivo", -2 * (v / 50))
    ],
    coste: (v, ctx) => -ctx.vacias * 300 * ctx.nivelPrecios * pct(v) * 0.3 / 1e6,
    fuentes: ["rdl26", "censoVacias"]
  },
  {
    id: "impuesto-grandes",
    titulo: "Impuesto anual a los grandes propietarios",
    descripcion: "Un porcentaje del valor de las carteras de empresas y fondos con muchas viviendas. Frena sus compras, les empuja a vender y recauda.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: -2, soc: 0 },
    parametro: {
      nombre: "Impuesto sobre el valor",
      min: 0.5,
      max: 3,
      paso: 0.5,
      defecto: 1,
      unidad: "% al a\xF1o"
    },
    efectos: (v) => [
      mult("inversion.demanda", -0.3 * v, { propietario: "grandes" }),
      mult("oferta.movilizacion", 0.4 * v, { propietario: "grandes" }),
      suma2("oferta.intencionAlquilar", -0.03 * v, { propietario: "grandes" }),
      suma2("confianza.objetivo", -4 * v),
      suma2("tension.extra", -1, DOS_ANIOS)
    ],
    coste: (v, ctx) => -ctx.parqueGrandes * ctx.precioMedio * pct(v) / 1e6,
    riesgoLegal: 0.2,
    fuentes: ["propiedadAlquiler", "supuestoDecretos"]
  },
  {
    id: "socimi",
    titulo: "Gravar a las SOCIMI que no alquilan barato",
    descripcion: "Las sociedades cotizadas de alquiler apenas pagan impuestos. El RD-ley 26/2026 grava el 25 % de sus beneficios no repartidos, salvo que la mayor\xEDa de sus pisos sean asequibles.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [
      suma2("oferta.intencionAlquilar", 0.04, { propietario: "grandes" }),
      mult("inversion.demanda", -0.15, { propietario: "grandes" }),
      suma2("confianza.objetivo", -3)
    ],
    coste: (_, ctx) => -150 * ctx.nivelPrecios,
    fuentes: ["socimi"]
  },
  {
    id: "impuesto-extranjeros",
    titulo: "Impuesto a compradores de fuera de la UE",
    descripcion: "Gravamen extra sobre el precio cuando compra alguien que no reside en la Uni\xF3n Europea. Afecta sobre todo a la costa, las islas, Madrid y Barcelona. Propuesto en 2025, nunca votado.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: -1, soc: 1 },
    parametro: {
      nombre: "Impuesto sobre el precio",
      min: 25,
      max: 100,
      paso: 25,
      defecto: 100,
      unidad: "%"
    },
    efectos: (v) => [
      ...COSTA.map((ciudad) => mult("inversion.demanda", -0.25 * pct(v), { ciudad })),
      suma2("confianza.objetivo", -3)
    ],
    coste: (v, ctx) => -200 * pct(v) * ctx.nivelPrecios,
    riesgoLegal: 0.5,
    fuentes: ["impuestoExtranjeros"]
  },
  {
    id: "iva-obra-nueva",
    titulo: "IVA superreducido (4 %) a la vivienda nueva",
    descripcion: "Del 10 % al 4 % en obra nueva: la casa nueva sale m\xE1s barata y el promotor gana margen.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    efectos: () => [mult("construccion.privada", 0.12), suma2("impuesto.compra", -0.01)],
    coste: (_, ctx) => PARAMETROS.compraventasAnuales * 0.15 * ctx.precioMedio * 0.06 / 1e6,
    fuentes: ["impuestoCompra", "rdl26"]
  },
  {
    id: "deduccion-compra",
    titulo: "Desgravar la compra de la primera vivienda",
    descripcion: "Devolver en el IRPF parte de lo pagado por la hipoteca, como hasta 2013. Da m\xE1s poder de compra\u2026 que acaba en el precio. Lo cobran unos 4 millones de hipotecados.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: "Deducci\xF3n",
      min: 5,
      max: 15,
      paso: 5,
      defecto: 15,
      unidad: "% de la cuota"
    },
    efectos: (v) => [
      suma2("impuesto.compra", -0.4 * pct(v)),
      suma2("demanda.preferenciaCompra", 0.05 * (v / 15)),
      suma2("confianza.objetivo", 2)
    ],
    coste: (v, ctx) => HIPOTECAS_VIVAS * 9040 * ctx.nivelPrecios * pct(v) / 1e6,
    fuentes: ["supuestoDecretos"]
  },
  {
    id: "rebaja-irpf",
    titulo: "Bajar el IRPF a las familias",
    descripcion: "Rebaja general del impuesto sobre la renta: cada hogar dispone de m\xE1s dinero para pagar un alquiler o una hipoteca. Es car\xEDsima (cada punto de renta son unos 8.000 M\u20AC al a\xF1o), calienta algo los precios y, como todos pueden pagar m\xE1s, parte acaba en el precio de la vivienda.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: "Renta disponible que ganan los hogares",
      min: 1,
      max: 5,
      paso: 1,
      defecto: 2,
      unidad: "%"
    },
    notaInmediata: (v) => `La renta de los hogares sube un ${v} % de inmediato`,
    alAplicar: (e, v, anterior) => {
      for (const c of e.ciudades) c.renta *= (1 + pct(v)) / (1 + pct(anterior ?? 0));
    },
    alDerogar: (e, anterior) => {
      for (const c of e.ciudades) c.renta /= 1 + pct(anterior);
    },
    efectos: (v) => [
      suma2("inflacion.general", 4e-4 * v, DOS_ANIOS),
      suma2("confianza.objetivo", v / 2)
    ],
    // La renta que ve la ley ya incluye la rebaja: se cobra sobre la de antes.
    coste: (v, ctx) => ctx.rentaHogares / (1 + pct(v)) * pct(v) / 1e6,
    fuentes: ["rentaHogar", "supuestoDecretos"]
  },
  {
    id: "cuota-autonomos",
    titulo: "Rebajar la cuota de aut\xF3nomos",
    descripcion: "Menos cuota mensual para los 3,3 millones de aut\xF3nomos. El modelo no distingue hogares por tipo de trabajo: reparte la mejora entre todos, as\xED que por hogar medio se nota poco.",
    categoria: "Impuestos y dinero p\xFAblico",
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: "Rebaja de la cuota",
      min: 50,
      max: 200,
      paso: 50,
      defecto: 100,
      unidad: "\u20AC/mes"
    },
    alAplicar: (e, v, anterior) => {
      const gana = ganaPorAutonomos(e, v) - ganaPorAutonomos(e, anterior ?? 0);
      for (const c of e.ciudades) c.renta += gana;
    },
    alDerogar: (e, anterior) => {
      const gana = ganaPorAutonomos(e, anterior);
      for (const c of e.ciudades) c.renta -= gana;
    },
    efectos: () => [suma2("confianza.objetivo", 1)],
    coste: (v, ctx) => PARAMETROS.autonomos * 12 * v * ctx.nivelPrecios / 1e6,
    fuentes: ["supuestoDecretos"]
  },
  // ══ Construir más ════════════════════════════════════════════════════════
  {
    id: "desburocratizar",
    titulo: "Dar las licencias de obra en menos meses",
    descripcion: "Hoy una licencia tarda 12 meses de media (la ley dice 3). Ventanilla \xFAnica y silencio positivo acortan la espera y abaratan cada casa.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 2, soc: 0 },
    parametro: {
      nombre: "Meses para dar la licencia",
      min: 3,
      max: 11,
      paso: 1,
      defecto: 6,
      unidad: "meses"
    },
    efectos: (v) => [
      suma2("construccion.retraso", -(12 - v) * 4.33),
      mult("construccion.privada", 0.2 * ((12 - v) / 9)),
      suma2("confianza.objetivo", 2)
    ],
    fuentes: ["licencias"]
  },
  {
    id: "liberalizar-suelo",
    titulo: "Liberar m\xE1s suelo para construir",
    descripcion: "M\xE1s suelo urbanizable alrededor de las ciudades: sin suelo para unos a\xF1os de obra, el promotor no tiene d\xF3nde construir. Abarata el solar, que es la mitad del precio de un piso nuevo. Se puede repetir: cada vez a\xF1ade suelo, y cada vez protesta alguien.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 2, soc: 0 },
    repetible: true,
    notaInmediata: (v) => `El suelo urbanizable de cada ciudad crece un ${v} % del que ten\xEDa al inicio`,
    alAplicar: (e, v) => {
      for (const c of e.ciudades) c.suelo += pct(v) * sueloInicial(c);
    },
    acumulativos: () => [suma2("tension.extra", 1, DOS_ANIOS)],
    parametro: {
      nombre: "Suelo urbanizable nuevo",
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: "% m\xE1s"
    },
    efectos: (v) => [
      mult("construccion.privada", 0.6 * pct(v)),
      mult("construccion.capacidad", 0.25 * pct(v)),
      suma2("confianza.objetivo", 2)
    ],
    fuentes: ["supuestoDecretos"]
  },
  {
    id: "densificar",
    titulo: "Permitir m\xE1s alturas en las grandes ciudades",
    descripcion: "M\xE1s pisos por solar en Madrid, Barcelona, Valencia, Alicante, Sevilla y M\xE1laga: en el mismo suelo caben m\xE1s viviendas. Los vecinos protestan un tiempo.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 1, soc: 0 },
    notaInmediata: (v) => `En el suelo de las grandes ciudades caben un ${v} % m\xE1s de viviendas`,
    alAplicar: (e, v, anterior) => {
      for (const c of principales(e)) c.suelo += pct(v - (anterior ?? 0)) * sueloInicial(c);
    },
    parametro: {
      nombre: "Edificabilidad extra",
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: "%"
    },
    efectos: (v, e) => [
      ...principales(e).map((c) => mult("construccion.privada", 0.5 * pct(v), { ciudad: c.id })),
      suma2("confianza.objetivo", 1),
      suma2("tension.extra", 1, DOS_ANIOS)
    ],
    fuentes: ["supuestoDecretos"]
  },
  {
    id: "industrializar",
    titulo: "F\xE1bricas de vivienda industrializada",
    descripcion: "Subvencionar f\xE1bricas de m\xF3dulos y formaci\xF3n: el sector puede construir m\xE1s y m\xE1s r\xE1pido.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Inversi\xF3n anual",
      min: 200,
      max: 2e3,
      paso: 200,
      defecto: 400,
      unidad: "M\u20AC/a\xF1o"
    },
    efectos: (v) => [
      mult("construccion.capacidad", 0.15 * (v / 400)),
      suma2("construccion.retraso", -6 * (v / 400))
    ],
    coste: (v, ctx) => v * ctx.nivelPrecios,
    fuentes: ["manoObra", "supuestoDecretos"]
  },
  {
    id: "formar-obreros",
    titulo: "Formar trabajadores de la construcci\xF3n",
    descripcion: "Faltan 700.000 trabajadores. Plazas de formaci\xF3n profesional y contratos en pr\xE1cticas ampl\xEDan lo que el sector puede construir.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Plazas al a\xF1o",
      min: 2e4,
      max: 1e5,
      paso: 2e4,
      defecto: 4e4,
      unidad: "plazas"
    },
    efectos: (v) => [mult("construccion.capacidad", 0.3 * (v / 1e5))],
    coste: (v, ctx) => v * 0.01 * ctx.nivelPrecios,
    fuentes: ["manoObra"]
  },
  {
    id: "oficinas-vivienda",
    titulo: "Convertir oficinas y locales en pisos",
    descripcion: "Cambio de uso expr\xE9s para oficinas y locales vac\xEDos de las grandes ciudades. Saca al mercado de golpe un paquete de viviendas.",
    categoria: "Construir m\xE1s",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Oficinas vac\xEDas que se convierten",
      min: 10,
      max: 50,
      paso: 10,
      defecto: 30,
      unidad: "%"
    },
    notaInmediata: (v) => `En las grandes ciudades aparece de golpe el ${(0.3 * (v / 30)).toLocaleString("es-ES", { maximumFractionDigits: 1 })} % del parque en forma de pisos nuevos`,
    alAplicar: (e, v) => {
      for (const c of principales(e)) {
        const n2 = viviendas(c) * 3e-3 * (v / 30);
        c.parque.pequenos.ofVenta += n2 * 0.3;
        c.parque.grandes.ofAlquiler += n2 * 0.4;
        c.parque.grandes.ofVenta += n2 * 0.3;
        e.contadores.construidas += n2;
      }
    },
    efectos: () => [suma2("confianza.objetivo", 1)],
    fuentes: ["supuestoDecretos"]
  },
  // ══ Control de precios ═══════════════════════════════════════════════════
  {
    id: "tope-alquiler",
    titulo: "Limitar la subida anual del alquiler",
    descripcion: "Ning\xFAn alquiler puede subir m\xE1s de este porcentaje al a\xF1o (0 = congelar). En Catalu\xF1a baj\xF3 los precios un 3,7 % pero los contratos registrados cayeron un 61 %: parte de los caseros retira el piso.",
    categoria: "Control de precios",
    ideologia: { eco: -1, soc: 0 },
    grupo: "control-alquiler",
    parametro: { nombre: "Subida m\xE1xima al a\xF1o", min: 0, max: 5, paso: 1, defecto: 2, unidad: "%" },
    efectos: (v) => {
      const k = Math.max(0, (3 - v) / 3);
      return [
        tope("alquiler.crecimientoMax", pct(v)),
        suma2("oferta.intencionAlquilar", -(0.06 + 0.1 * k)),
        mult("oferta.retirada", 0.5 * k),
        suma2("confianza.objetivo", -(4 + 6 * k)),
        suma2("tension.extra", -(2 + 2 * k), DOS_ANIOS)
      ];
    },
    riesgoLegal: 0.2,
    fuentes: ["rdl26", "catalunaTensionada"]
  },
  {
    id: "zonas-tensionadas",
    titulo: "Topar el alquiler solo en las zonas tensionadas",
    descripcion: "Como la Ley 12/2023: el tope se aplica solo en las ciudades con presi\xF3n alta (60 o m\xE1s) en el momento de aprobarlo. El resto del pa\xEDs sigue libre y el da\xF1o a la oferta se concentra.",
    categoria: "Control de precios",
    ideologia: { eco: -1, soc: 0 },
    grupo: "control-alquiler",
    parametro: {
      nombre: "Subida m\xE1xima al a\xF1o en zonas tensionadas",
      min: 0,
      max: 3,
      paso: 1,
      defecto: 2,
      unidad: "%"
    },
    efectos: (v, e) => {
      const k = Math.max(0, (3 - v) / 3);
      const zonas = tensionadas(e);
      return [
        ...zonas.flatMap((c) => [
          tope("alquiler.crecimientoMax", pct(v), { ciudad: c.id }),
          suma2("oferta.intencionAlquilar", -(0.05 + 0.08 * k), { ciudad: c.id }),
          mult("oferta.retirada", 0.4 * k, { ciudad: c.id })
        ]),
        suma2("confianza.objetivo", -(2 + 3 * k)),
        suma2("tension.extra", -(1 + k), DOS_ANIOS)
      ];
    },
    fuentes: ["ley12", "catalunaTensionada"]
  },
  {
    id: "rebajar-alquileres",
    titulo: "Bajar los alquileres por decreto",
    descripcion: "Todos los alquileres bajan de golpe este porcentaje y quedan congelados. Se puede repetir, pero cada vez m\xE1s caseros dejan de renovar, y por debajo de lo que cuesta mantener un piso (la mitad del alquiler de partida) nadie alquila.",
    categoria: "Control de precios",
    ideologia: { eco: -2, soc: 0 },
    grupo: "control-alquiler",
    repetible: true,
    parametro: { nombre: "Rebaja inmediata", min: 5, max: 30, paso: 5, defecto: 10, unidad: "%" },
    notaInmediata: (v) => `Alquileres \u2212${v} % de inmediato`,
    alAplicar: (e, v) => {
      for (const c of e.ciudades) {
        const suelo = sueloAlquilerDe(c);
        const nuevo = Math.min(c.alquiler, Math.max(c.alquiler * (1 - pct(v)), suelo));
        c.alquilerVivo = Math.min(c.alquilerVivo * (1 - pct(v)), nuevo);
        c.alquiler = nuevo;
      }
    },
    acumulativos: (v) => [mult("contratos.noRenovacion", 2 * pct(v), DOS_ANIOS)],
    efectos: (v) => [
      tope("alquiler.crecimientoMax", 0),
      suma2("oferta.intencionAlquilar", -(0.16 + 0.3 * pct(v))),
      mult("oferta.retirada", 0.5 + pct(v)),
      suma2("confianza.objetivo", -(10 + v / 2)),
      suma2("tension.extra", -(4 + v / 5), DOS_ANIOS)
    ],
    riesgoLegal: 0.6,
    fuentes: ["catalunaTensionada", "supuestoDecretos"]
  },
  {
    id: "tope-venta",
    titulo: "Prohibir que suba el precio de venta",
    descripcion: "El precio de la vivienda no puede subir. Hunde el margen del promotor y se construye menos.",
    categoria: "Control de precios",
    ideologia: { eco: -2, soc: 0 },
    grupo: "control-venta",
    efectos: () => [
      tope("venta.crecimientoMax", 0),
      mult("construccion.privada", -0.25),
      suma2("confianza.objetivo", -10),
      suma2("tension.extra", -2, DOS_ANIOS)
    ],
    riesgoLegal: 0.7,
    fuentes: ["supuestoDecretos"]
  },
  {
    id: "temporada",
    titulo: "Cerrar la escapatoria del alquiler de temporada",
    descripcion: "Un alquiler de temporada necesita causa real y no puede pasar de 12 meses; si no, es alquiler normal con todos sus l\xEDmites. Evita que los caseros huyan de los topes\u2026 o que alquilen.",
    categoria: "Control de precios",
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [
      mult("oferta.retirada", -0.3),
      suma2("oferta.intencionAlquilar", -0.02),
      suma2("confianza.objetivo", -2)
    ],
    fuentes: ["temporada", "catalunaTensionada"]
  },
  {
    id: "inspeccion-alquiler",
    titulo: "Inspecci\xF3n y registro de alquileres",
    descripcion: "Los topes se incumplen: pagos en negro, contratos de temporada falsos, extras inventados. Un registro obligatorio de contratos y un cuerpo de inspectores hacen que se cumplan m\xE1s. Sin topes en vigor no sirve de nada.",
    categoria: "Control de precios",
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [suma2("cumplimiento.alquiler", 0.2), suma2("confianza.objetivo", -1)],
    coste: (_, ctx) => 150 * ctx.nivelPrecios,
    fuentes: ["supuestoDecretos"]
  },
  // ══ Reglas del alquiler ══════════════════════════════════════════════════
  {
    id: "prohibir-desahucios",
    titulo: "Suspender los desahucios",
    descripcion: "Nadie (o solo los hogares vulnerables) puede ser desalojado de su vivienda habitual. El casero percibe m\xE1s riesgo y alquila menos. El RD-ley 26/2026 suspende los de hogares vulnerables hasta 2030.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -2, soc: 0 },
    grupo: "desahucios",
    parametro: {
      nombre: "Desahucios que se suspenden",
      min: 25,
      max: 100,
      paso: 25,
      defecto: 50,
      unidad: "%"
    },
    efectos: (v) => [
      mult("desahucios.tasa", -0.9 * pct(v)),
      suma2("oferta.intencionAlquilar", -0.14 * pct(v)),
      suma2("oferta.intencionAlquilar", -0.05 * pct(v), { propietario: "familias" }),
      suma2("confianza.objetivo", -7 * pct(v)),
      suma2("tension.extra", -5 * pct(v), DOS_ANIOS)
    ],
    riesgoLegal: 0.3,
    fuentes: ["rdl26", "lanzamientos"]
  },
  {
    id: "desahucio-expres",
    titulo: "Desahucio expr\xE9s",
    descripcion: "Desalojo en semanas ante impago u ocupaci\xF3n. M\xE1s seguridad para el casero, m\xE1s familias en la calle.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: 2, soc: 1 },
    grupo: "desahucios",
    efectos: () => [
      mult("desahucios.tasa", 0.6),
      suma2("oferta.intencionAlquilar", 0.08),
      suma2("confianza.objetivo", 5),
      suma2("tension.extra", 5, DOS_ANIOS)
    ],
    fuentes: ["lanzamientos", "supuestoDecretos"]
  },
  {
    id: "indemnizacion",
    titulo: "Indemnizar al inquilino si el casero no renueva",
    descripcion: "El casero que no renueva paga al inquilino estos meses de renta. El RD-ley 27/2026 fija 12. Menos expulsiones, menos ganas de alquilar.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -1, soc: 0 },
    parametro: { nombre: "Meses de renta", min: 3, max: 12, paso: 3, defecto: 12, unidad: "meses" },
    efectos: (v) => [
      mult("contratos.noRenovacion", -0.05 * v),
      suma2("oferta.intencionAlquilar", -0.01 * v),
      suma2("confianza.objetivo", -0.5 * v),
      suma2("tension.extra", -v / 6, DOS_ANIOS)
    ],
    fuentes: ["rdl27"]
  },
  {
    id: "contratos-largos",
    titulo: "Contratos de alquiler m\xE1s largos",
    descripcion: "Hoy el contrato dura 5 a\xF1os (7 si el casero es empresa). Alargarlo da estabilidad al inquilino y resta flexibilidad al casero.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -1, soc: 0 },
    parametro: { nombre: "Duraci\xF3n m\xEDnima", min: 7, max: 15, paso: 1, defecto: 10, unidad: "a\xF1os" },
    efectos: (v) => [
      mult("contratos.noRenovacion", -0.06 * (v - 5)),
      suma2("oferta.intencionAlquilar", -0.015 * (v - 5)),
      suma2("confianza.objetivo", -(v - 5))
    ],
    fuentes: ["rdl27"]
  },
  {
    id: "limitar-turisticos",
    titulo: "Devolver pisos tur\xEDsticos a vivienda",
    descripcion: "Retirar licencias de uso tur\xEDstico (hay 341.000 pisos, el 1,28 % del parque) y obligar a devolverlos al alquiler o la venta.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Pisos tur\xEDsticos que vuelven",
      min: 10,
      max: 100,
      paso: 10,
      defecto: 30,
      unidad: "%"
    },
    notaInmediata: (v) => `El ${v} % de los pisos tur\xEDsticos vuelve de golpe al mercado`,
    alAplicar: (e, v) => sacarVacias(e, (c) => viviendas(c) * PARAMETROS.pctTuristicas * pct(v)),
    efectos: (v) => [
      mult("oferta.movilizacion", 0.2 * pct(v)),
      suma2("confianza.objetivo", -3 * pct(v))
    ],
    // Lo que deja de ingresarse por el turismo que se alojaba en esos pisos.
    coste: (v, ctx) => 300 * pct(v) * ctx.nivelPrecios,
    fuentes: ["turisticas", "rdl26"]
  },
  {
    id: "vetar-fondos",
    titulo: "Prohibir a los fondos comprar vivienda",
    descripcion: "Las empresas y fondos con muchas viviendas no pueden comprar m\xE1s vivienda residencial.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -2, soc: 0 },
    efectos: () => [
      mult("inversion.demanda", -1, { propietario: "grandes" }),
      suma2("confianza.objetivo", -6),
      suma2("tension.extra", -2, DOS_ANIOS)
    ],
    riesgoLegal: 0.5,
    fuentes: ["propiedadAlquiler", "supuestoDecretos"]
  },
  {
    id: "seguro-impago",
    titulo: "Seguro p\xFAblico contra el impago del alquiler",
    descripcion: "El Estado cubre al casero si el inquilino deja de pagar y media antes del desahucio. M\xE1s caseros se animan a alquilar.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: 0, soc: 0 },
    efectos: () => [
      suma2("oferta.intencionAlquilar", 0.06),
      mult("desahucios.tasa", -0.2),
      suma2("confianza.objetivo", 3)
    ],
    coste: (_, ctx) => ctx.inquilinos * ctx.alquilerMedio * 12 * 0.01 / 1e6,
    fuentes: ["supuestoDecretos", "lanzamientos"]
  },
  {
    id: "alquiler-social-grandes",
    titulo: "Obligar a los grandes propietarios a ofrecer alquiler social",
    descripcion: "Como en Catalu\xF1a: empresas y fondos deben ceder sus pisos vac\xEDos como alquiler social. Una cuarta parte pasa al parque p\xFAblico de golpe.",
    categoria: "Reglas del alquiler",
    ideologia: { eco: -2, soc: 0 },
    notaInmediata: () => "El 25 % de los pisos vac\xEDos de empresas y fondos pasa a alquiler social",
    alAplicar: (e) => pasarAPublico(e, 0.25),
    efectos: () => [
      suma2("oferta.intencionAlquilar", -0.06, { propietario: "grandes" }),
      mult("inversion.demanda", -0.3, { propietario: "grandes" }),
      suma2("confianza.objetivo", -8),
      suma2("tension.extra", -3, DOS_ANIOS)
    ],
    riesgoLegal: 0.3,
    fuentes: ["ley24cat"]
  },
  // ══ Vivienda pública ═════════════════════════════════════════════════════
  {
    id: "plan-vivienda-publica",
    titulo: "Construir vivienda p\xFAblica en alquiler",
    descripcion: "Viviendas p\xFAblicas que se empiezan cada semana, adem\xE1s de las 250 actuales. Cada 100 semanales cuestan unos 830 M\u20AC al a\xF1o (160.000 \u20AC por vivienda, como Casa 47) y compiten por los mismos alba\xF1iles.",
    categoria: "Vivienda p\xFAblica",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Viviendas p\xFAblicas nuevas",
      min: 100,
      max: 3e3,
      paso: 100,
      defecto: 500,
      unidad: "por semana"
    },
    efectos: (v) => [suma2("construccion.publica", v)],
    fuentes: ["casa47", "planEstatal"]
  },
  {
    id: "compra-publica",
    titulo: "Comprar pisos para alquiler social",
    descripcion: "El Estado compra viviendas en venta (derecho de compra preferente) y las alquila a precio social. Paga el precio de mercado de cada ciudad.",
    categoria: "Vivienda p\xFAblica",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Compras",
      min: 50,
      max: 1e3,
      paso: 50,
      defecto: 250,
      unidad: "por semana"
    },
    efectos: (v) => [suma2("compra.publica", v)],
    fuentes: ["casa47"]
  },
  {
    id: "suelo-publico-concesion",
    titulo: "Ceder suelo p\xFAblico a promotores (75 a\xF1os)",
    descripcion: "Promotores privados construyen alquiler asequible sobre suelo p\xFAblico. El Estado solo paga el suelo (un 30 % del coste) y al cabo de 75 a\xF1os se queda las casas.",
    categoria: "Vivienda p\xFAblica",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Viviendas asequibles",
      min: 50,
      max: 1e3,
      paso: 50,
      defecto: 200,
      unidad: "por semana"
    },
    efectos: (v) => [
      suma2("construccion.concesion", v),
      mult("construccion.privada", 0.06 * (v / 200)),
      suma2("confianza.objetivo", 1)
    ],
    fuentes: ["planEstatal", "casa47"]
  },
  {
    id: "reserva-protegida",
    titulo: "Reservar parte de la obra nueva para vivienda protegida",
    descripcion: "Cada promoci\xF3n privada debe destinar este porcentaje a vivienda protegida. En Barcelona, con el 30 %, salieron 34 pisos en ocho a\xF1os: los promotores dejaron de construir.",
    categoria: "Vivienda p\xFAblica",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Reserva obligatoria",
      min: 10,
      max: 40,
      paso: 10,
      defecto: 30,
      unidad: "%"
    },
    efectos: (v) => [
      mult("construccion.privada", -0.3 * (v / 30)),
      suma2("construccion.concesion", 1550 * pct(v) * 0.5),
      suma2("confianza.objetivo", -v / 5)
    ],
    fuentes: ["barcelona30"]
  },
  {
    id: "expropiar-vacias",
    titulo: "Expropiar el uso de pisos vac\xEDos a empresas y fondos",
    descripcion: "Parte de las viviendas vac\xEDas de grandes propietarios pasa a alquiler social. Se puede repetir mientras quede algo.",
    categoria: "Vivienda p\xFAblica",
    ideologia: { eco: -2, soc: 0 },
    repetible: true,
    parametro: {
      nombre: "Pisos vac\xEDos de grandes propietarios que se expropian",
      min: 10,
      max: 100,
      paso: 10,
      defecto: 50,
      unidad: "%"
    },
    notaInmediata: (v) => `El ${v} % de la vivienda vac\xEDa de empresas y fondos pasa al parque p\xFAblico`,
    alAplicar: (e, v) => pasarAPublico(e, pct(v)),
    efectos: (v) => [
      suma2("confianza.objetivo", -Math.min(30, 15 * (v / 50))),
      suma2("tension.extra", -4, DOS_ANIOS)
    ],
    riesgoLegal: 0.5,
    fuentes: ["ley24cat", "supuestoDecretos"]
  },
  // ══ Quién busca casa ═════════════════════════════════════════════════════
  {
    id: "bono-alquiler",
    titulo: "Bono de alquiler para j\xF3venes",
    descripcion: "Ayuda mensual durante dos a\xF1os a quien firma un alquiler (el real son 250 \u20AC). M\xE1s familias pueden pagar los precios actuales\u2026 y los precios lo notan.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: "Ayuda mensual",
      min: 100,
      max: 500,
      paso: 50,
      defecto: 250,
      unidad: "\u20AC/mes"
    },
    efectos: (v) => [suma2("acceso.ayudaAlquiler", v), suma2("tension.extra", -2, DOS_ANIOS)],
    coste: (v, ctx) => ctx.contratos * 52 * 2 * v * ctx.nivelPrecios * 12 / 1e6,
    fuentes: ["bonoJoven"]
  },
  {
    id: "avales-hipoteca",
    titulo: "Avalar la hipoteca de los j\xF3venes",
    descripcion: "El Estado avala parte del pr\xE9stamo (el ICO avala el 20 %): el banco financia m\xE1s y hace falta menos entrada. Solo cuesta si hay impagos.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Parte del pr\xE9stamo avalada",
      min: 10,
      max: 30,
      paso: 5,
      defecto: 20,
      unidad: "%"
    },
    efectos: (v) => [suma2("hipoteca.aval", pct(v))],
    coste: (v, ctx) => ctx.compras * 52 * ctx.precioMedio * pct(v) * 0.03 / 1e6,
    fuentes: ["avalesIco", "hipotecas"]
  },
  {
    id: "hipotecas-largas",
    titulo: "Permitir hipotecas m\xE1s largas",
    descripcion: "Hoy la hipoteca media dura 25 a\xF1os. Alargarla baja la cuota y permite pagar m\xE1s por la misma casa: el precio sube.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: 1, soc: 0 },
    parametro: { nombre: "Plazo", min: 30, max: 40, paso: 5, defecto: 40, unidad: "a\xF1os" },
    efectos: (v) => [suma2("hipoteca.plazo", v - 25), suma2("confianza.objetivo", 1)],
    fuentes: ["hipotecas"]
  },
  {
    id: "subir-smi",
    titulo: "Subir el salario m\xEDnimo",
    descripcion: "Subida inmediata del SMI, que llega en parte a la renta de los hogares. Durante dos a\xF1os trae m\xE1s inflaci\xF3n y menos confianza de las empresas. Se puede repetir, pero cada subida cuesta m\xE1s que la anterior y el SMI anual no pasa del 60 % de la renta media del hogar (hoy es el 44 %).",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: -1, soc: 0 },
    repetible: true,
    parametro: { nombre: "Subida", min: 2, max: 15, paso: 1, defecto: 5, unidad: "%" },
    notaInmediata: (v) => `SMI +${v} % de inmediato (hasta su techo)`,
    alAplicar: (e, v) => {
      const sube = subidaSmi(e, v);
      e.smi *= 1 + sube;
      for (const c of e.ciudades) c.renta *= 1 + PARAMETROS.traspasoSmiRenta * sube;
    },
    efectos: (v, e) => [suma2("tension.extra", -20 * subidaSmi(e, v), DOS_ANIOS)],
    acumulativos: (v, e) => {
      const puntos = 100 * subidaSmi(e, v) * pesoSmi(e);
      return [
        suma2("inflacion.general", 6e-4 * puntos, DOS_ANIOS),
        suma2("confianza.objetivo", -puntos / 3, DOS_ANIOS)
      ];
    },
    fuentes: ["smi"]
  },
  {
    id: "restringir-inmigracion",
    titulo: "Restringir la inmigraci\xF3n",
    descripcion: "Menos familias llegan, pero tambi\xE9n menos trabajadores para la construcci\xF3n, que ya no encuentra alba\xF1iles.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: 0, soc: 2 },
    parametro: {
      nombre: "Llegadas que se recortan",
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: "%"
    },
    efectos: (v) => [
      mult("demanda.inmigracion", -pct(v)),
      mult("construccion.capacidad", -0.3 * pct(v)),
      suma2("tension.extra", v / 10, DOS_ANIOS)
    ],
    fuentes: ["inmigracion", "manoObra"]
  },
  {
    id: "facilitar-inmigracion",
    titulo: "Visados para oficios de la construcci\xF3n",
    descripcion: "M\xE1s inmigraci\xF3n laboral: m\xE1s demanda de casa y m\xE1s capacidad para construirla.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: 0, soc: -2 },
    parametro: { nombre: "Llegadas extra", min: 5, max: 30, paso: 5, defecto: 15, unidad: "%" },
    efectos: (v) => [
      mult("demanda.inmigracion", pct(v)),
      mult("construccion.capacidad", 0.5 * pct(v))
    ],
    fuentes: ["inmigracion", "manoObra"]
  },
  {
    id: "repoblar",
    titulo: "Incentivos para vivir fuera de las grandes ciudades",
    descripcion: "Teletrabajo, servicios y ventajas fiscales: parte de las familias nuevas se instala en el resto de Espa\xF1a.",
    categoria: "Qui\xE9n busca casa",
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: "Familias que se desv\xEDan",
      min: 5,
      max: 20,
      paso: 5,
      defecto: 10,
      unidad: "%"
    },
    efectos: (v) => [
      mult("demanda.inmigracion", -0.6 * pct(v)),
      mult("demanda.emancipacion", -0.6 * pct(v)),
      mult("demanda.inmigracion", 3 * pct(v), { ciudad: RESTO }),
      mult("demanda.emancipacion", 2.5 * pct(v), { ciudad: RESTO })
    ],
    coste: (v, ctx) => 50 * v * ctx.nivelPrecios,
    fuentes: ["supuestoDecretos"]
  }
];
var DECRETO_POR_ID = new Map(DECRETOS.map((d) => [d.id, d]));
var valorPorDefecto = (d) => d.parametro?.defecto ?? 1;
function valorValido(d, v) {
  if (!d.parametro) return v === 1;
  const p = d.parametro;
  return Number.isFinite(v) && v >= p.min - 1e-9 && v <= p.max + 1e-9;
}

// src/app/sim/datos/factores.ts
var FACTORES = {
  // ── Quién busca casa ─────────────────────────────────────────────────────
  "demanda.inmigracion": {
    nombre: "Familias que llegan del extranjero cada semana",
    grupo: "Qui\xE9n busca casa",
    base: 4840,
    min: 0,
    formato: "num",
    inverso: true,
    gradual: true,
    fuente: "inmigracion"
  },
  "demanda.emancipacion": {
    nombre: "Familias nuevas (j\xF3venes que se independizan) cada semana",
    grupo: "Qui\xE9n busca casa",
    base: 3700,
    min: 0,
    formato: "num",
    inverso: true,
    gradual: true,
    fuente: ["emancipacionDerivada", "emancipacion"]
  },
  "demanda.busqueda": {
    nombre: "De las familias sin casa, cu\xE1ntas buscan activamente cada semana",
    grupo: "Qui\xE9n busca casa",
    base: 0.02,
    min: 0,
    max: 1,
    formato: "pct",
    fuente: "supuesto"
  },
  "demanda.abandono": {
    nombre: "Familias sin casa que desisten (comparten piso o se marchan) cada semana",
    grupo: "Qui\xE9n busca casa",
    base: 1e-3,
    min: 0,
    max: 1,
    formato: "pct",
    fuente: "supuesto"
  },
  "demanda.disolucion": {
    nombre: "Hogares propietarios que desaparecen al a\xF1o (herencias)",
    grupo: "Qui\xE9n busca casa",
    base: 9e-3,
    min: 0,
    formato: "pct",
    fuente: ["defunciones", "supuesto"]
  },
  "demanda.preferenciaCompra": {
    nombre: "Familias que prefieren comprar antes que alquilar",
    grupo: "Qui\xE9n busca casa",
    base: 0.4,
    min: 0,
    max: 1,
    formato: "pct",
    gradual: true,
    fuente: "supuesto"
  },
  // ── Lo que pueden pagar ──────────────────────────────────────────────────
  "renta.crecimiento": {
    nombre: "Subida anual de los ingresos de los hogares",
    grupo: "Lo que pueden pagar",
    base: 0.04,
    formato: "pct",
    fuente: "salarios"
  },
  "smi.crecimiento": {
    nombre: "Subida anual del salario m\xEDnimo",
    grupo: "Lo que pueden pagar",
    base: 0.04,
    formato: "pct",
    fuente: ["smi", "salarios"]
  },
  "acceso.esfuerzoAlquiler": {
    nombre: "Parte de los ingresos que una familia puede dedicar al alquiler",
    grupo: "Lo que pueden pagar",
    base: 0.4,
    min: 0.1,
    max: 0.8,
    formato: "pct",
    fuente: ["esfuerzoAlquiler", "supuesto"]
  },
  "acceso.ayudaAlquiler": {
    nombre: "Ayuda p\xFAblica al alquiler (\u20AC/mes)",
    grupo: "Lo que pueden pagar",
    base: 0,
    min: 0,
    formato: "eur",
    fuente: "bonoJoven"
  },
  "hipoteca.tipo": {
    nombre: "Tipo de inter\xE9s de las hipotecas",
    grupo: "Lo que pueden pagar",
    base: 0.029,
    min: 1e-3,
    formato: "pct",
    inverso: true,
    fuente: "hipotecas"
  },
  "hipoteca.plazo": {
    nombre: "A\xF1os de hipoteca",
    grupo: "Lo que pueden pagar",
    base: 25,
    min: 5,
    max: 50,
    formato: "anios",
    fuente: "hipotecas"
  },
  "hipoteca.esfuerzo": {
    nombre: "Parte de los ingresos que el banco deja dedicar a la cuota",
    grupo: "Lo que pueden pagar",
    base: 0.35,
    min: 0.1,
    max: 0.6,
    formato: "pct",
    fuente: ["esfuerzoBde", "supuesto"]
  },
  "hipoteca.aval": {
    nombre: "Parte extra del precio que el banco financia gracias a un aval p\xFAblico",
    grupo: "Lo que pueden pagar",
    base: 0,
    min: 0,
    max: 0.5,
    formato: "pct",
    fuente: "avalesIco"
  },
  "hipoteca.financiacion": {
    nombre: "Parte del precio que presta el banco (el resto es la entrada)",
    grupo: "Lo que pueden pagar",
    base: 0.8,
    min: 0.5,
    max: 1,
    formato: "pct",
    fuente: ["hipotecas", "supuesto"]
  },
  "impuesto.compra": {
    nombre: "Impuestos al comprar una casa (ITP o IVA)",
    grupo: "Lo que pueden pagar",
    base: 0.1,
    min: 0,
    max: 0.3,
    formato: "pct",
    inverso: true,
    fuente: "impuestoCompra"
  },
  // ── Casas que salen al mercado (ya construidas) ──────────────────────────
  "oferta.intencionAlquilar": {
    nombre: "Ganas del propietario de alquilar (en vez de vender o dejar vac\xEDo)",
    grupo: "Casas que salen al mercado",
    base: 0.6,
    min: 0,
    max: 1,
    formato: "pct",
    gradual: true,
    fuente: ["rentabilidad", "supuesto"]
  },
  "oferta.movilizacion": {
    nombre: "Casas vac\xEDas que salen al mercado cada semana",
    grupo: "Casas que salen al mercado",
    base: 25e-5,
    min: 0,
    formato: "pct",
    gradual: true,
    fuente: "supuesto"
  },
  "oferta.retirada": {
    nombre: "Anuncios de alquiler que se retiran cada semana",
    grupo: "Casas que salen al mercado",
    base: 0.02,
    min: 0,
    max: 1,
    formato: "pct",
    inverso: true,
    gradual: true,
    fuente: "supuesto"
  },
  "inversion.demanda": {
    nombre: "Ganas de los inversores de comprar vivienda",
    grupo: "Casas que salen al mercado",
    base: 1,
    min: 0,
    formato: "x",
    inverso: true,
    gradual: true,
    fuente: "supuesto"
  },
  "compra.publica": {
    nombre: "Casas que compra el Estado cada semana para alquiler social",
    grupo: "Casas que salen al mercado",
    base: 0,
    min: 0,
    formato: "num",
    fuente: "casa47"
  },
  // ── Construcción ─────────────────────────────────────────────────────────
  "construccion.privada": {
    nombre: "Ritmo de la construcci\xF3n privada",
    grupo: "Construcci\xF3n",
    base: 1,
    min: 0,
    formato: "x",
    gradual: true,
    fuente: "terminadas"
  },
  "construccion.publica": {
    nombre: "Vivienda p\xFAblica que se empieza cada semana",
    grupo: "Construcci\xF3n",
    base: 247,
    min: 0,
    formato: "num",
    fuente: "terminadas"
  },
  "construccion.concesion": {
    nombre: "Vivienda asequible en suelo p\xFAblico que empiezan promotores privados cada semana",
    grupo: "Construcci\xF3n",
    base: 0,
    min: 0,
    formato: "num",
    fuente: "planEstatal"
  },
  "construccion.capacidad": {
    nombre: "M\xE1ximo que puede construir el sector (viviendas por semana)",
    grupo: "Construcci\xF3n",
    base: 4200,
    min: 0,
    formato: "num",
    gradual: true,
    fuente: ["visados", "manoObra", "supuesto"]
  },
  "construccion.retraso": {
    nombre: "Semanas desde que se decide construir hasta que se entrega",
    grupo: "Construcci\xF3n",
    base: 90,
    min: 20,
    formato: "num",
    inverso: true,
    gradual: true,
    fuente: "licencias"
  },
  // ── Precios ──────────────────────────────────────────────────────────────
  "inflacion.general": {
    nombre: "Inflaci\xF3n (IPC anual)",
    grupo: "Precios",
    base: 0.031,
    formato: "pct",
    inverso: true,
    fuente: ["ipc", "imprimir"]
  },
  "alquiler.sensibilidad": {
    nombre: "Cu\xE1nto reacciona el alquiler cuando falta (o sobra) vivienda",
    grupo: "Precios",
    base: 0.2,
    min: 0,
    formato: "x",
    fuente: "supuesto"
  },
  "alquiler.crecimientoMax": {
    nombre: "Subida m\xE1xima del alquiler al a\xF1o",
    grupo: "Precios",
    base: 0.18,
    formato: "pct",
    inverso: true,
    fuente: "supuesto"
  },
  "alquiler.crecimientoMin": {
    nombre: "Bajada m\xE1xima del alquiler al a\xF1o",
    grupo: "Precios",
    base: -0.12,
    formato: "pct",
    fuente: "supuesto"
  },
  "venta.sensibilidad": {
    nombre: "Cu\xE1nto reacciona el precio de venta cuando falta (o sobra) vivienda",
    grupo: "Precios",
    base: 0.22,
    min: 0,
    formato: "x",
    fuente: "supuesto"
  },
  "venta.crecimientoMax": {
    nombre: "Subida m\xE1xima del precio de venta al a\xF1o",
    grupo: "Precios",
    base: 0.15,
    formato: "pct",
    inverso: true,
    fuente: "supuesto"
  },
  "venta.crecimientoMin": {
    nombre: "Bajada m\xE1xima del precio de venta al a\xF1o",
    grupo: "Precios",
    base: -0.1,
    formato: "pct",
    fuente: "supuesto"
  },
  // ── Reglas del alquiler ──────────────────────────────────────────────────
  "desahucios.tasa": {
    nombre: "Inquilinos desahuciados cada semana",
    grupo: "Reglas del alquiler",
    base: 877e-7,
    min: 0,
    formato: "pct",
    inverso: true,
    fuente: "lanzamientos"
  },
  "contratos.noRenovacion": {
    nombre: "Contratos que el casero no renueva cada semana (base)",
    grupo: "Reglas del alquiler",
    base: 6e-4,
    min: 0,
    formato: "pct",
    inverso: true,
    fuente: "noRenovaciones"
  },
  "cumplimiento.alquiler": {
    nombre: "Cu\xE1nto se cumplen los topes del alquiler",
    grupo: "Reglas del alquiler",
    base: 0.75,
    min: 0,
    max: 1,
    formato: "pct",
    gradual: true,
    fuente: "supuesto"
  },
  // ── Clima político y dinero público ──────────────────────────────────────
  "confianza.objetivo": {
    nombre: "Confianza de propietarios e inversores",
    grupo: "Clima y dinero p\xFAblico",
    base: 60,
    min: 0,
    max: 100,
    formato: "num",
    fuente: "supuesto"
  },
  "tension.extra": {
    nombre: "Tensi\xF3n social que a\xF1aden o quitan las leyes",
    grupo: "Clima y dinero p\xFAblico",
    base: 0,
    formato: "num",
    inverso: true,
    fuente: "supuesto"
  },
  "presupuesto.mensual": {
    nombre: "Dinero p\xFAblico para vivienda cada mes (M\u20AC)",
    grupo: "Clima y dinero p\xFAblico",
    base: 290,
    min: 0,
    formato: "meur",
    fuente: ["pge", "eurostatVivienda"]
  }
};

// src/app/sim/motor/modificadores.ts
function aplica(m, ambito) {
  if (m.propietario && m.propietario !== ambito?.propietario) return false;
  if (m.ciudad && m.ciudad !== ambito?.ciudad) return false;
  return true;
}
function calcular(def, mods, ambito, semana = Infinity) {
  let suma3 = def.base;
  let mult2 = 1;
  let tope2 = Infinity;
  let suelo = -Infinity;
  for (const m of mods) {
    if (!aplica(m, ambito)) continue;
    const peso = def.gradual && m.desde !== void 0 ? Math.max(0, Math.min(1, (semana - m.desde) / PARAMETROS.semanasDespliegue)) : 1;
    if (m.op === "suma") suma3 += m.valor * peso;
    else if (m.op === "mult") mult2 *= Math.max(0, 1 + m.valor * peso);
    else if (m.op === "tope") tope2 = Math.min(tope2, m.valor);
    else suelo = Math.max(suelo, m.valor);
  }
  let v = Math.max(suelo, Math.min(tope2, suma3 * mult2));
  if (def.min !== void 0) v = Math.max(def.min, v);
  if (def.max !== void 0) v = Math.min(def.max, v);
  return v;
}
function crearResolver(e) {
  const porFactor = /* @__PURE__ */ new Map();
  for (const m of e.modificadores) {
    const lista2 = porFactor.get(m.factor);
    if (lista2) lista2.push(m);
    else porFactor.set(m.factor, [m]);
  }
  const vacio = [];
  return (id, ambito) => calcular(FACTORES[id], porFactor.get(id) ?? vacio, ambito, e.semana);
}

// src/app/sim/motor/gasto.ts
function gastoAnual(e, ctx) {
  let g = 0;
  const coste = PARAMETROS.costeViviendaPublica * e.nivelPrecios * e.costeObra;
  for (const c of e.ciudades) {
    g += (c.ritmoObraPublica + c.ritmoObraConcesion * 0.3) * 52 * coste + c.flujos.costeCompraPublica * 52;
  }
  for (const [id, v] of Object.entries(e.vigentes)) {
    const d = DECRETO_POR_ID.get(id);
    if (d?.coste) g += d.coste(v, ctx);
  }
  return g;
}
function ingresosAnual(e) {
  const alquilerSocial = e.smi * PARAMETROS.alquilerSocialPctSmi * 12;
  const gestion = PARAMETROS.gestionPublica * e.nivelPrecios;
  let g = 0;
  for (const c of e.ciudades) {
    const p = c.parque.publico;
    const total = p.alquilada + p.ofAlquiler + p.vacia;
    const propio = total > 0 ? Math.max(0, 1 - c.concesion / total) : 0;
    g += propio * (p.alquilada * alquilerSocial - total * gestion);
    g += (c.ritmoObra - c.obraBase) * 52 * c.precio * PARAMETROS.retornoFiscalObra;
  }
  return g / 1e6;
}

// src/app/sim/motor/reglas/economia.ts
var IPC_BASE = FACTORES["inflacion.general"].base;
function azar(e) {
  e.azar = e.azar + 1831565813 | 0;
  let t = Math.imul(e.azar ^ e.azar >>> 15, 1 | e.azar);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
var sobretipo = (e, f) => f("inflacion.general") - IPC_BASE + PARAMETROS.primaRiesgo * Math.max(0, 60 - e.confianza) / 60 + PARAMETROS.ciclo.tipo * e.coyuntura;
var tipoHipoteca = (e, f, ambito) => Math.max(1e-3, f("hipoteca.tipo", ambito) + sobretipo(e, f));
var tipoDeuda = (e, f) => Math.max(0, PARAMETROS.deuda.interes + sobretipo(e, f));
var ayudaAlquiler = (e, f, ambito) => f("acceso.ayudaAlquiler", ambito) * e.nivelPrecios;
var economia = {
  id: "economia",
  nombre: "Rentas, salario m\xEDnimo e IPC",
  ejecutar(e, f) {
    e.modificadores = e.modificadores.filter((m) => m.hasta === void 0 || m.hasta > e.semana);
    const quieto = e.calibrando;
    const ipc = f("inflacion.general");
    const traspaso = (ipc - IPC_BASE) * PARAMETROS.traspasoInflacion;
    if (!quieto) {
      const choque = (azar(e) + azar(e) + azar(e) - 1.5) * 2 * PARAMETROS.ciclo.choque;
      e.coyuntura = Math.max(-1, Math.min(1, e.coyuntura * PARAMETROS.ciclo.persistencia + choque));
      e.smi *= 1 + (f("smi.crecimiento") + traspaso) / 52;
      e.nivelPrecios *= 1 + ipc / 52;
    }
    for (const c of e.ciudades) {
      c.flujos = flujosVacios();
      if (quieto) continue;
      c.renta *= 1 + (f("renta.crecimiento", { ciudad: c.id }) + traspaso + PARAMETROS.ciclo.renta * e.coyuntura) / 52;
      c.precioRef *= 1 + ipc / 52;
      c.alquilerRef *= 1 + ipc / 52;
    }
  }
};

// src/app/sim/motor/reglas/clima.ts
var rojo = (e) => Math.max(0, -e.cartera.saldo) / e.nivelPrecios / 1e3;
var deudaReal = (e) => e.cartera.deuda / e.nivelPrecios / 1e3;
var caidaPrecio = (e, ind) => Math.max(0, 1 - ind.precioMedio / e.precioMax - PARAMETROS.propietarios.umbral);
var apoyo = (e) => clamp(
  50 - PARAMETROS.elecciones.tension * (e.tension - 60) + PARAMETROS.elecciones.mejora * (e.eleccion.tensionAnterior - e.tension) + PARAMETROS.apoyoCoyuntura * e.coyuntura,
  0,
  100
);
function objetivoTension(e, f, ind) {
  const expulsados = ind.flujos.desahucios + ind.flujos.noRenovados;
  const inflacionExtra = Math.max(0, f("inflacion.general") - IPC_BASE);
  const presion2 = Math.max(ind.presion.ponderada, ind.presion.principales);
  return 100 * (presion2 - 0.15) / 0.8 + // Las expulsiones suman como mucho 40 puntos: a partir de cinco veces lo normal ya no pesan más.
  10 * (Math.min(5, expulsados / (ind.inquilinos * PARAMETROS.expulsadosRef)) - 1) + 500 * inflacionExtra + 1 * rojo(e) + PARAMETROS.deuda.tensionPorMil * deudaReal(e) + PARAMETROS.propietarios.tension * caidaPrecio(e, ind) + f("tension.extra");
}
var clima = {
  id: "clima",
  nombre: "Tensi\xF3n, confianza, cartera y objetivos",
  ejecutar(e, f) {
    if (e.calibrando) return;
    const ayuda = ayudaAlquiler(e, f);
    const ind = indicadores(e, f("impuesto.compra"), ayuda);
    e.gastoAnual = gastoAnual(e, contexto(ind)) + e.cartera.deuda * tipoDeuda(e, f);
    e.ingresosAnual = ingresosAnual(e);
    e.cartera.saldo += (e.ingresosAnual - e.gastoAnual) / 52;
    e.precioMax = Math.max(ind.precioMedio, e.precioMax * (1 - PARAMETROS.propietarios.olvido / 52));
    const objetivo = objetivoTension(e, f, ind);
    e.tension = clamp(e.tension + (objetivo - e.tension) / 26, 0, 100);
    const inflacionExtra = Math.max(0, f("inflacion.general") - IPC_BASE);
    const objetivoConfianza = f("confianza.objetivo") - 200 * inflacionExtra - 1 * rojo(e) - PARAMETROS.deuda.confianzaPorMil * deudaReal(e) - PARAMETROS.propietarios.confianza * caidaPrecio(e, ind) + PARAMETROS.ciclo.confianza * e.coyuntura;
    e.confianza = clamp(e.confianza + (objetivoConfianza - e.confianza) / 26, 0, 100);
    e.historial.push({
      semana: e.semana,
      alojadas: ind.alojadas,
      espera: ind.espera,
      aniosCompra: ind.aniosCompra,
      esfuerzoSmi: ind.esfuerzoSmi,
      tension: e.tension,
      confianza: e.confianza,
      flujos: ind.flujos,
      alquiler: ind.alquilerMercado,
      precio: ind.precioMedio,
      smi: e.smi,
      impuestoCompra: f("impuesto.compra"),
      ipc: f("inflacion.general"),
      nivelPrecios: e.nivelPrecios,
      gasto: e.gastoAnual,
      saldo: e.cartera.saldo,
      deuda: e.cartera.deuda,
      ofAlquiler: ind.enAlquiler,
      ofVenta: ind.enVenta,
      presiones: e.ciudades.map((c) => Math.round(presion(c, ayuda) * 1e3) / 1e3)
    });
    if (e.historial.length > PARAMETROS.maxHistorial)
      e.historial = e.historial.filter((_, i) => i % 2 === 1);
    if (!e.fin) {
      if (ind.cumple.alojadas && ind.cumple.compra && ind.cumple.alquiler) e.fin = "victoria";
      else if (e.tension >= 100) {
        e.fin = "derrota";
        e.motivoFin = "tension";
      }
    }
  }
};

// src/app/sim/motor/reglas/construccion.ts
var construccion = {
  id: "construccion",
  nombre: "Construcci\xF3n y compra p\xFAblica",
  ejecutar(e, f) {
    const esperaTotal = e.ciudades.reduce((s, c) => s + c.espera, 0) || 1;
    const publicaNacional = f("construccion.publica");
    const concesionNacional = f("construccion.concesion");
    const compraNacional = f("compra.publica");
    const enObra = e.ciudades.reduce(
      (s, c) => s + c.ritmoObra + c.ritmoObraPublica + c.ritmoObraConcesion,
      0
    );
    const uso = enObra / Math.max(1, f("construccion.capacidad"));
    e.costeObra = clamp(
      Math.pow(uso / PARAMETROS.costeObra.usoBase, PARAMETROS.costeObra.exponente),
      1,
      PARAMETROS.costeObra.max
    );
    const objetivos = e.ciudades.map((c) => {
      const margen = clamp(Math.pow(c.precio / c.precioRef / e.costeObra, 0.8), 0.5, 1.6);
      const hayDonde = clamp(c.suelo / (PARAMETROS.suelo.reserva * 52 * Math.max(1, c.ritmoObra)));
      const privada = c.obraBase * f("construccion.privada", { ciudad: c.id }) * // Con la confianza hundida casi nadie promueve: 0,2 a confianza 0, 1 a confianza 60.
      Math.min(1.35, 0.2 + 0.8 * e.confianza / 60) * margen * hayDonde;
      const cuota = c.espera / esperaTotal;
      return { privada, publica: publicaNacional * cuota, concesion: concesionNacional * cuota };
    });
    const total = objetivos.reduce((s, o) => s + o.privada + o.publica + o.concesion, 0);
    const escala = Math.min(1, f("construccion.capacidad") / (total || 1));
    const retraso = f("construccion.retraso");
    e.ciudades.forEach((c, k) => {
      c.ritmoObra += (objetivos[k].privada * escala - c.ritmoObra) / retraso;
      c.ritmoObraPublica += (objetivos[k].publica * escala - c.ritmoObraPublica) / retraso;
      c.ritmoObraConcesion += (objetivos[k].concesion * escala - c.ritmoObraConcesion) / retraso;
      const n2 = c.ritmoObra;
      c.suelo = Math.max(0, c.suelo + c.obraBase - n2);
      const paraAlquiler = c.intencion.grandes > 0.5 ? n2 * PARAMETROS.repartoObra.grandes * PARAMETROS.obraParaAlquiler : 0;
      c.parque.familias.ofVenta += n2 * PARAMETROS.repartoObra.familias;
      c.parque.pequenos.ofVenta += n2 * PARAMETROS.repartoObra.pequenos;
      c.parque.grandes.ofVenta += n2 * PARAMETROS.repartoObra.grandes - paraAlquiler;
      c.parque.grandes.ofAlquiler += paraAlquiler;
      c.parque.publico.ofAlquiler += c.ritmoObraPublica + c.ritmoObraConcesion;
      c.concesion += c.ritmoObraConcesion;
      const enVenta = suma(c, "ofVenta", true);
      const compra = Math.min(compraNacional * c.espera / esperaTotal, enVenta * 0.02);
      if (compra > 0) {
        for (const o of ["familias", "pequenos", "grandes"]) {
          c.parque[o].ofVenta -= compra * c.parque[o].ofVenta / enVenta;
        }
        c.parque.publico.ofAlquiler += compra;
        c.flujos.compraPublica = compra;
        c.flujos.costeCompraPublica = compra * c.precio * (1 + f("impuesto.compra", { ciudad: c.id })) / 1e6;
      }
      c.flujos.construidas = n2 + c.ritmoObraPublica + c.ritmoObraConcesion;
      e.contadores.construidas += c.flujos.construidas;
    });
  }
};

// src/app/sim/motor/reglas/demanda.ts
var demanda = {
  id: "demanda",
  nombre: "Llegadas y emancipaci\xF3n",
  ejecutar(e, f) {
    const el = PARAMETROS.elasticidadDemanda;
    const demografia = 1 - PARAMETROS.demografia.caidaInmigracion * Math.min(1, e.semana / 52 / PARAMETROS.demografia.anios);
    const llegadas = demografia * (1 + PARAMETROS.ciclo.llegadas * e.coyuntura);
    const empleo = 1 + PARAMETROS.ciclo.emancipacion * e.coyuntura;
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      const alivio = c.esfuerzoRef / Math.max(1e-6, esfuerzoEntrada(c, ayudaAlquiler(e, f, ambito)));
      const freno = (elasticidad) => clamp(Math.pow(alivio, elasticidad), el.min, el.max);
      const inm = f("demanda.inmigracion", ambito) * c.cuotaInm * freno(el.inmigracion) * llegadas;
      const eman = f("demanda.emancipacion", ambito) * c.cuotaEman * freno(el.emancipacion) * empleo;
      c.espera += inm + eman - c.espera * f("demanda.abandono", ambito);
      c.flujos.inmigrantes = inm;
      c.flujos.emancipados = eman;
      e.contadores.inmigrantesDesde2018 += inm;
    }
  }
};
var mudanzas = {
  id: "mudanzas",
  nombre: "Mudanzas entre ciudades",
  ejecutar(e, f) {
    if (e.calibrando) return;
    const esfuerzo = e.ciudades.map(
      (c) => esfuerzoEntrada(c, ayudaAlquiler(e, f, { ciudad: c.id }))
    );
    const tamano = e.ciudades.map(
      (c) => PROPIETARIOS.reduce((s, o) => s + c.parque[o].alquilada + c.parque[o].propia, 0)
    );
    const total = tamano.reduce((s, h) => s + h, 0);
    const medio = esfuerzo.reduce((s, x, k) => s + x * tamano[k], 0) / total;
    let salen = 0;
    let hueco = 0;
    const cambio = e.ciudades.map((c, k) => {
      const exceso = esfuerzo[k] / medio - 1;
      if (exceso > 0) {
        const x = c.espera * Math.min(1, PARAMETROS.movilidad * exceso);
        salen += x;
        return -x;
      }
      hueco += tamano[k] * -exceso;
      return tamano[k] * -exceso;
    });
    if (!hueco) return;
    e.ciudades.forEach((c, k) => {
      c.espera += cambio[k] < 0 ? cambio[k] : salen * cambio[k] / hueco;
    });
  }
};
function liberar(c, o, n2) {
  const p = c.parque[o];
  const i = c.intencion[o];
  p.alquilada -= n2;
  p.ofAlquiler += n2 * i;
  p.ofVenta += n2 * (1 - i) * 0.6;
  p.vacia += n2 * (1 - i) * 0.4;
  c.flujos.nuevaOferta += n2 * i + n2 * (1 - i) * 0.6;
}
var disoluciones = {
  id: "disoluciones",
  nombre: "Herencias",
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const tasa = f("demanda.disolucion", { ciudad: c.id }) / 52;
      const fam = c.parque.familias;
      const d = fam.propia * tasa;
      fam.propia -= d;
      fam.ofVenta += d * PARAMETROS.herencia.venta;
      fam.ofAlquiler += d * PARAMETROS.herencia.alquiler;
      fam.vacia += d * PARAMETROS.herencia.vacia;
      c.flujos.nuevaOferta += d * (PARAMETROS.herencia.venta + PARAMETROS.herencia.alquiler);
      for (const o of PROPIETARIOS)
        liberar(c, o, c.parque[o].alquilada * tasa * PARAMETROS.disolucionInquilinos);
    }
  }
};

// src/app/sim/motor/reglas/emparejamiento.ts
var PRIVADOS2 = ["familias", "pequenos", "grandes"];
var accesible = (precio, limite) => 1 / (1 + Math.pow(precio / Math.max(1, limite), PARAMETROS.exponenteAcceso));
var emparejamiento = {
  id: "emparejamiento",
  nombre: "Compras y contratos de alquiler",
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      let buscan = c.espera * f("demanda.busqueda", ambito);
      const pub = c.parque.publico;
      const adjudicadas = Math.min(pub.ofAlquiler, buscan);
      pub.ofAlquiler -= adjudicadas;
      pub.alquilada += adjudicadas;
      c.espera -= adjudicadas;
      buscan -= adjudicadas;
      const rentaBuscador = c.renta * PARAMETROS.rentaBuscadores;
      const impuesto = f("impuesto.compra", ambito);
      const anios2 = aniosFinanciables(
        tipoHipoteca(e, f, ambito),
        f("hipoteca.plazo", ambito),
        f("hipoteca.esfuerzo", ambito),
        0
      );
      const financia = Math.min(1, f("hipoteca.financiacion", ambito) + f("hipoteca.aval", ambito));
      const puedeComprar = (renta) => 1 / (1 + Math.pow(c.precio * financia / (renta * anios2), PARAMETROS.exponenteAcceso) + Math.pow(
        c.precio * (1 - financia + impuesto) / (renta * PARAMETROS.ahorroCompra),
        PARAMETROS.exponenteAcceso
      ));
      const demEspera = buscan * f("demanda.preferenciaCompra", ambito) * puedeComprar(rentaBuscador);
      const inquilinos = suma(c, "alquilada", true);
      const demInquilinos = inquilinos * PARAMETROS.inquilinosCompran * puedeComprar(c.renta);
      const enVenta = suma(c, "ofVenta", true);
      const expectativa = clamp(
        1 + PARAMETROS.expectativas * (c.crecVenta - f("inflacion.general")),
        0.5,
        2
      );
      const atractivo = clamp((c.rentabilidad - 0.035) / 0.025, 0, 2) * (e.confianza / 60) * expectativa;
      const demInversor = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      const h = hogares(c);
      for (const o of ["pequenos", "grandes"]) {
        demInversor[o] = h * PARAMETROS.inversionBase[o] * atractivo * f("inversion.demanda", { propietario: o, ciudad: c.id });
      }
      const demCompra = demEspera + demInquilinos + demInversor.pequenos + demInversor.grandes;
      const cabeVenta = enVenta * PARAMETROS.rotacionVenta;
      const ventas = demCompra > 0 ? demCompra * cabeVenta / (demCompra + cabeVenta) : 0;
      const k = demCompra > 0 ? ventas / demCompra : 0;
      const cuotaVenta = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      const cuotaAlquilada = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      for (const o of PRIVADOS2) {
        cuotaVenta[o] = enVenta > 0 ? c.parque[o].ofVenta / enVenta : 0;
        cuotaAlquilada[o] = inquilinos > 0 ? c.parque[o].alquilada / inquilinos : 0;
      }
      const compranEspera = demEspera * k;
      const compranInquilinos = demInquilinos * k;
      for (const o of PRIVADOS2) {
        const p = c.parque[o];
        p.ofVenta -= ventas * cuotaVenta[o];
        p.alquilada -= compranInquilinos * cuotaAlquilada[o];
        p.ofAlquiler += compranInquilinos * cuotaAlquilada[o];
        const inv = demInversor[o] * k;
        p.ofAlquiler += inv * c.intencion[o];
        p.vacia += inv * (1 - c.intencion[o]);
      }
      c.parque.familias.propia += compranEspera + compranInquilinos;
      c.espera -= compranEspera;
      c.ratioVenta = demCompra / (enVenta * PARAMETROS.absorcionVenta + 1);
      const limiteAlquiler = rentaBuscador / 12 * f("acceso.esfuerzoAlquiler", ambito) + ayudaAlquiler(e, f, ambito);
      const demAlquiler = (buscan - compranEspera) * accesible(c.alquiler, limiteAlquiler);
      const enAlquiler = suma(c, "ofAlquiler", true);
      const cabeAlquiler = enAlquiler * PARAMETROS.rotacionAlquiler;
      const contratos = demAlquiler > 0 ? demAlquiler * cabeAlquiler / (demAlquiler + cabeAlquiler) : 0;
      for (const o of PRIVADOS2) {
        const p = c.parque[o];
        const n2 = enAlquiler > 0 ? contratos * p.ofAlquiler / enAlquiler : 0;
        p.ofAlquiler -= n2;
        p.alquilada += n2;
      }
      c.espera -= contratos;
      c.ratioAlq = demAlquiler / (enAlquiler * PARAMETROS.absorcionAlquiler + 1);
      const fl = c.flujos;
      fl.compras = compranEspera + compranInquilinos;
      fl.contratos = contratos + adjudicadas;
      fl.logran = adjudicadas + compranEspera + contratos;
      fl.noLogran = Math.max(
        0,
        fl.inmigrantes + fl.emancipados + fl.desahucios + fl.noRenovados - fl.logran
      );
    }
  }
};

// src/app/sim/motor/reglas/oferta.ts
var intencion = {
  id: "intencion",
  nombre: "Intenci\xF3n de alquilar o vender",
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      c.rentabilidad = rentabilidad(c.alquiler, c.precio);
      const suelo = sueloAlquilerDe(c);
      const cubreCostes = clamp((c.alquiler - suelo) / (0.2 * suelo));
      for (const o of PROPIETARIOS) {
        if (o === "publico") {
          c.intencion[o] = 1;
          continue;
        }
        const base = f("oferta.intencionAlquilar", { propietario: o, ciudad: c.id });
        const porRentabilidad = PARAMETROS.sensRentabilidad[o] * (c.rentabilidad - PARAMETROS.rentabilidadNeutra);
        c.intencion[o] = clamp(base + porRentabilidad + (e.confianza - 60) / 200) * cubreCostes;
      }
    }
  }
};
var expulsiones = {
  id: "expulsiones",
  nombre: "Desahucios y no renovaciones",
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      const tasaDesahucio = f("desahucios.tasa", ambito);
      const noRenovacion = f("contratos.noRenovacion", ambito);
      const brecha = Math.max(0, c.alquiler / c.alquilerVivo - 1);
      const porPrecio = Math.min(3, brecha / PARAMETROS.brechaNoRenovacion);
      for (const o of PROPIETARIOS) {
        const p = c.parque[o];
        const porSalida = Math.max(0, 0.6 - c.intencion[o]) * 2;
        const freno = o === "publico" ? 0.2 : 1;
        const desahuciados = p.alquilada * Math.min(1, tasaDesahucio * freno);
        const noRenovados = Math.min(
          p.alquilada - desahuciados,
          p.alquilada * noRenovacion * (porPrecio + porSalida) * freno
        );
        const x = desahuciados + noRenovados;
        liberar(c, o, x);
        c.espera += x;
        c.flujos.desahucios += desahuciados;
        c.flujos.noRenovados += noRenovados;
        e.contadores.expulsados += x;
      }
    }
  }
};
var ofertaExistente = {
  id: "oferta-existente",
  nombre: "Movilizaci\xF3n de vivienda vac\xEDa",
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      for (const o of PROPIETARIOS) {
        const p = c.parque[o];
        const i = c.intencion[o];
        const ambito = { propietario: o, ciudad: c.id };
        const sale = Math.min(
          p.vacia,
          p.vacia * f("oferta.movilizacion", ambito) * PARAMETROS.movilizacion[o]
        );
        p.vacia -= sale;
        p.ofAlquiler += sale * i;
        p.ofVenta += sale * (1 - i);
        c.flujos.nuevaOferta += sale;
        if (o === "publico") continue;
        const retirada = p.ofAlquiler * Math.min(1, f("oferta.retirada", ambito) * (1 - i));
        p.ofAlquiler -= retirada;
        p.vacia += retirada;
      }
    }
  }
};

// src/app/sim/motor/reglas/precios.ts
var precios = {
  id: "precios",
  nombre: "Alquileres y precios de venta",
  ejecutar(e, f) {
    if (e.calibrando) return;
    const ipc = f("inflacion.general");
    const kAlq = f("alquiler.sensibilidad");
    const kVenta = f("venta.sensibilidad");
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      if (!c.neutroAlq) c.neutroAlq = c.ratioAlq / Math.exp((c.crecAlqRef - ipc) / kAlq);
      if (!c.neutroVenta) c.neutroVenta = c.ratioVenta / Math.exp((c.crecVentaRef - ipc) / kVenta);
      const objAlq = ipc + kAlq * Math.log(Math.max(1e-6, c.ratioAlq) / c.neutroAlq);
      c.crecAlq += (objAlq - c.crecAlq) * 0.25;
      const topeAlq = f("alquiler.crecimientoMax", ambito);
      const fuga = (1 - f("cumplimiento.alquiler", ambito)) * Math.max(0, objAlq - topeAlq);
      c.crecAlq = clamp(c.crecAlq, f("alquiler.crecimientoMin", ambito), topeAlq + fuga);
      c.alquiler *= 1 + c.crecAlq / 52;
      if (c.crecAlq < 0) c.alquiler = Math.max(c.alquiler, sueloAlquilerDe(c));
      c.alquilerVivo *= 1 + Math.min(ipc, topeAlq + fuga) / 52;
      const inquilinos = suma(c, "alquilada", true);
      const rotacion = Math.min(
        1,
        1 / PARAMETROS.semanasContrato + (inquilinos > 0 ? c.flujos.contratos / inquilinos : 0)
      );
      c.alquilerVivo += (c.alquiler - c.alquilerVivo) * rotacion;
      const objVenta = ipc + kVenta * Math.log(Math.max(1e-6, c.ratioVenta) / c.neutroVenta);
      c.crecVenta += (objVenta - c.crecVenta) * 0.25;
      c.crecVenta = clamp(
        c.crecVenta,
        f("venta.crecimientoMin", ambito),
        f("venta.crecimientoMax", ambito)
      );
      c.precio *= 1 + c.crecVenta / 52;
      if (c.crecVenta < 0) c.precio = Math.max(c.precio, sueloPrecioDe(c, e));
    }
  }
};

// src/app/sim/motor/reglas/index.ts
var REGLAS = [
  economia,
  demanda,
  mudanzas,
  disoluciones,
  intencion,
  expulsiones,
  ofertaExistente,
  construccion,
  emparejamiento,
  precios,
  clima
];

// src/app/sim/motor/motor.ts
var parque = (p = {}) => ({
  propia: 0,
  alquilada: 0,
  ofAlquiler: 0,
  ofVenta: 0,
  vacia: 0,
  ...p
});
var inquilinosDe = (d) => d.hogares * d.pctAlquiler * (PARAMETROS.pctAlquilerEcv2025 / PARAMETROS.pctAlquilerCenso2021);
function crearCiudad(d, t) {
  const hogares2 = d.hogares;
  const inquilinos = inquilinosDe(d);
  const publico = inquilinos * (PARAMETROS.viviendaPublicaAlquiler / t.inquilinos);
  const privado = inquilinos - publico;
  const cuota = {
    grandes: PARAMETROS.alquilerEmpresas,
    pequenos: PARAMETROS.alquilerGrandesParticulares,
    familias: 1 - PARAMETROS.alquilerEmpresas - PARAMETROS.alquilerGrandesParticulares
  };
  const ofAlquiler = privado * PARAMETROS.ofertaAlquilerInicial;
  const ofVenta = d.viviendas * (PARAMETROS.ofertaVenta / t.viviendas);
  const vacia = d.viviendas - hogares2 - ofAlquiler - ofVenta;
  const cuotaInm = d.saldoExterior / t.saldoExterior;
  const cuotaHogares = hogares2 / t.hogares;
  const precio = d.precioM2 * PARAMETROS.superficieVenta;
  const alquiler = d.alquilerM2 * PARAMETROS.superficieAlquiler;
  const renta = d.renta * (PARAMETROS.rentaHogarEcv2025 / PARAMETROS.rentaHogarAtlas2023);
  const obra = d.terminadasLibres / 52;
  return {
    id: d.id,
    nombre: d.nombre,
    lon: d.lon,
    lat: d.lat,
    principal: d.id !== RESTO && d.hogares >= PARAMETROS.principalMinHogares,
    // El déficit oficial se reparte entre llegadas y tamaño; la demanda joven latente, por tamaño.
    espera: PARAMETROS.deficitViviendas * (cuotaInm + cuotaHogares) / 2 + PARAMETROS.jovenesLatentes * cuotaHogares,
    parque: {
      familias: parque({
        propia: hogares2 - inquilinos,
        alquilada: privado * cuota.familias,
        ofAlquiler: ofAlquiler * cuota.familias,
        ofVenta: ofVenta * cuota.familias,
        vacia: vacia * cuota.familias
      }),
      pequenos: parque({
        alquilada: privado * cuota.pequenos,
        ofAlquiler: ofAlquiler * cuota.pequenos,
        ofVenta: ofVenta * cuota.pequenos,
        vacia: vacia * cuota.pequenos
      }),
      grandes: parque({
        alquilada: privado * cuota.grandes,
        ofAlquiler: ofAlquiler * cuota.grandes,
        ofVenta: ofVenta * cuota.grandes,
        vacia: vacia * cuota.grandes
      }),
      publico: parque({ alquilada: publico })
    },
    precio,
    alquiler,
    alquilerVivo: alquiler * PARAMETROS.alquilerVivoInicial,
    suelo: obra * 52 * (d.id !== RESTO && d.hogares >= PARAMETROS.principalMinHogares ? PARAMETROS.suelo.aniosPrincipal : PARAMETROS.suelo.aniosResto),
    esfuerzoRef: alquiler / (renta * PARAMETROS.rentaBuscadores / 12),
    renta,
    cuotaInm,
    cuotaEman: cuotaHogares,
    obraBase: obra,
    ritmoObra: obra,
    ritmoObraPublica: 0,
    ritmoObraConcesion: 0,
    concesion: 0,
    precioRef: precio,
    alquilerRef: alquiler,
    crecAlqRef: d.crecAlq,
    crecVentaRef: d.crecVenta,
    neutroAlq: 0,
    neutroVenta: 0,
    ratioAlq: 0,
    ratioVenta: 0,
    crecAlq: d.crecAlq,
    crecVenta: d.crecVenta,
    rentabilidad: rentabilidad(alquiler, precio),
    intencion: { familias: 0.6, pequenos: 0.6, grandes: 0.6, publico: 1 },
    flujos: flujosVacios()
  };
}
var inmigrantesDesde2018 = () => (PARAMETROS.saldoExterior2018a2024 + PARAMETROS.saldoExterior2024 / 52 * PARAMETROS.semanasSinDatoMigracion) / PARAMETROS.tamanoHogar;
function ejecutarReglas(e) {
  const f = crearResolver(e);
  for (const regla of REGLAS) regla.ejecutar(e, f);
}
function crearEstado(semilla = 1) {
  const totales = {
    hogares: CIUDADES.reduce((s, d) => s + d.hogares, 0),
    viviendas: CIUDADES.reduce((s, d) => s + d.viviendas, 0),
    inquilinos: CIUDADES.reduce((s, d) => s + inquilinosDe(d), 0),
    saldoExterior: CIUDADES.reduce((s, d) => s + d.saldoExterior, 0)
  };
  const presupuesto = FACTORES["presupuesto.mensual"].base;
  const e = {
    semana: 0,
    fecha: new Date(PARAMETROS.fechaInicio),
    smi: PARAMETROS.smiMensual,
    ciudades: CIUDADES.map((d) => crearCiudad(d, totales)),
    modificadores: [],
    vigentes: {},
    decretosPromulgados: [],
    decretoDisponible: true,
    confianza: 60,
    tension: 60,
    gastoAnual: 0,
    ingresosAnual: 0,
    nivelPrecios: 1,
    cartera: {
      saldo: presupuesto,
      presupuestoMensual: presupuesto,
      impreso: 0,
      impresoAnio: 0,
      deuda: 0
    },
    contadores: { inmigrantesDesde2018: inmigrantesDesde2018(), expulsados: 0, construidas: 0 },
    historial: [],
    fin: null,
    azar: semilla | 0,
    coyuntura: 0,
    costeObra: 1,
    precioMax: 0,
    eleccion: { semana: PARAMETROS.elecciones.cada, tensionAnterior: 60 },
    anulaciones: [],
    calibrando: true
  };
  const esperaTotal = e.ciudades.reduce((s, c) => s + c.espera, 0);
  for (const c of e.ciudades)
    c.ritmoObraPublica = PARAMETROS.terminadasProtegidas / 52 * c.espera / esperaTotal;
  const espera = e.ciudades.map((c) => c.espera);
  for (let i = 0; i < PARAMETROS.semanasCalentamiento; i++) ejecutarReglas(e);
  e.ciudades.forEach((c, i) => c.espera = espera[i]);
  e.contadores = { inmigrantesDesde2018: inmigrantesDesde2018(), expulsados: 0, construidas: 0 };
  e.calibrando = false;
  const f = crearResolver(e);
  const ind = indicadores(e, f("impuesto.compra"));
  e.precioMax = ind.precioMedio;
  e.tension = clamp(objetivoTension(e, f, ind), 0, 100);
  e.eleccion.tensionAnterior = e.tension;
  ejecutarReglas(e);
  e.contadores.expulsados = 0;
  e.contadores.construidas = 0;
  e.cartera.saldo = presupuesto;
  return e;
}
function avanzarSemana(e) {
  const mes = e.fecha.getMonth();
  e.semana++;
  e.fecha = new Date(e.fecha.getTime() + 7 * 864e5);
  if (e.fecha.getFullYear() !== new Date(e.fecha.getTime() - 7 * 864e5).getFullYear())
    e.cartera.impresoAnio = 0;
  if (e.fecha.getMonth() !== mes) {
    e.decretoDisponible = true;
    if (e.cartera.saldo < 0) e.cartera.deuda -= e.cartera.saldo;
    else e.cartera.deuda -= Math.min(e.cartera.deuda, e.cartera.saldo);
    e.cartera.presupuestoMensual = crearResolver(e)("presupuesto.mensual") * e.nivelPrecios;
    e.cartera.saldo = e.cartera.presupuestoMensual;
  }
  anular(e);
  ejecutarReglas(e);
  elecciones(e);
}
function anular(e) {
  const vencidas = e.anulaciones.filter((a) => a.semana <= e.semana);
  if (!vencidas.length) return;
  e.anulaciones = e.anulaciones.filter((a) => a.semana > e.semana);
  for (const a of vencidas) {
    const ultima = e.decretosPromulgados.filter((p) => p.id === a.id).pop();
    const d = DECRETO_POR_ID.get(a.id);
    if (!d || !ultima || ultima.valor === null || ultima.semana !== a.promulgada) continue;
    derogar(e, d, "anulada");
    e.modificadores.push({
      factor: "tension.extra",
      op: "suma",
      valor: 3,
      semanas: 52,
      hasta: e.semana + 52,
      origen: "tribunales",
      etiqueta: `Anulada por los tribunales: ${d.titulo}`
    });
  }
}
function elecciones(e) {
  if (e.semana < e.eleccion.semana) return;
  if (!e.fin && apoyo(e) < PARAMETROS.elecciones.umbral) {
    e.fin = "derrota";
    e.motivoFin = "elecciones";
  }
  e.eleccion = { semana: e.eleccion.semana + PARAMETROS.elecciones.cada, tensionAnterior: e.tension };
}
var vigente = (e, id) => id in e.vigentes ? e.vigentes[id] : null;
function impedimento(e, d, valor) {
  if (!e.decretoDisponible) return "Ya has decretado este mes";
  const actual = vigente(e, d.id);
  if (valor === null) return actual === null ? "No est\xE1 en vigor" : null;
  if (!valorValido(d, valor)) return "Valor fuera de rango";
  if (actual !== null && Math.abs(actual - valor) < 1e-9 && !d.repetible)
    return d.parametro ? "Ya en vigor con este valor" : "Ya en vigor";
  return null;
}
var LEYES_POR_DECRETO = 3;
function incompatible(d, elegidos) {
  if (elegidos.length >= LEYES_POR_DECRETO)
    return `Un decreto cambia como m\xE1ximo ${LEYES_POR_DECRETO} leyes`;
  if (elegidos.some((c) => c.id === d.id)) return "Ya est\xE1 en el decreto";
  const rival = d.grupo && elegidos.filter((c) => c.valor !== null).map((c) => DECRETO_POR_ID.get(c.id)).find((o) => o && o.id !== d.id && o.grupo === d.grupo);
  return rival ? `Incompatible con \xAB${rival.titulo}\xBB en el mismo decreto` : null;
}
function promulgar(e, cambios) {
  if (!cambios.length) return false;
  const elegidos = [];
  for (const c of cambios) {
    const d = DECRETO_POR_ID.get(c.id);
    if (!d || impedimento(e, d, c.valor) || c.valor !== null && incompatible(d, elegidos))
      return false;
    if (c.valor === null && elegidos.length >= LEYES_POR_DECRETO) return false;
    elegidos.push(c);
  }
  for (const c of elegidos) {
    const d = DECRETO_POR_ID.get(c.id);
    if (c.valor === null) derogar(e, d);
    else aplicar(e, d, c.valor);
  }
  e.decretoDisponible = false;
  return true;
}
function aplicar(e, d, v) {
  if (d.grupo) {
    for (const otro of DECRETOS) {
      if (otro.grupo === d.grupo && otro.id !== d.id && vigente(e, otro.id) !== null)
        derogar(e, otro);
    }
  }
  const anterior = vigente(e, d.id);
  e.modificadores = e.modificadores.filter((m) => m.origen !== d.id);
  for (const ef of d.efectos(v, e)) {
    e.modificadores.push({
      ...ef,
      origen: d.id,
      etiqueta: d.titulo,
      desde: e.semana,
      hasta: ef.semanas ? e.semana + ef.semanas : void 0
    });
  }
  e.vigentes[d.id] = v;
  const acumulativos = d.acumulativos?.(v, e) ?? [];
  d.alAplicar?.(e, v, anterior);
  if (d.riesgoLegal && azar(e) < d.riesgoLegal) {
    e.anulaciones.push({
      id: d.id,
      semana: e.semana + PARAMETROS.semanasAnulacion.min + Math.floor(azar(e) * PARAMETROS.semanasAnulacion.margen),
      promulgada: e.semana
    });
  }
  for (const ef of acumulativos) {
    const semanas = ef.semanas ?? 104;
    e.modificadores.push({
      ...ef,
      semanas,
      origen: `${d.id}+${e.semana}`,
      etiqueta: d.titulo,
      desde: e.semana,
      hasta: e.semana + semanas
    });
  }
  e.decretosPromulgados.push({ id: d.id, semana: e.semana, valor: v });
}
function derogar(e, d, motivo) {
  const anterior = vigente(e, d.id);
  e.modificadores = e.modificadores.filter((m) => m.origen !== d.id);
  delete e.vigentes[d.id];
  if (anterior !== null) d.alDerogar?.(e, anterior);
  e.decretosPromulgados.push({ id: d.id, semana: e.semana, valor: null, motivo });
}
var ORIGEN_IMPRESION = "imprimir";
function imprimir(e, cantidad = PARAMETROS.tramoImpresion * e.nivelPrecios) {
  if (cantidad <= 0) return;
  e.cartera.saldo += cantidad;
  e.cartera.impreso += cantidad / e.nivelPrecios;
  e.cartera.impresoAnio += cantidad / e.nivelPrecios;
  const hasta = e.semana + PARAMETROS.semanasInflacionImpresa;
  const miles = cantidad / e.nivelPrecios / 1e3;
  e.modificadores.push(
    {
      factor: "inflacion.general",
      op: "suma",
      valor: PARAMETROS.inflacionPorMilMillones * miles,
      semanas: PARAMETROS.semanasInflacionImpresa,
      hasta,
      origen: ORIGEN_IMPRESION,
      etiqueta: "Dinero impreso"
    },
    {
      factor: "confianza.objetivo",
      op: "suma",
      valor: -0.5 * miles,
      semanas: PARAMETROS.semanasInflacionImpresa,
      hasta,
      origen: ORIGEN_IMPRESION,
      etiqueta: "Dinero impreso"
    }
  );
}

// src/app/sim/datos/estrategias.ts
var IMPRIMIR = "imprimir";
var ESTRATEGIAS = [
  {
    id: "equilibrada",
    nombre: "Equilibrada",
    descripcion: "Mucha oferta, p\xFAblica y privada, sin hundir el precio de golpe: licencias, suelo (dos veces), vivienda p\xFAblica, aval para la entrada y tres subidas del salario m\xEDnimo. Llega bien a cada elecci\xF3n.",
    pasos: [
      ["desburocratizar", 3],
      ["presupuesto-extra", 800],
      ["suelo-publico-concesion", 800],
      ["liberalizar-suelo", 40],
      ["plan-vivienda-publica", 600],
      ["formar-obreros", 8e4],
      ["industrializar", 800],
      ["limitar-turisticos", 80],
      ["recargo-vacias", 150],
      "seguro-impago",
      ["avales-hipoteca", 20],
      ["subir-smi", 8],
      ["bonificar-arrendador", 90],
      "socimi",
      ["densificar", 30],
      ["repoblar", 15],
      ["subir-smi", 8],
      ["impuesto-extranjeros", 50],
      ["subir-smi", 8],
      ["liberalizar-suelo", 40]
    ]
  },
  {
    id: "choque",
    nombre: "Choque de oferta",
    descripcion: "Todo al m\xE1ximo desde el primer mes. Es la m\xE1s r\xE1pida, pero el precio de la vivienda cae tan deprisa que los propietarios se revuelven, la confianza se hunde y la primera elecci\xF3n se gana por poco.",
    pasos: [
      ["desburocratizar", 3],
      ["presupuesto-extra", 1e3],
      ["liberalizar-suelo", 50],
      ["plan-vivienda-publica", 800],
      ["densificar", 50],
      ["suelo-publico-concesion", 1e3],
      ["industrializar", 1e3],
      ["formar-obreros", 1e5],
      ["limitar-turisticos", 100],
      ["recargo-vacias", 150],
      ["oficinas-vivienda", 50],
      ["subir-smi", 10],
      "seguro-impago",
      ["bonificar-arrendador", 100],
      "socimi",
      ["repoblar", 20],
      ["subir-smi", 10],
      ["subir-smi", 10],
      ["contratos-largos", 10]
    ]
  },
  {
    id: "gradual",
    nombre: "Gradual",
    descripcion: "La versi\xF3n prudente: menos gasto, menos obra y precios que bajan despacio. No pierde elecciones, pero tarda m\xE1s de veinte a\xF1os y con mala coyuntura puede no llegar.",
    pasos: [
      ["desburocratizar", 3],
      ["presupuesto-extra", 600],
      ["suelo-publico-concesion", 600],
      ["liberalizar-suelo", 30],
      ["plan-vivienda-publica", 400],
      ["formar-obreros", 6e4],
      ["avales-hipoteca", 20],
      ["limitar-turisticos", 50],
      ["recargo-vacias", 100],
      "seguro-impago",
      ["bonificar-arrendador", 80],
      ["subir-smi", 5],
      ["industrializar", 600],
      "socimi",
      ["repoblar", 10],
      ["subir-smi", 5]
    ]
  },
  {
    id: "demanda",
    nombre: "Ayudas a la demanda",
    descripcion: "Dar m\xE1s dinero a quien busca casa sin construir m\xE1s: avales, bono de alquiler, rebaja del IRPF, desgravaci\xF3n, menos impuestos al comprar e hipotecas largas. Todos pueden pagar m\xE1s y los precios lo recogen.",
    pasos: [
      ["avales-hipoteca", 30],
      ["bono-alquiler", 250],
      ["rebaja-irpf", 2],
      ["deduccion-compra", 15],
      ["bajar-itp", 3],
      ["hipotecas-largas", 40],
      ["cuota-autonomos", 100],
      ["subir-smi", 5]
    ]
  },
  {
    id: "control",
    nombre: "Control e inspecci\xF3n",
    descripcion: "Topes en las zonas tensionadas con inspecci\xF3n para que se cumplan, protecci\xF3n del inquilino y vivienda p\xFAblica pagada con impuestos a grandes propietarios. Sin deuda, pero la confianza cae y se construye menos.",
    pasos: [
      ["zonas-tensionadas", 2],
      "inspeccion-alquiler",
      ["presupuesto-extra", 600],
      ["plan-vivienda-publica", 600],
      ["indemnizacion", 6],
      ["recargo-vacias", 100],
      ["limitar-turisticos", 50],
      ["compra-publica", 100],
      ["impuesto-grandes", 1],
      ["contratos-largos", 7],
      "temporada",
      ["subir-smi", 5]
    ]
  },
  {
    id: "liberal",
    nombre: "Liberal",
    descripcion: "Mercado y rebajas fiscales: suelo, licencias, menos impuestos a familias y aut\xF3nomos, y m\xE1s seguridad para el casero. No sube el presupuesto, as\xED que las rebajas se pagan con deuda.",
    pasos: [
      ["desburocratizar", 3],
      ["liberalizar-suelo", 50],
      "iva-obra-nueva",
      ["densificar", 50],
      ["bonificar-arrendador", 100],
      ["formar-obreros", 6e4],
      ["facilitar-inmigracion", 15],
      ["cuota-autonomos", 100],
      "desahucio-expres",
      ["oficinas-vivienda", 50],
      "seguro-impago",
      ["rebaja-irpf", 1],
      ["liberalizar-suelo", 50]
    ]
  },
  {
    id: "intervencionista",
    nombre: "Intervencionista",
    descripcion: "Alquileres congelados e inspeccionados, desahucios suspendidos, vivienda p\xFAblica a gran escala y mano dura con fondos y pisos vac\xEDos. Varias de sus leyes pueden caer en los tribunales.",
    pasos: [
      ["tope-alquiler", 0],
      "inspeccion-alquiler",
      ["prohibir-desahucios", 50],
      ["plan-vivienda-publica", 1500],
      "vetar-fondos",
      ["recargo-vacias", 50],
      ["expropiar-vacias", 50],
      ["compra-publica", 250],
      ["subir-smi", 5],
      ["impuesto-grandes", 1],
      ["indemnizacion", 12],
      "tope-venta",
      "alquiler-social-grandes"
    ]
  }
];
var ESTRATEGIA_POR_ID = new Map(ESTRATEGIAS.map((x) => [x.id, x]));
function cambioDe(paso) {
  if (paso === IMPRIMIR) return null;
  if (typeof paso !== "string") return { id: paso[0], valor: paso[1] };
  return { id: paso, valor: valorPorDefecto(DECRETO_POR_ID.get(paso)) };
}

// scripts/simular.ts
var PLANES = {
  "sin decretos": [],
  ...Object.fromEntries(ESTRATEGIAS.map((x) => [x.nombre.toLowerCase(), x.pasos]))
};
var anios = Number(process.argv[2]) || 20;
var pct2 = (v) => (v * 100).toFixed(1) + "%";
var n = (v) => Math.round(v).toLocaleString("es-ES");
var medir = (e) => {
  const f = crearResolver(e);
  return { f, i: indicadores(e, f("impuesto.compra"), ayudaAlquiler(e, f)) };
};
var parque2 = (e) => e.ciudades.reduce((s, c) => s + viviendas(c), 0);
function jugar(plan, semanas, cada, semilla = 1) {
  const e = crearEstado(semilla);
  const cola = [...plan];
  const inicial = parque2(e);
  const r = {
    fin: null,
    motivoFin: void 0,
    semanaFin: 0,
    descuadre: 0,
    ipcMax: 0,
    finito: true,
    noPromulgadas: []
  };
  for (let s = 0; s <= semanas; s++) {
    if (e.decretoDisponible && cola.length) {
      const cambio = cambioDe(cola.shift());
      if (!cambio) {
        imprimir(e);
        e.decretoDisponible = false;
      } else if (!promulgar(e, [cambio])) r.noPromulgadas.push(cambio.id);
    }
    cada?.(e, s);
    if (e.fin && !r.fin) {
      r.fin = e.fin;
      r.motivoFin = e.motivoFin;
      r.semanaFin = e.semana;
    }
    const { f, i } = medir(e);
    r.ipcMax = Math.max(r.ipcMax, f("inflacion.general"));
    r.finito &&= [i.alojadas, i.aniosCompra, i.esfuerzoSmi, e.nivelPrecios, e.cartera.deuda].every(
      Number.isFinite
    );
    avanzarSemana(e);
  }
  r.descuadre = parque2(e) - inicial - e.contadores.construidas;
  return r;
}
var resultados = {};
for (const [nombre, plan] of Object.entries(PLANES)) {
  console.log(`
=== ${nombre} ===`);
  console.log(
    "a\xF1o  alojadas  a\xF1osCompra  alq/SMI  alqMercado  alqPagado    precio   espera  obra/sem llegan logran expuls  tens conf   IPC   gasto ingres   deuda  presi\xF3n(Mad/Bcn/M\xE1l/resto)"
  );
  let anunciado = false;
  const r = jugar(plan, 52 * anios, (e, s) => {
    const fin = !!e.fin && !anunciado;
    if (s % 104 === 0 || fin) {
      const { f, i } = medir(e);
      const real = (v) => n(v / e.nivelPrecios);
      const ayuda = ayudaAlquiler(e, f);
      const ciudad = (id) => Math.round(
        presion(
          e.ciudades.find((c) => c.id === id),
          ayuda
        ) * 100
      );
      console.log(
        [
          (s / 52).toFixed(0).padStart(3),
          pct2(i.alojadas).padStart(8),
          i.aniosCompra.toFixed(2).padStart(10),
          pct2(i.esfuerzoSmi).padStart(8),
          real(i.alquilerMercado).padStart(10),
          real(i.alquilerPagado).padStart(10),
          real(i.precioMedio).padStart(9),
          n(i.espera).padStart(9),
          n(i.flujos.construidas).padStart(8),
          n(i.flujos.inmigrantes + i.flujos.emancipados).padStart(6),
          n(i.flujos.logran).padStart(6),
          n(i.flujos.desahucios + i.flujos.noRenovados).padStart(6),
          e.tension.toFixed(0).padStart(5),
          e.confianza.toFixed(0).padStart(4),
          pct2(f("inflacion.general")).padStart(6),
          real(e.gastoAnual).padStart(7),
          real(e.ingresosAnual).padStart(6),
          real(e.cartera.deuda).padStart(7),
          `  ${ciudad("madrid")}/${ciudad("barcelona")}/${ciudad("malaga")}/${ciudad("resto")}`
        ].join(" ")
      );
    }
    if (fin) {
      anunciado = true;
      console.log(
        `  \u2192 ${e.fin.toUpperCase()} en la semana ${e.semana} (${e.fecha.getFullYear()})`
      );
    }
  });
  for (const id of r.noPromulgadas) console.log("  (no se pudo promulgar " + id + ")");
  resultados[nombre] = r;
}
console.log("\n=== comprobaciones ===");
var fallos = [];
function comprobar(ok, texto, detalle = "") {
  console.log(`  ${ok ? "\u2713" : "\u2717"} ${texto}${detalle ? " \u2014 " + detalle : ""}`);
  if (!ok) fallos.push(texto);
}
var inicio = crearEstado();
comprobar(
  inicio.tension >= 50 && inicio.tension <= 70,
  "La partida arranca con tensi\xF3n entre 50 y 70",
  inicio.tension.toFixed(0)
);
var SEMILLAS = 16;
var ANIOS_AZAR = 28;
console.log(`
=== con ${SEMILLAS} semillas de azar, a ${ANIOS_AZAR} a\xF1os ===`);
var victorias = {};
for (const [nombre, plan] of Object.entries(PLANES)) {
  const rs = Array.from(
    { length: SEMILLAS },
    (_, k) => jugar(plan, 52 * ANIOS_AZAR, void 0, k + 1)
  );
  const cuenta = (ok) => rs.filter(ok).length;
  const ganadas = rs.filter((r) => r.fin === "victoria").map((r) => r.semanaFin / 52);
  victorias[nombre] = ganadas.length;
  console.log(
    `  ${nombre.padEnd(22)} ${String(ganadas.length).padStart(2)} victorias` + (ganadas.length ? ` (a\xF1os ${Math.min(...ganadas).toFixed(0)}-${Math.max(...ganadas).toFixed(0)})` : "") + ` \xB7 ${cuenta((r) => r.motivoFin === "elecciones")} elecciones perdidas \xB7 ${cuenta((r) => r.motivoFin === "tension")} estallidos \xB7 ${cuenta((r) => !r.fin)} sin final`
  );
}
console.log("");
comprobar(victorias["sin decretos"] === 0, "Sin decretos no se gana con ninguna semilla");
comprobar(
  victorias["equilibrada"] >= SEMILLAS * 0.75,
  "Se puede ganar: \xABequilibrada\xBB lo logra con al menos tres de cada cuatro semillas",
  `${victorias["equilibrada"]} de ${SEMILLAS}`
);
var lista = Object.entries(resultados);
var peor = (clave) => lista.reduce((a, b) => Math.abs(b[1][clave]) > Math.abs(a[1][clave]) ? b : a);
var [nombreDescuadre, { descuadre }] = peor("descuadre");
comprobar(
  Math.abs(descuadre) < 1,
  "La contabilidad cuadra: el parque crece lo que se construye",
  `mayor descuadre ${descuadre.toFixed(3)} viviendas (${nombreDescuadre})`
);
comprobar(
  lista.every(([, r]) => r.finito),
  "Ning\xFAn indicador deja de ser un n\xFAmero en las estrategias"
);
var [nombreIpc, { ipcMax }] = peor("ipcMax");
comprobar(
  ipcMax < 0.25,
  "La inflaci\xF3n no se dispara en las estrategias",
  `m\xE1ximo ${pct2(ipcMax)} (${nombreIpc})`
);
var ANIOS_SOLA = 15;
var ganan = [];
var rotas = [];
var ipcSola = { valor: 0, ley: "" };
for (const d of DECRETOS) {
  const valores = d.parametro ? [.../* @__PURE__ */ new Set([d.parametro.min, d.parametro.defecto, d.parametro.max])] : [1];
  for (const v of valores) {
    const plan = Array(d.repetible ? 12 : 1).fill([d.id, v]);
    const r = jugar(plan, 52 * ANIOS_SOLA);
    const ley = `${d.id}=${v}`;
    if (r.fin === "victoria") ganan.push(ley);
    if (!r.finito || Math.abs(r.descuadre) >= 1 || r.noPromulgadas.length) rotas.push(ley);
    if (r.ipcMax > ipcSola.valor) ipcSola = { valor: r.ipcMax, ley };
  }
}
comprobar(!ganan.length, `Ninguna ley gana sola en ${ANIOS_SOLA} a\xF1os`, ganan.join(", "));
comprobar(
  !rotas.length,
  "Ninguna ley sola descuadra la contabilidad ni rompe un indicador",
  rotas.join(", ")
);
comprobar(
  ipcSola.valor < 0.5,
  "Ninguna ley sola lleva la inflaci\xF3n al 50 %",
  `m\xE1ximo ${pct2(ipcSola.valor)} (${ipcSola.ley})`
);
if (fallos.length) {
  console.log(`
${fallos.length} comprobaci\xF3n(es) fallida(s).`);
  process.exitCode = 1;
}
