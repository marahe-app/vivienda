import type { FuenteId } from './fuentes';

/**
 * SITUACIÓN DE PARTIDA POR PROVINCIA
 * Cada columna es una cifra publicada, sin retocar; su fuente está en FUENTE_CIUDAD.
 * Las transformaciones (€/m² → € por vivienda, actualización de rentas, etc.) se hacen
 * en motor.ts con los coeficientes de parametros.ts, cada uno con su propia fuente.
 */
export interface DatosCiudad {
  id: string;
  nombre: string;
  lon: number;
  lat: number;
  /** Hogares a 1 de julio de 2026. */
  hogares: number;
  /** Viviendas totales, 2025. */
  viviendas: number;
  /** Viviendas principales en alquiler sobre el total de principales, Censo 2021. */
  pctAlquiler: number;
  /** Precio de oferta de venta (€/m²), septiembre 2026. */
  precioM2: number;
  /** Precio de oferta de alquiler (€/m² al mes), septiembre 2026. */
  alquilerM2: number;
  /** Renta neta media por hogar (€/año), 2023. */
  renta: number;
  /** Saldo migratorio con el exterior (personas), 2024. */
  saldoExterior: number;
  /** Viviendas libres terminadas, 2025. */
  terminadasLibres: number;
  /** Variación anual del precio de alquiler y de venta, septiembre 2026. */
  crecAlq: number;
  crecVenta: number;
}

export const FUENTE_CIUDAD = {
  hogares: 'hogaresProvincia',
  viviendas: 'parque',
  pctAlquiler: 'tenencia',
  precioM2: 'precioVenta',
  alquilerM2: 'precioAlquiler',
  renta: 'rentaProvincia',
  saldoExterior: 'inmigracionProvincia',
  terminadasLibres: 'terminadas',
  crecAlq: 'precioAlquiler',
  crecVenta: 'precioVenta',
} as const satisfies Partial<Record<keyof DatosCiudad, FuenteId>>;

export const RESTO = 'resto';

/** Nombre de cada ciudad por su id, para describir efectos con ámbito. */
export const NOMBRE_CIUDAD: Record<string, string> = {};

// «Resto de España» es el total nacional menos las 16 provincias (hogares, viviendas, alquiler,
// renta, migración y obra). Sus precios y variaciones son la mediana de las otras 36 provincias
// de los mismos informes. En el mapa tiñe el fondo del país.
export const CIUDADES: DatosCiudad[] = [
  {
    id: 'madrid',
    nombre: 'Madrid',
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
    crecVenta: 0.069,
  },
  {
    id: 'barcelona',
    nombre: 'Barcelona',
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
    crecVenta: 0.115,
  },
  {
    id: 'valencia',
    nombre: 'Valencia',
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
    crecVenta: 0.151,
  },
  {
    id: 'sevilla',
    nombre: 'Sevilla',
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
    crecVenta: 0.147,
  },
  {
    id: 'malaga',
    nombre: 'Málaga',
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
    crecVenta: 0.066,
  },
  {
    id: 'alicante',
    nombre: 'Alicante',
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
    crecVenta: 0.078,
  },
  {
    id: 'baleares',
    nombre: 'Palma',
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
    crecVenta: 0.041,
  },
  {
    id: 'laspalmas',
    nombre: 'Las Palmas',
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
    crecVenta: 0.104,
  },
  {
    id: 'tenerife',
    nombre: 'Sta. Cruz de Tenerife',
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
    crecVenta: 0.037,
  },
  {
    id: 'zaragoza',
    nombre: 'Zaragoza',
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
    crecVenta: 0.144,
  },
  {
    id: 'bizkaia',
    nombre: 'Bilbao',
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
    crecVenta: 0.096,
  },
  {
    id: 'murcia',
    nombre: 'Murcia',
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
    crecVenta: 0.139,
  },
  {
    id: 'coruna',
    nombre: 'A Coruña',
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
    crecVenta: 0.133,
  },
  {
    id: 'valladolid',
    nombre: 'Valladolid',
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
    crecVenta: 0.13,
  },
  {
    id: 'granada',
    nombre: 'Granada',
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
    crecVenta: 0.13,
  },
  {
    id: 'asturias',
    nombre: 'Oviedo-Gijón',
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
    crecVenta: 0.126,
  },
  {
    id: RESTO,
    nombre: 'Resto de España',
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
    crecVenta: 0.103,
  },
];

for (const c of CIUDADES) NOMBRE_CIUDAD[c.id] = c.nombre;

/** Provincias costeras e insulares donde más compran los no residentes. */
export const COSTA = [
  'malaga',
  'alicante',
  'baleares',
  'laspalmas',
  'tenerife',
  'barcelona',
  'valencia',
  'murcia',
  'madrid',
];
