import { CIUDADES, RESTO, type DatosCiudad } from '../datos/ciudades';
import { DECRETOS, DECRETO_POR_ID, valorValido } from '../datos/decretos';
import { FACTORES } from '../datos/factores';
import { PARAMETROS as P } from '../datos/parametros';
import type { Cambio, Ciudad, Decreto, Estado, Parque } from '../tipos';
import { clamp, flujosVacios, indicadores, rentabilidad } from './indicadores';
import { crearResolver } from './modificadores';
import { REGLAS } from './reglas';
import { objetivoTension } from './reglas/clima';

const parque = (p: Partial<Parque> = {}): Parque => ({
  propia: 0,
  alquilada: 0,
  ofAlquiler: 0,
  ofVenta: 0,
  vacia: 0,
  ...p,
});

/** Totales nacionales con los que se reparten las cifras que solo existen a escala de país. */
interface Totales {
  hogares: number;
  viviendas: number;
  inquilinos: number;
  saldoExterior: number;
}

/** Hogares en alquiler: el reparto provincial del Censo 2021, llevado al nivel nacional de la ECV 2025. */
const inquilinosDe = (d: DatosCiudad) =>
  d.hogares * d.pctAlquiler * (P.pctAlquilerEcv2025 / P.pctAlquilerCenso2021);

function crearCiudad(d: DatosCiudad, t: Totales): Ciudad {
  const hogares = d.hogares;
  const inquilinos = inquilinosDe(d);
  const publico = inquilinos * (P.viviendaPublicaAlquiler / t.inquilinos);
  const privado = inquilinos - publico;
  // Titularidad del alquiler privado (dato nacional); se asume igual para lo anunciado y lo vacío.
  const cuota = {
    grandes: P.alquilerEmpresas,
    pequenos: P.alquilerGrandesParticulares,
    familias: 1 - P.alquilerEmpresas - P.alquilerGrandesParticulares,
  };
  const ofAlquiler = privado * P.ofertaAlquilerInicial;
  const ofVenta = d.viviendas * (P.ofertaVenta / t.viviendas);
  const vacia = d.viviendas - hogares - ofAlquiler - ofVenta;
  const cuotaInm = d.saldoExterior / t.saldoExterior;
  const cuotaHogares = hogares / t.hogares;
  const precio = d.precioM2 * P.superficieVenta;
  const alquiler = d.alquilerM2 * P.superficieAlquiler;
  const obra = d.terminadasLibres / 52;
  return {
    id: d.id,
    nombre: d.nombre,
    lon: d.lon,
    lat: d.lat,
    principal: d.id !== RESTO && d.hogares >= P.principalMinHogares,
    // El déficit oficial se reparte entre llegadas y tamaño; la demanda joven latente, por tamaño.
    espera: (P.deficitViviendas * (cuotaInm + cuotaHogares)) / 2 + P.jovenesLatentes * cuotaHogares,
    parque: {
      familias: parque({
        propia: hogares - inquilinos,
        alquilada: privado * cuota.familias,
        ofAlquiler: ofAlquiler * cuota.familias,
        ofVenta: ofVenta * cuota.familias,
        vacia: vacia * cuota.familias,
      }),
      pequenos: parque({
        alquilada: privado * cuota.pequenos,
        ofAlquiler: ofAlquiler * cuota.pequenos,
        ofVenta: ofVenta * cuota.pequenos,
        vacia: vacia * cuota.pequenos,
      }),
      grandes: parque({
        alquilada: privado * cuota.grandes,
        ofAlquiler: ofAlquiler * cuota.grandes,
        ofVenta: ofVenta * cuota.grandes,
        vacia: vacia * cuota.grandes,
      }),
      publico: parque({ alquilada: publico }),
    },
    precio,
    alquiler,
    renta: d.renta * (P.rentaHogarEcv2025 / P.rentaHogarAtlas2023),
    cuotaInm,
    cuotaEman: cuotaHogares,
    obraBase: obra,
    ritmoObra: obra,
    ritmoObraPublica: 0,
    ritmoObraConcesion: 0,
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
    flujos: flujosVacios(),
  };
}

