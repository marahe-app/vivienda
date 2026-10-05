import type { Contexto, Decreto, Efecto, Estado, Propietario } from '../tipos';
import type { FactorId } from './factores';
import { COSTA, RESTO } from './ciudades';
import { PARAMETROS as P } from './parametros';
import { hogares, presion, sueloAlquilerDe, viviendas } from '../motor/indicadores';

/**
 * CATÁLOGO DE LEYES
 * Una ley es una lista de efectos (bonificadores y penalizadores) sobre factores, que depende del
 * valor `v` que elige el jugador (el parámetro de la ley, o 1 si no tiene). Para añadir una basta
 * con declarar aquí su entrada; el motor y la interfaz la recogen solos.
 *
 *   suma(factor, x)  → añade x al valor base        mult(factor, x) → multiplica por (1 + x)
 *   tope(factor, x)  → el factor no puede pasar de x
 * El tercer argumento limita el efecto a un propietario y/o una ciudad, o le pone duración.
 * `coste(v, ctx)` devuelve M€ al año (negativo = recauda). La vivienda pública se costea aparte,
 * por lo que realmente se construye y compra cada semana.
 */
type Extra = Pick<Efecto, 'propietario' | 'ciudad' | 'semanas'>;
const suma = (factor: FactorId, valor: number, extra: Extra = {}): Efecto => ({
  factor,
  op: 'suma',
  valor,
  ...extra,
});
const mult = (factor: FactorId, valor: number, extra: Extra = {}): Efecto => ({
  factor,
  op: 'mult',
  valor,
  ...extra,
});
const tope = (factor: FactorId, valor: number, extra: Extra = {}): Efecto => ({
  factor,
  op: 'tope',
  valor,
  ...extra,
});

/** El alivio (o enfado) político de una ley se disipa: lo que queda es su efecto real. */
const DOS_ANIOS: Extra = { semanas: 104 };

const PRIVADOS: Propietario[] = ['familias', 'pequenos', 'grandes'];
const principales = (e: Estado) => e.ciudades.filter((c) => c.principal);
/** Ciudades que hoy cumplirían los criterios de zona tensionada: presión alta. */
const tensionadas = (e: Estado) => e.ciudades.filter((c) => presion(c) >= 0.6);

const pct = (v: number) => v / 100;
/** Hipotecas vivas sobre vivienda habitual: base de la antigua deducción por compra. */
const HIPOTECAS_VIVAS = 4_000_000;

/** Saca al mercado de golpe parte de las viviendas vacías privadas de una ciudad. */
function sacarVacias(
  e: Estado,
  cuantas: (c: Estado['ciudades'][number]) => number,
  solo?: (c: Estado['ciudades'][number]) => boolean,
) {
  for (const c of e.ciudades) {
    if (solo && !solo(c)) continue;
    const total = cuantas(c);
    const vacias = PRIVADOS.reduce((s, o) => s + c.parque[o].vacia, 0);
    if (!vacias || !total) continue;
    for (const o of PRIVADOS) {
      const p = c.parque[o];
      const n = Math.min(p.vacia, (total * p.vacia) / vacias);
      p.vacia -= n;
      p.ofAlquiler += n * c.intencion[o];
      p.ofVenta += n * (1 - c.intencion[o]);
    }
  }
}

/** Salario mínimo anual como parte de la renta media del hogar. */
function smiSobreRenta(e: Estado): number {
  let h = 0;
  let renta = 0;
  for (const c of e.ciudades) {
    const n = hogares(c);
    h += n;
    renta += c.renta * n;
  }
  return (e.smi * 12) / (renta / h);
}

/** Lo que de verdad puede subir el salario mínimo (en tanto por uno) si se decreta una subida de v %: hasta su techo. */
const subidaSmi = (e: Estado, v: number) =>
  Math.max(0, Math.min(pct(v), P.smiMaxSobreRenta / smiSobreRenta(e) - 1));

/** Cuanto más alto está ya el salario mínimo respecto a los sueldos, más inflación y desconfianza trae subirlo. */
const pesoSmi = (e: Estado) =>
  Math.pow(smiSobreRenta(e) / ((P.smiMensual * 12) / P.rentaHogarEcv2025), 2);

/** Suelo urbanizable con el que arrancó una ciudad, en viviendas: la medida de lo que añade una ley de suelo. */
const sueloInicial = (c: Estado['ciudades'][number]) =>
  c.obraBase * 52 * (c.principal ? P.suelo.aniosPrincipal : P.suelo.aniosResto);

/** Lo que gana al año el hogar medio (en euros de la semana) si la cuota de autónomos baja v €/mes. */
const ganaPorAutonomos = (e: Estado, v: number) => {
  const hogaresPais = e.ciudades.reduce((s, c) => s + hogares(c), 0);
  return (P.autonomos * 12 * v * e.nivelPrecios) / hogaresPais;
};

function pasarAPublico(e: Estado, parte: number) {
  for (const c of e.ciudades) {
    const n = c.parque.grandes.vacia * parte;
    c.parque.grandes.vacia -= n;
    c.parque.publico.ofAlquiler += n;
  }
}

