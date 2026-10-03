/**
 * Banco de pruebas del motor, sin interfaz: `npm run simular [años]`.
 * Ejecuta varias estrategias y muestra la evolución de los tres objetivos, la tensión y la cartera.
 * Cada estrategia es una lista de cambios: [id, valor] fija una ley (valor por defecto si se omite),
 * [id, null] la deroga, 'imprimir' crea 1.000 M€. Se aplica un cambio por mes.
 */
import { avanzarSemana, crearEstado, imprimir, promulgar } from '../src/app/sim/motor/motor';
import { indicadores, presion } from '../src/app/sim/motor/indicadores';
import { crearResolver } from '../src/app/sim/motor/modificadores';
import { DECRETO_POR_ID, valorPorDefecto } from '../src/app/sim/datos/decretos';

type Paso = string | [string, number | null];

const ESTRATEGIAS: Record<string, Paso[]> = {
  'sin decretos': [],
  liberal: [
    'desburocratizar',
    'liberalizar-suelo',
    'iva-obra-nueva',
    'densificar',
    'bonificar-arrendador',
    'industrializar',
    'facilitar-inmigracion',
    'formar-obreros',
    'bajar-itp',
    'desahucio-expres',
    'oficinas-vivienda',
    'seguro-impago',
  ],
  intervencionista: [
    ['tope-alquiler', 0],
    'prohibir-desahucios',
    ['plan-vivienda-publica', 1500],
    'vetar-fondos',
    'recargo-vacias',
    'expropiar-vacias',
    ['rebajar-alquileres', 10],
    'compra-publica',
    'subir-smi',
    'impuesto-grandes',
    'indemnizacion',
    'tope-venta',
    'alquiler-social-grandes',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
  ],
  mixta: [
    'desburocratizar',
    ['plan-vivienda-publica', 800],
    'presupuesto-extra',
    'industrializar',
    'recargo-vacias',
    'liberalizar-suelo',
    'limitar-turisticos',
    'suelo-publico-concesion',
    'facilitar-inmigracion',
    'zonas-tensionadas',
    'subir-smi',
    'formar-obreros',
    'bonificar-arrendador',
    'repoblar',
    'seguro-impago',
    'socimi',
    'densificar',
  ],
  'a por la victoria': [
    ['desburocratizar', 3],
    ['presupuesto-extra', 1000],
    ['liberalizar-suelo', 50],
    ['plan-vivienda-publica', 800],
    ['densificar', 50],
    ['suelo-publico-concesion', 1000],
    ['industrializar', 1000],
    ['formar-obreros', 100000],
    ['facilitar-inmigracion', 30],
    ['limitar-turisticos', 100],
    ['recargo-vacias', 150],
    ['oficinas-vivienda', 50],
    ['subir-smi', 10],
    'seguro-impago',
    ['subir-smi', 10],
    ['zonas-tensionadas', 2],
    'socimi',
    ['repoblar', 20],
    ['bajar-itp', 3],
    ['subir-smi', 8],
  ],
  disciplinada: [
    ['desburocratizar', 3],
    ['presupuesto-extra', 1000],
    ['liberalizar-suelo', 50],
    ['densificar', 50],
    ['plan-vivienda-publica', 500],
    ['suelo-publico-concesion', 1000],
    ['industrializar', 1000],
    ['formar-obreros', 60000],
    ['facilitar-inmigracion', 30],
    ['limitar-turisticos', 100],
    ['recargo-vacias', 150],
    ['oficinas-vivienda', 50],
    'seguro-impago',
    ['zonas-tensionadas', 2],
    'socimi',
    ['subir-smi', 8],
    ['repoblar', 10],
    ['subir-smi', 8],
    ['hipotecas-largas', 30],
  ],
  'ida de olla': [
    ['plan-vivienda-publica', 3000],
    ['bono-alquiler', 500],
    ['bajar-itp', 6],
    ['subir-smi', 15],
    ['subir-smi', 15],
    ['subir-smi', 15],
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
    'imprimir',
  ],
};

const anios = Number(process.argv[2]) || 20;
const pct = (v: number) => (v * 100).toFixed(1) + '%';
const n = (v: number) => Math.round(v).toLocaleString('es-ES');

for (const [nombre, plan] of Object.entries(ESTRATEGIAS)) {
  const e = crearEstado();
  const cola = [...plan];
  console.log(`\n=== ${nombre} ===`);
  console.log(
    'año  alojadas  añosCompra  alq/SMI  alquiler    precio   espera    ofAlq   ofVenta  obra/sem logran expuls  tens conf   IPC   gasto impreso  presión(Mad/Bcn/Mál/resto)',
  );
  for (let s = 0; s <= 52 * anios; s++) {
    if (e.decretoDisponible && cola.length) {
      const paso = cola.shift()!;
      if (paso === 'imprimir') {
        imprimir(e);
        e.decretoDisponible = false;
      } else {
        const [id, valor] =
          typeof paso === 'string' ? [paso, valorPorDefecto(DECRETO_POR_ID.get(paso)!)] : paso;
        if (!promulgar(e, [{ id, valor }])) console.log('  (no se pudo promulgar ' + id + ')');
      }
    }
    if (s % 104 === 0 || e.fin) {
      const f = crearResolver(e);
      const i = indicadores(e, f('impuesto.compra'));
      const ciudad = (id: string) =>
        Math.round(presion(e.ciudades.find((c) => c.id === id)!) * 100);
      console.log(
        [
          (s / 52).toFixed(0).padStart(3),
          pct(i.alojadas).padStart(8),
          i.aniosCompra.toFixed(2).padStart(10),
          pct(i.esfuerzoSmi).padStart(8),
          n(i.alquilerMercado).padStart(8),
          n(i.precioMedio).padStart(9),
          n(i.espera).padStart(9),
          n(i.ofAlquiler).padStart(8),
          n(i.ofVenta).padStart(9),
          n(i.flujos.construidas).padStart(8),
          n(i.flujos.logran).padStart(6),
          n(i.flujos.desahucios + i.flujos.noRenovados).padStart(6),
          e.tension.toFixed(0).padStart(5),
          e.confianza.toFixed(0).padStart(4),
          pct(f('inflacion.general')).padStart(6),
          n(e.gastoAnual).padStart(7),
          n(e.cartera.impreso).padStart(7),
          `  ${ciudad('madrid')}/${ciudad('barcelona')}/${ciudad('malaga')}/${ciudad('resto')}`,
        ].join(' '),
      );
    }
    if (e.fin) {
      console.log(`  → ${e.fin.toUpperCase()} en la semana ${e.semana} (${e.fecha.getFullYear()})`);
      break;
    }
    avanzarSemana(e);
  }
}