/** Familias inmigrantes desde 2018: acumulado publicado hasta 2024 y, desde entonces, al ritmo de 2024. */
const inmigrantesDesde2018 = () =>
  (P.saldoExterior2018a2024 + (P.saldoExterior2024 / 52) * P.semanasSinDatoMigracion) /
  P.tamanoHogar;

function ejecutarReglas(e: Estado) {
  const f = crearResolver(e);
  for (const regla of REGLAS) regla.ejecutar(e, f);
}

export function crearEstado(): Estado {
  const totales: Totales = {
    hogares: CIUDADES.reduce((s, d) => s + d.hogares, 0),
    viviendas: CIUDADES.reduce((s, d) => s + d.viviendas, 0),
    inquilinos: CIUDADES.reduce((s, d) => s + inquilinosDe(d), 0),
    saldoExterior: CIUDADES.reduce((s, d) => s + d.saldoExterior, 0),
  };
  const presupuesto = FACTORES['presupuesto.mensual'].base;
  const e: Estado = {
    semana: 0,
    fecha: new Date(P.fechaInicio),
    smi: P.smiMensual,
    ciudades: CIUDADES.map((d) => crearCiudad(d, totales)),
    modificadores: [],
    vigentes: {},
    decretosPromulgados: [],
    decretoDisponible: true,
    confianza: 60,
    tension: 60,
    gastoAnual: 0,
    nivelPrecios: 1,
    cartera: { saldo: presupuesto, presupuestoMensual: presupuesto, impreso: 0, impresoAnio: 0 },
    contadores: { inmigrantesDesde2018: inmigrantesDesde2018(), expulsados: 0, construidas: 0 },
    historial: [],
    fin: null,
    calibrando: true,
  };

  // Calentamiento: con precios quietos, la oferta anunciada y la obra en curso se asientan
  // en su régimen. Después se restituyen las cifras de partida que no deben moverse.
  // La vivienda protegida que hoy se termina cada semana, repartida según las familias en espera.
  const esperaTotal = e.ciudades.reduce((s, c) => s + c.espera, 0);
  for (const c of e.ciudades)
    c.ritmoObraPublica = ((P.terminadasProtegidas / 52) * c.espera) / esperaTotal;

  const espera = e.ciudades.map((c) => c.espera);
  for (let i = 0; i < P.semanasCalentamiento; i++) ejecutarReglas(e);
  e.ciudades.forEach((c, i) => (c.espera = espera[i]));
  e.contadores = { inmigrantesDesde2018: inmigrantesDesde2018(), expulsados: 0, construidas: 0 };
  e.calibrando = false;
  // La tensión arranca donde la sitúa la situación real, sin arrastre.
  const f = crearResolver(e);
  e.tension = clamp(objetivoTension(e, f, indicadores(e, f('impuesto.compra'))), 0, 100);
  ejecutarReglas(e);
  e.contadores.expulsados = 0;
  e.contadores.construidas = 0;
  e.cartera.saldo = presupuesto;
  return e;
}

export function avanzarSemana(e: Estado) {
  const mes = e.fecha.getMonth();
  e.semana++;
  e.fecha = new Date(e.fecha.getTime() + 7 * 86_400_000);
  if (e.fecha.getFullYear() !== new Date(e.fecha.getTime() - 7 * 86_400_000).getFullYear())
    e.cartera.impresoAnio = 0;
  if (e.fecha.getMonth() !== mes) {
    e.decretoDisponible = true;
    // Cierre de mes: lo que falte se imprime (con su inflación) y la cartera vuelve a su presupuesto.
    if (e.cartera.saldo < 0) imprimir(e, -e.cartera.saldo);
    // El presupuesto se actualiza con los precios: en términos reales no se encoge solo.
    e.cartera.presupuestoMensual = crearResolver(e)('presupuesto.mensual') * e.nivelPrecios;
    e.cartera.saldo = e.cartera.presupuestoMensual;
  }
  ejecutarReglas(e);
}

/** Valor en vigor de una ley, o null si no está en vigor. */
export const vigente = (e: Estado, id: string): number | null =>
  id in e.vigentes ? e.vigentes[id] : null;

