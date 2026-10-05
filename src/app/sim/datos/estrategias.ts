import type { Cambio } from '../tipos';
import { DECRETO_POR_ID, valorPorDefecto } from './decretos';

/**
 * ESTRATEGIAS PREPARADAS
 * Cada una es una lista de pasos que se aplican de uno en uno, un paso por mes:
 * 'id' fija una ley a su valor por defecto, ['id', valor] a ese valor, e 'imprimir' crea 1.000 M€.
 * Las usa el banco de pruebas (`npm run simular`) y la pestaña «Estrategias», que las aplica sola.
 */
export type Paso = string | [string, number];

export interface Estrategia {
  id: string;
  nombre: string;
  descripcion: string;
  pasos: Paso[];
}

export const IMPRIMIR = 'imprimir';

export const ESTRATEGIAS: Estrategia[] = [
  {
    id: 'equilibrada',
    nombre: 'Equilibrada',
    descripcion:
      'Mucha oferta, pública y privada, sin hundir el precio de golpe: licencias, suelo (dos veces), vivienda pública, aval para la entrada y tres subidas del salario mínimo. El alquiler del parque público paga la deuda hacia el año 10 y gana entre el año 12 y el 17.',
    pasos: [
      ['desburocratizar', 3],
      ['presupuesto-extra', 800],
      ['suelo-publico-concesion', 800],
      ['liberalizar-suelo', 40],
      ['plan-vivienda-publica', 600],
      ['formar-obreros', 80000],
      ['industrializar', 800],
      ['limitar-turisticos', 80],
      ['recargo-vacias', 150],
      'seguro-impago',
      ['avales-hipoteca', 20],
      ['subir-smi', 8],
      ['bonificar-arrendador', 90],
      'socimi',
      ['densificar', 30],
      ['repoblar', 15],
      ['subir-smi', 8],
      ['impuesto-extranjeros', 50],
      ['subir-smi', 8],
      ['liberalizar-suelo', 40],
    ],
  },
  {
    id: 'choque',
    nombre: 'Choque de oferta',
    descripcion:
      'Todo al máximo desde el primer mes: la más rápida (gana entre el año 10 y el 13) y la que más gasta. La confianza de los inversores cae a 40 durante años y la deuda tarda en pagarse, pero el parque público acaba rentando más que ninguna.',
    pasos: [
      ['desburocratizar', 3],
      ['presupuesto-extra', 1000],
      ['liberalizar-suelo', 50],
      ['plan-vivienda-publica', 800],
      ['densificar', 50],
      ['suelo-publico-concesion', 1000],
      ['industrializar', 1000],
      ['formar-obreros', 100000],
      ['limitar-turisticos', 100],
      ['recargo-vacias', 150],
      ['oficinas-vivienda', 50],
      ['subir-smi', 10],
      'seguro-impago',
      ['bonificar-arrendador', 100],
      'socimi',
      ['repoblar', 20],
      ['subir-smi', 10],
      ['subir-smi', 10],
      ['contratos-largos', 10],
    ],
  },
  {
    id: 'gradual',
    nombre: 'Gradual',
    descripcion:
      'La versión prudente: menos gasto, menos obra y precios que bajan despacio. Nunca se endeuda ni pierde elecciones, pero tarda unos veinte años y con mala coyuntura puede no llegar.',
    pasos: [
      ['desburocratizar', 3],
      ['presupuesto-extra', 600],
      ['suelo-publico-concesion', 600],
      ['liberalizar-suelo', 30],
      ['plan-vivienda-publica', 400],
      ['formar-obreros', 60000],
      ['avales-hipoteca', 20],
      ['limitar-turisticos', 50],
      ['recargo-vacias', 100],
      'seguro-impago',
      ['bonificar-arrendador', 80],
      ['subir-smi', 5],
      ['industrializar', 600],
      'socimi',
      ['repoblar', 10],
      ['subir-smi', 5],
    ],
  },
  {
    id: 'demanda',
    nombre: 'Ayudas a la demanda',
    descripcion:
      'Dar más dinero a quien busca casa sin construir más: avales, bono de alquiler, rebaja del IRPF, desgravación, menos impuestos al comprar e hipotecas largas. Cuesta unos 40.000 M€ al año, todos pueden pagar más y los precios lo recogen: pierde las primeras elecciones.',
    pasos: [
      ['avales-hipoteca', 30],
      ['bono-alquiler', 250],
      ['rebaja-irpf', 2],
      ['deduccion-compra', 15],
      ['bajar-itp', 3],
      ['hipotecas-largas', 40],
      ['cuota-autonomos', 100],
      ['subir-smi', 5],
    ],
  },
  {
    id: 'control',
    nombre: 'Control e inspección',
    descripcion:
      'Topes en las zonas tensionadas con inspección para que se cumplan, protección del inquilino y vivienda pública pagada con impuestos a grandes propietarios. Sin deuda y con el alquiler contenido, pero la confianza cae a 30, se construye menos y casi siempre pierde las primeras elecciones.',
    pasos: [
      ['zonas-tensionadas', 2],
      'inspeccion-alquiler',
      ['presupuesto-extra', 600],
      ['plan-vivienda-publica', 600],
      ['indemnizacion', 6],
      ['recargo-vacias', 100],
      ['limitar-turisticos', 50],
      ['compra-publica', 100],
      ['impuesto-grandes', 1],
      ['contratos-largos', 7],
      'temporada',
      ['subir-smi', 5],
    ],
  },
  {
    id: 'liberal',
    nombre: 'Liberal',
    descripcion:
      'Mercado y rebajas fiscales: suelo, licencias, menos impuestos a familias y autónomos, y más seguridad para el casero. Construye el doble, pero no sube el presupuesto y las rebajas fiscales se pagan con deuda, que acaba hundiendo la confianza y el apoyo.',
    pasos: [
      ['desburocratizar', 3],
      ['liberalizar-suelo', 50],
      'iva-obra-nueva',
      ['densificar', 50],
      ['bonificar-arrendador', 100],
      ['formar-obreros', 60000],
      ['facilitar-inmigracion', 15],
      ['cuota-autonomos', 100],
      'desahucio-expres',
      ['oficinas-vivienda', 50],
      'seguro-impago',
      ['rebaja-irpf', 1],
      ['liberalizar-suelo', 50],
    ],
  },
  {
    id: 'intervencionista',
    nombre: 'Intervencionista',
    descripcion:
      'Alquileres congelados e inspeccionados, desahucios suspendidos, vivienda pública a gran escala y mano dura con fondos y pisos vacíos. Abarata deprisa comprar y alquilar, pero la confianza cae a cero, la obra privada se para y varias de sus leyes caen en los tribunales.',
    pasos: [
      ['tope-alquiler', 0],
      'inspeccion-alquiler',
      ['prohibir-desahucios', 50],
      ['plan-vivienda-publica', 1500],
      'vetar-fondos',
      ['recargo-vacias', 50],
      ['expropiar-vacias', 50],
      ['compra-publica', 250],
      ['subir-smi', 5],
      ['impuesto-grandes', 1],
      ['indemnizacion', 12],
      'tope-venta',
      'alquiler-social-grandes',
    ],
  },
];

export const ESTRATEGIA_POR_ID = new Map(ESTRATEGIAS.map((x) => [x.id, x]));

/** El cambio de ley de un paso, o null si el paso es imprimir dinero. */
export function cambioDe(paso: Paso): Cambio | null {
  if (paso === IMPRIMIR) return null;
  if (typeof paso !== 'string') return { id: paso[0], valor: paso[1] };
  return { id: paso, valor: valorPorDefecto(DECRETO_POR_ID.get(paso)!) };
}