export const DECRETOS: Decreto[] = [
  // ══ Impuestos y dinero público ═══════════════════════════════════════════
  {
    id: 'presupuesto-extra',
    titulo: 'Más dinero público para vivienda',
    descripcion:
      'Quitar dinero de otras partidas (o subir impuestos) para la cartera de vivienda. España gasta en vivienda el 0,1 % del PIB; la media europea es el 0,4 %. Lo que se recorta en otro sitio molesta.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Dinero extra al mes',
      min: 100,
      max: 1000,
      paso: 100,
      defecto: 200,
      unidad: 'M€/mes',
    },
    efectos: (v) => [
      suma('presupuesto.mensual', v),
      suma('tension.extra', v / 100),
      suma('confianza.objetivo', -v / 200),
    ],
    fuentes: ['eurostatVivienda', 'pge'],
  },
  {
    id: 'bajar-itp',
    titulo: 'Bajar los impuestos al comprar casa',
    descripcion:
      'Rebaja del ITP (vivienda usada) y del IVA (nueva) para quien compra para vivir. Es caro: lo disfrutan las 700.000 compras del año.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    parametro: { nombre: 'Rebaja', min: 1, max: 6, paso: 1, defecto: 2, unidad: 'puntos' },
    efectos: (v) => [suma('impuesto.compra', -pct(v))],
    coste: (v, ctx) => (P.compraventasAnuales * ctx.precioMedio * 0.8 * pct(v)) / 1e6,
    fuentes: ['impuestoCompra', 'compraventas'],
  },
  {
    id: 'bonificar-arrendador',
    titulo: 'Rebajar el IRPF a quien alquila su piso',
    descripcion:
      'Hoy el casero ya descuenta el 50 % de lo que cobra. Subir la rebaja anima a alquilar en vez de vender o dejar vacío. El RD-ley 26/2026 llega al 100 % si el alquiler es barato.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: 'Parte del alquiler libre de IRPF',
      min: 60,
      max: 100,
      paso: 10,
      defecto: 70,
      unidad: '%',
    },
    efectos: (v) => [
      suma('oferta.intencionAlquilar', 0.03 + 0.1 * ((v - 50) / 50)),
      suma('confianza.objetivo', 1 + 3 * ((v - 50) / 50)),
    ],
    coste: (v, ctx) => (ctx.inquilinos * ctx.alquilerMedio * 12 * 0.19 * ((v - 50) / 100)) / 1e6,
    fuentes: ['rdl26'],
  },
  {
    id: 'recargo-vacias',
    titulo: 'Recargo del IBI a los pisos vacíos',
    descripcion:
      'Los ayuntamientos cobran más IBI a la vivienda que lleva años vacía sin motivo. Empuja a alquilarla o venderla y recauda algo.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Recargo sobre el IBI',
      min: 50,
      max: 150,
      paso: 25,
      defecto: 50,
      unidad: '%',
    },
    efectos: (v) => [
      mult('oferta.movilizacion', 0.5 * pct(v)),
      suma('confianza.objetivo', -2 * (v / 50)),
    ],
    coste: (v, ctx) => (-ctx.vacias * 300 * ctx.nivelPrecios * pct(v) * 0.3) / 1e6,
    fuentes: ['rdl26', 'censoVacias'],
  },
  {
    id: 'impuesto-grandes',
    titulo: 'Impuesto anual a los grandes propietarios',
    descripcion:
      'Un porcentaje del valor de las carteras de empresas y fondos con muchas viviendas. Frena sus compras, les empuja a vender y recauda.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: -2, soc: 0 },
    parametro: {
      nombre: 'Impuesto sobre el valor',
      min: 0.5,
      max: 3,
      paso: 0.5,
      defecto: 1,
      unidad: '% al año',
    },
    efectos: (v) => [
      mult('inversion.demanda', -0.3 * v, { propietario: 'grandes' }),
      mult('oferta.movilizacion', 0.4 * v, { propietario: 'grandes' }),
      suma('oferta.intencionAlquilar', -0.03 * v, { propietario: 'grandes' }),
      suma('confianza.objetivo', -4 * v),
      suma('tension.extra', -1, DOS_ANIOS),
    ],
    coste: (v, ctx) => (-ctx.parqueGrandes * ctx.precioMedio * pct(v)) / 1e6,
    riesgoLegal: 0.2,
    fuentes: ['propiedadAlquiler', 'supuestoDecretos'],
  },
  {
    id: 'socimi',
    titulo: 'Gravar a las SOCIMI que no alquilan barato',
    descripcion:
      'Las sociedades cotizadas de alquiler apenas pagan impuestos. El RD-ley 26/2026 grava el 25 % de sus beneficios no repartidos, salvo que la mayoría de sus pisos sean asequibles.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [
      suma('oferta.intencionAlquilar', 0.04, { propietario: 'grandes' }),
      mult('inversion.demanda', -0.15, { propietario: 'grandes' }),
      suma('confianza.objetivo', -3),
    ],
    coste: (_, ctx) => -150 * ctx.nivelPrecios,
    fuentes: ['socimi'],
  },
  {
    id: 'impuesto-extranjeros',
    titulo: 'Impuesto a compradores de fuera de la UE',
    descripcion:
      'Gravamen extra sobre el precio cuando compra alguien que no reside en la Unión Europea. Afecta sobre todo a la costa, las islas, Madrid y Barcelona. Propuesto en 2025, nunca votado.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: -1, soc: 1 },
    parametro: {
      nombre: 'Impuesto sobre el precio',
      min: 25,
      max: 100,
      paso: 25,
      defecto: 100,
      unidad: '%',
    },
    efectos: (v) => [
      ...COSTA.map((ciudad) => mult('inversion.demanda', -0.25 * pct(v), { ciudad })),
      suma('confianza.objetivo', -3),
    ],
    coste: (v, ctx) => -200 * pct(v) * ctx.nivelPrecios,
    riesgoLegal: 0.5,
    fuentes: ['impuestoExtranjeros'],
  },
  {
    id: 'iva-obra-nueva',
    titulo: 'IVA superreducido (4 %) a la vivienda nueva',
    descripcion:
      'Del 10 % al 4 % en obra nueva: la casa nueva sale más barata y el promotor gana margen.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    efectos: () => [mult('construccion.privada', 0.12), suma('impuesto.compra', -0.01)],
    coste: (_, ctx) => (P.compraventasAnuales * 0.15 * ctx.precioMedio * 0.06) / 1e6,
    fuentes: ['impuestoCompra', 'rdl26'],
  },
  {
    id: 'deduccion-compra',
    titulo: 'Desgravar la compra de la primera vivienda',
    descripcion:
      'Devolver en el IRPF parte de lo pagado por la hipoteca, como hasta 2013. Da más poder de compra… que acaba en el precio. Lo cobran unos 4 millones de hipotecados.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: 'Deducción',
      min: 5,
      max: 15,
      paso: 5,
      defecto: 15,
      unidad: '% de la cuota',
    },
    efectos: (v) => [
      suma('impuesto.compra', -0.4 * pct(v)),
      suma('demanda.preferenciaCompra', 0.05 * (v / 15)),
      suma('confianza.objetivo', 2),
    ],
    coste: (v, ctx) => (HIPOTECAS_VIVAS * 9040 * ctx.nivelPrecios * pct(v)) / 1e6,
    fuentes: ['supuestoDecretos'],
  },

  {
    id: 'rebaja-irpf',
    titulo: 'Bajar el IRPF a las familias',
    descripcion:
      'Rebaja general del impuesto sobre la renta: cada hogar dispone de más dinero para pagar un alquiler o una hipoteca. Es carísima (cada punto de renta son unos 8.000 M€ al año), calienta algo los precios y, como todos pueden pagar más, parte acaba en el precio de la vivienda.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: 'Renta disponible que ganan los hogares',
      min: 1,
      max: 5,
      paso: 1,
      defecto: 2,
      unidad: '%',
    },
    notaInmediata: (v) => `La renta de los hogares sube un ${v} % de inmediato`,
    alAplicar: (e, v, anterior) => {
      for (const c of e.ciudades) c.renta *= (1 + pct(v)) / (1 + pct(anterior ?? 0));
    },
    alDerogar: (e, anterior) => {
      for (const c of e.ciudades) c.renta /= 1 + pct(anterior);
    },
    efectos: (v) => [
      suma('inflacion.general', 0.0004 * v, DOS_ANIOS),
      suma('confianza.objetivo', v / 2),
    ],
    // La renta que ve la ley ya incluye la rebaja: se cobra sobre la de antes.
    coste: (v, ctx) => ((ctx.rentaHogares / (1 + pct(v))) * pct(v)) / 1e6,
    fuentes: ['rentaHogar', 'supuestoDecretos'],
  },
  {
    id: 'cuota-autonomos',
    titulo: 'Rebajar la cuota de autónomos',
    descripcion:
      'Menos cuota mensual para los 3,3 millones de autónomos. El modelo no distingue hogares por tipo de trabajo: reparte la mejora entre todos, así que por hogar medio se nota poco.',
    categoria: 'Impuestos y dinero público',
    ideologia: { eco: 1, soc: 0 },
    parametro: {
      nombre: 'Rebaja de la cuota',
      min: 50,
      max: 200,
      paso: 50,
      defecto: 100,
      unidad: '€/mes',
    },
    alAplicar: (e, v, anterior) => {
      const gana = ganaPorAutonomos(e, v) - ganaPorAutonomos(e, anterior ?? 0);
      for (const c of e.ciudades) c.renta += gana;
    },
    alDerogar: (e, anterior) => {
      const gana = ganaPorAutonomos(e, anterior);
      for (const c of e.ciudades) c.renta -= gana;
    },
    efectos: () => [suma('confianza.objetivo', 1)],
    coste: (v, ctx) => (P.autonomos * 12 * v * ctx.nivelPrecios) / 1e6,
    fuentes: ['supuestoDecretos'],
  },

  // ══ Construir más ════════════════════════════════════════════════════════
  {
    id: 'desburocratizar',
    titulo: 'Dar las licencias de obra en menos meses',
    descripcion:
      'Hoy una licencia tarda 12 meses de media (la ley dice 3). Ventanilla única y silencio positivo acortan la espera y abaratan cada casa.',
    categoria: 'Construir más',
    ideologia: { eco: 2, soc: 0 },
    parametro: {
      nombre: 'Meses para dar la licencia',
      min: 3,
      max: 11,
      paso: 1,
      defecto: 6,
      unidad: 'meses',
    },
    efectos: (v) => [
      suma('construccion.retraso', -(12 - v) * 4.33),
      mult('construccion.privada', 0.2 * ((12 - v) / 9)),
      suma('confianza.objetivo', 2),
    ],
    fuentes: ['licencias'],
  },
  {
    id: 'liberalizar-suelo',
    titulo: 'Liberar más suelo para construir',
    descripcion:
      'Más suelo urbanizable alrededor de las ciudades: sin suelo para unos años de obra, el promotor no tiene dónde construir. Abarata el solar, que es la mitad del precio de un piso nuevo. Se puede repetir: cada vez añade suelo, y cada vez protesta alguien.',
    categoria: 'Construir más',
    ideologia: { eco: 2, soc: 0 },
    repetible: true,
    notaInmediata: (v) =>
      `El suelo urbanizable de cada ciudad crece un ${v} % del que tenía al inicio`,
    alAplicar: (e, v) => {
      for (const c of e.ciudades) c.suelo += pct(v) * sueloInicial(c);
    },
    acumulativos: () => [suma('tension.extra', 1, DOS_ANIOS)],
    parametro: {
      nombre: 'Suelo urbanizable nuevo',
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: '% más',
    },
    efectos: (v) => [
      mult('construccion.privada', 0.6 * pct(v)),
      mult('construccion.capacidad', 0.25 * pct(v)),
      suma('confianza.objetivo', 2),
    ],
    fuentes: ['supuestoDecretos'],
  },
  {
    id: 'densificar',
    titulo: 'Permitir más alturas en las grandes ciudades',
    descripcion:
      'Más pisos por solar en Madrid, Barcelona, Valencia, Alicante, Sevilla y Málaga: en el mismo suelo caben más viviendas. Los vecinos protestan un tiempo.',
    categoria: 'Construir más',
    ideologia: { eco: 1, soc: 0 },
    notaInmediata: (v) => `En el suelo de las grandes ciudades caben un ${v} % más de viviendas`,
    alAplicar: (e, v, anterior) => {
      for (const c of principales(e)) c.suelo += pct(v - (anterior ?? 0)) * sueloInicial(c);
    },
    parametro: {
      nombre: 'Edificabilidad extra',
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: '%',
    },
    efectos: (v, e) => [
      ...principales(e).map((c) => mult('construccion.privada', 0.5 * pct(v), { ciudad: c.id })),
      suma('confianza.objetivo', 1),
      suma('tension.extra', 1, DOS_ANIOS),
    ],
    fuentes: ['supuestoDecretos'],
  },
  {
    id: 'industrializar',
    titulo: 'Fábricas de vivienda industrializada',
    descripcion:
      'Subvencionar fábricas de módulos y formación: el sector puede construir más y más rápido.',
    categoria: 'Construir más',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Inversión anual',
      min: 200,
      max: 2000,
      paso: 200,
      defecto: 400,
      unidad: 'M€/año',
    },
    efectos: (v) => [
      mult('construccion.capacidad', 0.15 * (v / 400)),
      suma('construccion.retraso', -6 * (v / 400)),
    ],
    coste: (v, ctx) => v * ctx.nivelPrecios,
    fuentes: ['manoObra', 'supuestoDecretos'],
  },
  {
    id: 'formar-obreros',
    titulo: 'Formar trabajadores de la construcción',
    descripcion:
      'Faltan 700.000 trabajadores. Plazas de formación profesional y contratos en prácticas amplían lo que el sector puede construir.',
    categoria: 'Construir más',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Plazas al año',
      min: 20000,
      max: 100000,
      paso: 20000,
      defecto: 40000,
      unidad: 'plazas',
    },
    efectos: (v) => [mult('construccion.capacidad', 0.3 * (v / 100000))],
    coste: (v, ctx) => v * 0.01 * ctx.nivelPrecios,
    fuentes: ['manoObra'],
  },
  {
    id: 'oficinas-vivienda',
    titulo: 'Convertir oficinas y locales en pisos',
    descripcion:
      'Cambio de uso exprés para oficinas y locales vacíos de las grandes ciudades. Saca al mercado de golpe un paquete de viviendas.',
    categoria: 'Construir más',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Oficinas vacías que se convierten',
      min: 10,
      max: 50,
      paso: 10,
      defecto: 30,
      unidad: '%',
    },
    notaInmediata: (v) =>
      `En las grandes ciudades aparece de golpe el ${(0.3 * (v / 30)).toLocaleString('es-ES', { maximumFractionDigits: 1 })} % del parque en forma de pisos nuevos`,
    alAplicar: (e, v) => {
      for (const c of principales(e)) {
        const n = viviendas(c) * 0.003 * (v / 30);
        c.parque.pequenos.ofVenta += n * 0.3;
        c.parque.grandes.ofAlquiler += n * 0.4;
        c.parque.grandes.ofVenta += n * 0.3;
        e.contadores.construidas += n;
      }
    },
    efectos: () => [suma('confianza.objetivo', 1)],
    fuentes: ['supuestoDecretos'],
  },

  // ══ Control de precios ═══════════════════════════════════════════════════
  {
    id: 'tope-alquiler',
    titulo: 'Limitar la subida anual del alquiler',
    descripcion:
      'Ningún alquiler puede subir más de este porcentaje al año (0 = congelar). En Cataluña bajó los precios un 3,7 % pero los contratos registrados cayeron un 61 %: parte de los caseros retira el piso.',
    categoria: 'Control de precios',
    ideologia: { eco: -1, soc: 0 },
    grupo: 'control-alquiler',
    parametro: { nombre: 'Subida máxima al año', min: 0, max: 5, paso: 1, defecto: 2, unidad: '%' },
    efectos: (v) => {
      const k = Math.max(0, (3 - v) / 3);
      return [
        tope('alquiler.crecimientoMax', pct(v)),
        suma('oferta.intencionAlquilar', -(0.06 + 0.1 * k)),
        mult('oferta.retirada', 0.5 * k),
        suma('confianza.objetivo', -(4 + 6 * k)),
        suma('tension.extra', -(2 + 2 * k), DOS_ANIOS),
      ];
    },
    riesgoLegal: 0.2,
    fuentes: ['rdl26', 'catalunaTensionada'],
  },
  {
    id: 'zonas-tensionadas',
    titulo: 'Topar el alquiler solo en las zonas tensionadas',
    descripcion:
      'Como la Ley 12/2023: el tope se aplica solo en las ciudades con presión alta (60 o más) en el momento de aprobarlo. El resto del país sigue libre y el daño a la oferta se concentra.',
    categoria: 'Control de precios',
    ideologia: { eco: -1, soc: 0 },
    grupo: 'control-alquiler',
    parametro: {
      nombre: 'Subida máxima al año en zonas tensionadas',
      min: 0,
      max: 3,
      paso: 1,
      defecto: 2,
      unidad: '%',
    },
    efectos: (v, e) => {
      const k = Math.max(0, (3 - v) / 3);
      const zonas = tensionadas(e);
      return [
        ...zonas.flatMap((c) => [
          tope('alquiler.crecimientoMax', pct(v), { ciudad: c.id }),
          suma('oferta.intencionAlquilar', -(0.05 + 0.08 * k), { ciudad: c.id }),
          mult('oferta.retirada', 0.4 * k, { ciudad: c.id }),
        ]),
        suma('confianza.objetivo', -(2 + 3 * k)),
        suma('tension.extra', -(1 + k), DOS_ANIOS),
      ];
    },
    fuentes: ['ley12', 'catalunaTensionada'],
  },
  {
    id: 'rebajar-alquileres',
    titulo: 'Bajar los alquileres por decreto',
    descripcion:
      'Todos los alquileres bajan de golpe este porcentaje y quedan congelados. Se puede repetir, pero cada vez más caseros dejan de renovar, y por debajo de lo que cuesta mantener un piso (la mitad del alquiler de partida) nadie alquila.',
    categoria: 'Control de precios',
    ideologia: { eco: -2, soc: 0 },
    grupo: 'control-alquiler',
    repetible: true,
    parametro: { nombre: 'Rebaja inmediata', min: 5, max: 30, paso: 5, defecto: 10, unidad: '%' },
    notaInmediata: (v) => `Alquileres −${v} % de inmediato`,
    alAplicar: (e, v) => {
      for (const c of e.ciudades) {
        // No pueden bajar de lo que cuesta mantener la vivienda.
        const suelo = sueloAlquilerDe(c);
        const nuevo = Math.min(c.alquiler, Math.max(c.alquiler * (1 - pct(v)), suelo));
        c.alquilerVivo = Math.min(c.alquilerVivo * (1 - pct(v)), nuevo);
        c.alquiler = nuevo;
      }
    },
    acumulativos: (v) => [mult('contratos.noRenovacion', 2 * pct(v), DOS_ANIOS)],
    efectos: (v) => [
      tope('alquiler.crecimientoMax', 0),
      suma('oferta.intencionAlquilar', -(0.16 + 0.3 * pct(v))),
      mult('oferta.retirada', 0.5 + pct(v)),
      suma('confianza.objetivo', -(10 + v / 2)),
      suma('tension.extra', -(4 + v / 5), DOS_ANIOS),
    ],
    riesgoLegal: 0.6,
    fuentes: ['catalunaTensionada', 'supuestoDecretos'],
  },
  {
    id: 'tope-venta',
    titulo: 'Prohibir que suba el precio de venta',
    descripcion:
      'El precio de la vivienda no puede subir. Hunde el margen del promotor y se construye menos.',
    categoria: 'Control de precios',
    ideologia: { eco: -2, soc: 0 },
    grupo: 'control-venta',
    efectos: () => [
      tope('venta.crecimientoMax', 0),
      mult('construccion.privada', -0.25),
      suma('confianza.objetivo', -10),
      suma('tension.extra', -2, DOS_ANIOS),
    ],
    riesgoLegal: 0.7,
    fuentes: ['supuestoDecretos'],
  },
  {
    id: 'temporada',
    titulo: 'Cerrar la escapatoria del alquiler de temporada',
    descripcion:
      'Un alquiler de temporada necesita causa real y no puede pasar de 12 meses; si no, es alquiler normal con todos sus límites. Evita que los caseros huyan de los topes… o que alquilen.',
    categoria: 'Control de precios',
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [
      mult('oferta.retirada', -0.3),
      suma('oferta.intencionAlquilar', -0.02),
      suma('confianza.objetivo', -2),
    ],
    fuentes: ['temporada', 'catalunaTensionada'],
  },

  {
    id: 'inspeccion-alquiler',
    titulo: 'Inspección y registro de alquileres',
    descripcion:
      'Los topes se incumplen: pagos en negro, contratos de temporada falsos, extras inventados. Un registro obligatorio de contratos y un cuerpo de inspectores hacen que se cumplan más. Sin topes en vigor no sirve de nada.',
    categoria: 'Control de precios',
    ideologia: { eco: -1, soc: 0 },
    efectos: () => [suma('cumplimiento.alquiler', 0.2), suma('confianza.objetivo', -1)],
    coste: (_, ctx) => 150 * ctx.nivelPrecios,
    fuentes: ['supuestoDecretos'],
  },

  // ══ Reglas del alquiler ══════════════════════════════════════════════════
  {
    id: 'prohibir-desahucios',
    titulo: 'Suspender los desahucios',
    descripcion:
      'Nadie (o solo los hogares vulnerables) puede ser desalojado de su vivienda habitual. El casero percibe más riesgo y alquila menos. El RD-ley 26/2026 suspende los de hogares vulnerables hasta 2030.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -2, soc: 0 },
    grupo: 'desahucios',
    parametro: {
      nombre: 'Desahucios que se suspenden',
      min: 25,
      max: 100,
      paso: 25,
      defecto: 50,
      unidad: '%',
    },
    efectos: (v) => [
      mult('desahucios.tasa', -0.9 * pct(v)),
      suma('oferta.intencionAlquilar', -0.14 * pct(v)),
      suma('oferta.intencionAlquilar', -0.05 * pct(v), { propietario: 'familias' }),
      suma('confianza.objetivo', -7 * pct(v)),
      suma('tension.extra', -5 * pct(v), DOS_ANIOS),
    ],
    riesgoLegal: 0.3,
    fuentes: ['rdl26', 'lanzamientos'],
  },
  {
    id: 'desahucio-expres',
    titulo: 'Desahucio exprés',
    descripcion:
      'Desalojo en semanas ante impago u ocupación. Más seguridad para el casero, más familias en la calle.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: 2, soc: 1 },
    grupo: 'desahucios',
    efectos: () => [
      mult('desahucios.tasa', 0.6),
      suma('oferta.intencionAlquilar', 0.08),
      suma('confianza.objetivo', 5),
      suma('tension.extra', 5, DOS_ANIOS),
    ],
    fuentes: ['lanzamientos', 'supuestoDecretos'],
  },
  {
    id: 'indemnizacion',
    titulo: 'Indemnizar al inquilino si el casero no renueva',
    descripcion:
      'El casero que no renueva paga al inquilino estos meses de renta. El RD-ley 27/2026 fija 12. Menos expulsiones, menos ganas de alquilar.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -1, soc: 0 },
    parametro: { nombre: 'Meses de renta', min: 3, max: 12, paso: 3, defecto: 12, unidad: 'meses' },
    efectos: (v) => [
      mult('contratos.noRenovacion', -0.05 * v),
      suma('oferta.intencionAlquilar', -0.01 * v),
      suma('confianza.objetivo', -0.5 * v),
      suma('tension.extra', -v / 6, DOS_ANIOS),
    ],
    fuentes: ['rdl27'],
  },
  {
    id: 'contratos-largos',
    titulo: 'Contratos de alquiler más largos',
    descripcion:
      'Hoy el contrato dura 5 años (7 si el casero es empresa). Alargarlo da estabilidad al inquilino y resta flexibilidad al casero.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -1, soc: 0 },
    parametro: { nombre: 'Duración mínima', min: 7, max: 15, paso: 1, defecto: 10, unidad: 'años' },
    efectos: (v) => [
      mult('contratos.noRenovacion', -0.06 * (v - 5)),
      suma('oferta.intencionAlquilar', -0.015 * (v - 5)),
      suma('confianza.objetivo', -(v - 5)),
    ],
    fuentes: ['rdl27'],
  },
  {
    id: 'limitar-turisticos',
    titulo: 'Devolver pisos turísticos a vivienda',
    descripcion:
      'Retirar licencias de uso turístico (hay 341.000 pisos, el 1,28 % del parque) y obligar a devolverlos al alquiler o la venta.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Pisos turísticos que vuelven',
      min: 10,
      max: 100,
      paso: 10,
      defecto: 30,
      unidad: '%',
    },
    notaInmediata: (v) => `El ${v} % de los pisos turísticos vuelve de golpe al mercado`,
    alAplicar: (e, v) => sacarVacias(e, (c) => viviendas(c) * P.pctTuristicas * pct(v)),
    efectos: (v) => [
      mult('oferta.movilizacion', 0.2 * pct(v)),
      suma('confianza.objetivo', -3 * pct(v)),
    ],
    // Lo que deja de ingresarse por el turismo que se alojaba en esos pisos.
    coste: (v, ctx) => 300 * pct(v) * ctx.nivelPrecios,
    fuentes: ['turisticas', 'rdl26'],
  },
  {
    id: 'vetar-fondos',
    titulo: 'Prohibir a los fondos comprar vivienda',
    descripcion:
      'Las empresas y fondos con muchas viviendas no pueden comprar más vivienda residencial.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -2, soc: 0 },
    efectos: () => [
      mult('inversion.demanda', -1, { propietario: 'grandes' }),
      suma('confianza.objetivo', -6),
      suma('tension.extra', -2, DOS_ANIOS),
    ],
    riesgoLegal: 0.5,
    fuentes: ['propiedadAlquiler', 'supuestoDecretos'],
  },
  {
    id: 'seguro-impago',
    titulo: 'Seguro público contra el impago del alquiler',
    descripcion:
      'El Estado cubre al casero si el inquilino deja de pagar y media antes del desahucio. Más caseros se animan a alquilar.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: 0, soc: 0 },
    efectos: () => [
      suma('oferta.intencionAlquilar', 0.06),
      mult('desahucios.tasa', -0.2),
      suma('confianza.objetivo', 3),
    ],
    coste: (_, ctx) => (ctx.inquilinos * ctx.alquilerMedio * 12 * 0.01) / 1e6,
    fuentes: ['supuestoDecretos', 'lanzamientos'],
  },
  {
    id: 'alquiler-social-grandes',
    titulo: 'Obligar a los grandes propietarios a ofrecer alquiler social',
    descripcion:
      'Como en Cataluña: empresas y fondos deben ceder sus pisos vacíos como alquiler social. Una cuarta parte pasa al parque público de golpe.',
    categoria: 'Reglas del alquiler',
    ideologia: { eco: -2, soc: 0 },
    notaInmediata: () => 'El 25 % de los pisos vacíos de empresas y fondos pasa a alquiler social',
    alAplicar: (e) => pasarAPublico(e, 0.25),
    efectos: () => [
      suma('oferta.intencionAlquilar', -0.06, { propietario: 'grandes' }),
      mult('inversion.demanda', -0.3, { propietario: 'grandes' }),
      suma('confianza.objetivo', -8),
      suma('tension.extra', -3, DOS_ANIOS),
    ],
    riesgoLegal: 0.3,
    fuentes: ['ley24cat'],
  },

  // ══ Vivienda pública ═════════════════════════════════════════════════════
  {
    id: 'plan-vivienda-publica',
    titulo: 'Construir vivienda pública en alquiler',
    descripcion:
      'Viviendas públicas que se empiezan cada semana, además de las 250 actuales. Cada 100 semanales cuestan unos 830 M€ al año (160.000 € por vivienda, como Casa 47) y compiten por los mismos albañiles.',
    categoria: 'Vivienda pública',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Viviendas públicas nuevas',
      min: 100,
      max: 3000,
      paso: 100,
      defecto: 500,
      unidad: 'por semana',
    },
    efectos: (v) => [suma('construccion.publica', v)],
    fuentes: ['casa47', 'planEstatal'],
  },
  {
    id: 'compra-publica',
    titulo: 'Comprar pisos para alquiler social',
    descripcion:
      'El Estado compra viviendas en venta (derecho de compra preferente) y las alquila a precio social. Paga el precio de mercado de cada ciudad.',
    categoria: 'Vivienda pública',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Compras',
      min: 50,
      max: 1000,
      paso: 50,
      defecto: 250,
      unidad: 'por semana',
    },
    efectos: (v) => [suma('compra.publica', v)],
    fuentes: ['casa47'],
  },
  {
    id: 'suelo-publico-concesion',
    titulo: 'Ceder suelo público a promotores (75 años)',
    descripcion:
      'Promotores privados construyen alquiler asequible sobre suelo público. El Estado solo paga el suelo (un 30 % del coste) y al cabo de 75 años se queda las casas.',
    categoria: 'Vivienda pública',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Viviendas asequibles',
      min: 50,
      max: 1000,
      paso: 50,
      defecto: 200,
      unidad: 'por semana',
    },
    efectos: (v) => [
      suma('construccion.concesion', v),
      mult('construccion.privada', 0.06 * (v / 200)),
      suma('confianza.objetivo', 1),
    ],
    fuentes: ['planEstatal', 'casa47'],
  },
  {
    id: 'reserva-protegida',
    titulo: 'Reservar parte de la obra nueva para vivienda protegida',
    descripcion:
      'Cada promoción privada debe destinar este porcentaje a vivienda protegida. En Barcelona, con el 30 %, salieron 34 pisos en ocho años: los promotores dejaron de construir.',
    categoria: 'Vivienda pública',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Reserva obligatoria',
      min: 10,
      max: 40,
      paso: 10,
      defecto: 30,
      unidad: '%',
    },
    efectos: (v) => [
      mult('construccion.privada', -0.3 * (v / 30)),
      suma('construccion.concesion', 1550 * pct(v) * 0.5),
      suma('confianza.objetivo', -v / 5),
    ],
    fuentes: ['barcelona30'],
  },
  {
    id: 'expropiar-vacias',
    titulo: 'Expropiar el uso de pisos vacíos a empresas y fondos',
    descripcion:
      'Parte de las viviendas vacías de grandes propietarios pasa a alquiler social. Se puede repetir mientras quede algo.',
    categoria: 'Vivienda pública',
    ideologia: { eco: -2, soc: 0 },
    repetible: true,
    parametro: {
      nombre: 'Pisos vacíos de grandes propietarios que se expropian',
      min: 10,
      max: 100,
      paso: 10,
      defecto: 50,
      unidad: '%',
    },
    notaInmediata: (v) =>
      `El ${v} % de la vivienda vacía de empresas y fondos pasa al parque público`,
    alAplicar: (e, v) => pasarAPublico(e, pct(v)),
    efectos: (v) => [
      suma('confianza.objetivo', -Math.min(30, 15 * (v / 50))),
      suma('tension.extra', -4, DOS_ANIOS),
    ],
    riesgoLegal: 0.5,
    fuentes: ['ley24cat', 'supuestoDecretos'],
  },

  // ══ Quién busca casa ═════════════════════════════════════════════════════
  {
    id: 'bono-alquiler',
    titulo: 'Bono de alquiler para jóvenes',
    descripcion:
      'Ayuda mensual durante dos años a quien firma un alquiler (el real son 250 €). Más familias pueden pagar los precios actuales… y los precios lo notan.',
    categoria: 'Quién busca casa',
    ideologia: { eco: -1, soc: 0 },
    parametro: {
      nombre: 'Ayuda mensual',
      min: 100,
      max: 500,
      paso: 50,
      defecto: 250,
      unidad: '€/mes',
    },
    efectos: (v) => [suma('acceso.ayudaAlquiler', v), suma('tension.extra', -2, DOS_ANIOS)],
    coste: (v, ctx) => (ctx.contratos * 52 * 2 * v * ctx.nivelPrecios * 12) / 1e6,
    fuentes: ['bonoJoven'],
  },
  {
    id: 'avales-hipoteca',
    titulo: 'Avalar la hipoteca de los jóvenes',
    descripcion:
      'El Estado avala parte del préstamo (el ICO avala el 20 %): el banco financia más y hace falta menos entrada. Solo cuesta si hay impagos.',
    categoria: 'Quién busca casa',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Parte del préstamo avalada',
      min: 10,
      max: 30,
      paso: 5,
      defecto: 20,
      unidad: '%',
    },
    efectos: (v) => [suma('hipoteca.aval', pct(v))],
    coste: (v, ctx) => (ctx.compras * 52 * ctx.precioMedio * pct(v) * 0.03) / 1e6,
    fuentes: ['avalesIco', 'hipotecas'],
  },
  {
    id: 'hipotecas-largas',
    titulo: 'Permitir hipotecas más largas',
    descripcion:
      'Hoy la hipoteca media dura 25 años. Alargarla baja la cuota y permite pagar más por la misma casa: el precio sube.',
    categoria: 'Quién busca casa',
    ideologia: { eco: 1, soc: 0 },
    parametro: { nombre: 'Plazo', min: 30, max: 40, paso: 5, defecto: 40, unidad: 'años' },
    efectos: (v) => [suma('hipoteca.plazo', v - 25), suma('confianza.objetivo', 1)],
    fuentes: ['hipotecas'],
  },
  {
    id: 'subir-smi',
    titulo: 'Subir el salario mínimo',
    descripcion:
      'Subida inmediata del SMI, que llega en parte a la renta de los hogares. Durante dos años trae más inflación y menos confianza de las empresas. Se puede repetir, pero cada subida cuesta más que la anterior y el SMI anual no pasa del 60 % de la renta media del hogar (hoy es el 44 %).',
    categoria: 'Quién busca casa',
    ideologia: { eco: -1, soc: 0 },
    repetible: true,
    parametro: { nombre: 'Subida', min: 2, max: 15, paso: 1, defecto: 5, unidad: '%' },
    notaInmediata: (v) => `SMI +${v} % de inmediato (hasta su techo)`,
    alAplicar: (e, v) => {
      const sube = subidaSmi(e, v);
      e.smi *= 1 + sube;
      for (const c of e.ciudades) c.renta *= 1 + P.traspasoSmiRenta * sube;
    },
    efectos: (v, e) => [suma('tension.extra', -20 * subidaSmi(e, v), DOS_ANIOS)],
    acumulativos: (v, e) => {
      const puntos = 100 * subidaSmi(e, v) * pesoSmi(e);
      return [
        suma('inflacion.general', 0.0006 * puntos, DOS_ANIOS),
        suma('confianza.objetivo', -puntos / 3, DOS_ANIOS),
      ];
    },
    fuentes: ['smi'],
  },
  {
    id: 'restringir-inmigracion',
    titulo: 'Restringir la inmigración',
    descripcion:
      'Menos familias llegan, pero también menos trabajadores para la construcción, que ya no encuentra albañiles.',
    categoria: 'Quién busca casa',
    ideologia: { eco: 0, soc: 2 },
    parametro: {
      nombre: 'Llegadas que se recortan',
      min: 10,
      max: 50,
      paso: 10,
      defecto: 20,
      unidad: '%',
    },
    efectos: (v) => [
      mult('demanda.inmigracion', -pct(v)),
      mult('construccion.capacidad', -0.3 * pct(v)),
      suma('tension.extra', v / 10, DOS_ANIOS),
    ],
    fuentes: ['inmigracion', 'manoObra'],
  },
  {
    id: 'facilitar-inmigracion',
    titulo: 'Visados para oficios de la construcción',
    descripcion: 'Más inmigración laboral: más demanda de casa y más capacidad para construirla.',
    categoria: 'Quién busca casa',
    ideologia: { eco: 0, soc: -2 },
    parametro: { nombre: 'Llegadas extra', min: 5, max: 30, paso: 5, defecto: 15, unidad: '%' },
    efectos: (v) => [
      mult('demanda.inmigracion', pct(v)),
      mult('construccion.capacidad', 0.5 * pct(v)),
    ],
    fuentes: ['inmigracion', 'manoObra'],
  },
  {
    id: 'repoblar',
    titulo: 'Incentivos para vivir fuera de las grandes ciudades',
    descripcion:
      'Teletrabajo, servicios y ventajas fiscales: parte de las familias nuevas se instala en el resto de España.',
    categoria: 'Quién busca casa',
    ideologia: { eco: 0, soc: 0 },
    parametro: {
      nombre: 'Familias que se desvían',
      min: 5,
      max: 20,
      paso: 5,
      defecto: 10,
      unidad: '%',
    },
    efectos: (v) => [
      mult('demanda.inmigracion', -0.6 * pct(v)),
      mult('demanda.emancipacion', -0.6 * pct(v)),
      mult('demanda.inmigracion', 3 * pct(v), { ciudad: RESTO }),
      mult('demanda.emancipacion', 2.5 * pct(v), { ciudad: RESTO }),
    ],
    coste: (v, ctx) => 50 * v * ctx.nivelPrecios,
    fuentes: ['supuestoDecretos'],
  },
];

export const DECRETO_POR_ID = new Map(DECRETOS.map((d) => [d.id, d]));

/** Todo lo que hace una ley al promulgarla: sus efectos y los que se acumulan en cada promulgación. */
export const efectosDe = (d: Decreto, v: number, e: Estado): Efecto[] => [
  ...d.efectos(v, e),
  ...(d.acumulativos?.(v, e) ?? []),
];

/** Valor con el que se promulga una ley si no se indica otro. */
export const valorPorDefecto = (d: Decreto) => d.parametro?.defecto ?? 1;

/** Comprueba que un valor es válido para una ley. */
export function valorValido(d: Decreto, v: number): boolean {
  if (!d.parametro) return v === 1;
  const p = d.parametro;
  return Number.isFinite(v) && v >= p.min - 1e-9 && v <= p.max + 1e-9;
}

export type { Contexto };