/** Devuelve por qué no puede aplicarse un cambio, o null si se puede. */
export function impedimento(e: Estado, d: Decreto, valor: number | null): string | null {
  if (!e.decretoDisponible) return 'Ya has decretado este mes';
  const actual = vigente(e, d.id);
  if (valor === null) return actual === null ? 'No está en vigor' : null;
  if (!valorValido(d, valor)) return 'Valor fuera de rango';
  if (actual !== null && Math.abs(actual - valor) < 1e-9 && !d.repetible)
    return d.parametro ? 'Ya en vigor con este valor' : 'Ya en vigor';
  return null;
}

/** Leyes que puede modificar un mismo decreto. */
export const LEYES_POR_DECRETO = 3;

/** Devuelve por qué un cambio no puede acompañar a los ya elegidos para el decreto, o null si puede. */
export function incompatible(d: Decreto, elegidos: Cambio[]): string | null {
  if (elegidos.length >= LEYES_POR_DECRETO)
    return `Un decreto cambia como máximo ${LEYES_POR_DECRETO} leyes`;
  if (elegidos.some((c) => c.id === d.id)) return 'Ya está en el decreto';
  const rival =
    d.grupo &&
    elegidos
      .filter((c) => c.valor !== null)
      .map((c) => DECRETO_POR_ID.get(c.id))
      .find((o) => o && o.id !== d.id && o.grupo === d.grupo);
  return rival ? `Incompatible con «${rival.titulo}» en el mismo decreto` : null;
}

/** Promulga un decreto con hasta LEYES_POR_DECRETO cambios. O entran todos o ninguno. */
export function promulgar(e: Estado, cambios: Cambio[]): boolean {
  if (!cambios.length) return false;
  const elegidos: Cambio[] = [];
  for (const c of cambios) {
    const d = DECRETO_POR_ID.get(c.id);
    if (!d || impedimento(e, d, c.valor) || (c.valor !== null && incompatible(d, elegidos)))
      return false;
    if (c.valor === null && elegidos.length >= LEYES_POR_DECRETO) return false;
    elegidos.push(c);
  }
  for (const c of elegidos) {
    const d = DECRETO_POR_ID.get(c.id)!;
    if (c.valor === null) derogar(e, d);
    else aplicar(e, d, c.valor);
  }
  e.decretoDisponible = false;
  return true;
}

function aplicar(e: Estado, d: Decreto, v: number) {
  if (d.grupo) {
    for (const otro of DECRETOS) {
      if (otro.grupo === d.grupo && otro.id !== d.id && vigente(e, otro.id) !== null)
        derogar(e, otro);
    }
  }
  // Si ya estaba en vigor con otro valor, sus efectos se sustituyen por los nuevos.
  e.modificadores = e.modificadores.filter((m) => m.origen !== d.id);
  for (const ef of d.efectos(v, e)) {
    e.modificadores.push({
      ...ef,
      origen: d.id,
      etiqueta: d.titulo,
      hasta: ef.semanas ? e.semana + ef.semanas : undefined,
    });
  }
  e.vigentes[d.id] = v;
  d.alAplicar?.(e, v);
  e.decretosPromulgados.push({ id: d.id, semana: e.semana, valor: v });
}

function derogar(e: Estado, d: Decreto) {
  e.modificadores = e.modificadores.filter((m) => m.origen !== d.id);
  delete e.vigentes[d.id];
  e.decretosPromulgados.push({ id: d.id, semana: e.semana, valor: null });
}

export const ORIGEN_IMPRESION = 'imprimir';

/** Crea dinero para la cartera. Sube la inflación durante dos años y resta confianza. */
export function imprimir(e: Estado, cantidad = P.tramoImpresion) {
  if (cantidad <= 0) return;
  e.cartera.saldo += cantidad;
  e.cartera.impreso += cantidad;
  e.cartera.impresoAnio += cantidad;
  const hasta = e.semana + P.semanasInflacionImpresa;
  const miles = cantidad / 1000;
  e.modificadores.push(
    {
      factor: 'inflacion.general',
      op: 'suma',
      valor: P.inflacionPorMilMillones * miles,
      semanas: P.semanasInflacionImpresa,
      hasta,
      origen: ORIGEN_IMPRESION,
      etiqueta: 'Dinero impreso',
    },
    {
      factor: 'confianza.objetivo',
      op: 'suma',
      valor: -0.5 * miles,
      semanas: P.semanasInflacionImpresa,
      hasta,
      origen: ORIGEN_IMPRESION,
      etiqueta: 'Dinero impreso',
    },
  );
}
