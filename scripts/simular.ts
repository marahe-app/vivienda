/**
 * Banco de pruebas del motor, sin interfaz: `npm run simular [años]`.
 * Ejecuta varias estrategias y muestra la evolución de los tres objetivos, la tensión y la cartera,
 * con todos los importes en euros de inicio (descontada la inflación).
 * Las estrategias son las de datos/estrategias.ts (las mismas de la pestaña «Estrategias»): un paso por mes.
 * La tabla usa la semilla de azar 1; después repite cada estrategia con varias semillas.
 * Al final pasa unas comprobaciones automáticas; si alguna falla, el proceso termina con error.
 */
import { avanzarSemana, crearEstado, imprimir, promulgar } from '../src/app/sim/motor/motor';
import { indicadores, presion, viviendas } from '../src/app/sim/motor/indicadores';
import { crearResolver } from '../src/app/sim/motor/modificadores';
import { ayudaAlquiler } from '../src/app/sim/motor/reglas/economia';
import { DECRETOS } from '../src/app/sim/datos/decretos';
import { ESTRATEGIAS, cambioDe, type Paso } from '../src/app/sim/datos/estrategias';
import type { Estado } from '../src/app/sim/tipos';

/** Las de la pestaña «Estrategias», más la partida sin tocar nada. */
const PLANES: Record<string, Paso[]> = {
  'sin decretos': [],
  ...Object.fromEntries(ESTRATEGIAS.map((x) => [x.nombre.toLowerCase(), x.pasos])),
};

const anios = Number(process.argv[2]) || 20;
const pct = (v: number) => (v * 100).toFixed(1) + '%';
const n = (v: number) => Math.round(v).toLocaleString('es-ES');

const medir = (e: Estado) => {
  const f = crearResolver(e);
  return { f, i: indicadores(e, f('impuesto.compra'), ayudaAlquiler(e, f)) };
};
const parque = (e: Estado) => e.ciudades.reduce((s, c) => s + viviendas(c), 0);

interface Resultado {
  fin: Estado['fin'];
  motivoFin: Estado['motivoFin'];
  semanaFin: number;
  /** Viviendas que aparecen o desaparecen sin haberse construido. */
  descuadre: number;
  ipcMax: number;
  finito: boolean;
  noPromulgadas: string[];
}

/** Juega una partida aplicando un paso por mes. `cada` recibe el estado en cada semana, antes de avanzar. */
function jugar(
  plan: Paso[],
  semanas: number,
  cada?: (e: Estado, s: number) => void,
  semilla = 1,
): Resultado {
  const e = crearEstado(semilla);
  const cola = [...plan];
  const inicial = parque(e);
  const r: Resultado = {
    fin: null,
    motivoFin: undefined,
    semanaFin: 0,
    descuadre: 0,
    ipcMax: 0,
    finito: true,
    noPromulgadas: [],
  };
  for (let s = 0; s <= semanas; s++) {
    if (e.decretoDisponible && cola.length) {
      const cambio = cambioDe(cola.shift()!);
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
    r.ipcMax = Math.max(r.ipcMax, f('inflacion.general'));
    r.finito &&= [i.alojadas, i.aniosCompra, i.esfuerzoSmi, e.nivelPrecios, e.cartera.deuda].every(
      Number.isFinite,
    );
    avanzarSemana(e);
  }
  r.descuadre = parque(e) - inicial - e.contadores.construidas;
  return r;
}

// ── Estrategias ──────────────────────────────────────────────────────────────
const resultados: Record<string, Resultado> = {};
for (const [nombre, plan] of Object.entries(PLANES)) {
  console.log(`\n=== ${nombre} ===`);
  console.log(
    'año  alojadas  añosCompra  alq/SMI  alqMercado  alqPagado    precio   espera  obra/sem llegan logran expuls  tens conf   IPC   gasto ingres   deuda  presión(Mad/Bcn/Mál/resto)',
  );
  let anunciado = false;
  const r = jugar(plan, 52 * anios, (e, s) => {
    const fin = !!e.fin && !anunciado;
    if (s % 104 === 0 || fin) {
      const { f, i } = medir(e);
      const real = (v: number) => n(v / e.nivelPrecios);
      const ayuda = ayudaAlquiler(e, f);
      const ciudad = (id: string) =>
        Math.round(
          presion(
            e.ciudades.find((c) => c.id === id)!,
            ayuda,
          ) * 100,
        );
      console.log(
        [
          (s / 52).toFixed(0).padStart(3),
          pct(i.alojadas).padStart(8),
          i.aniosCompra.toFixed(2).padStart(10),
          pct(i.esfuerzoSmi).padStart(8),
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
          pct(f('inflacion.general')).padStart(6),
          real(e.gastoAnual).padStart(7),
          real(e.ingresosAnual).padStart(6),
          real(e.cartera.deuda).padStart(7),
          `  ${ciudad('madrid')}/${ciudad('barcelona')}/${ciudad('malaga')}/${ciudad('resto')}`,
        ].join(' '),
      );
    }
    if (fin) {
      anunciado = true;
      console.log(
        `  → ${e.fin!.toUpperCase()} en la semana ${e.semana} (${e.fecha.getFullYear()})`,
      );
    }
  });
  for (const id of r.noPromulgadas) console.log('  (no se pudo promulgar ' + id + ')');
  resultados[nombre] = r;
}

// ── Comprobaciones ───────────────────────────────────────────────────────────
console.log('\n=== comprobaciones ===');
const fallos: string[] = [];
function comprobar(ok: boolean, texto: string, detalle = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${texto}${detalle ? ' — ' + detalle : ''}`);
  if (!ok) fallos.push(texto);
}

const inicio = crearEstado();
comprobar(
  inicio.tension >= 50 && inicio.tension <= 70,
  'La partida arranca con tensión entre 50 y 70',
  inicio.tension.toFixed(0),
);

// La misma estrategia con distintas semillas de azar (otra coyuntura, otras sentencias de los tribunales).
const SEMILLAS = 16;
const ANIOS_AZAR = 28;
console.log(`\n=== con ${SEMILLAS} semillas de azar, a ${ANIOS_AZAR} años ===`);
const victorias: Record<string, number> = {};
for (const [nombre, plan] of Object.entries(PLANES)) {
  const rs = Array.from({ length: SEMILLAS }, (_, k) =>
    jugar(plan, 52 * ANIOS_AZAR, undefined, k + 1),
  );
  const cuenta = (ok: (r: Resultado) => boolean) => rs.filter(ok).length;
  const ganadas = rs.filter((r) => r.fin === 'victoria').map((r) => r.semanaFin / 52);
  victorias[nombre] = ganadas.length;
  console.log(
    `  ${nombre.padEnd(22)} ${String(ganadas.length).padStart(2)} victorias` +
      (ganadas.length
        ? ` (años ${Math.min(...ganadas).toFixed(0)}-${Math.max(...ganadas).toFixed(0)})`
        : '') +
      ` · ${cuenta((r) => r.motivoFin === 'elecciones')} elecciones perdidas` +
      ` · ${cuenta((r) => r.motivoFin === 'tension')} estallidos` +
      ` · ${cuenta((r) => !r.fin)} sin final`,
  );
}
console.log('');
comprobar(victorias['sin decretos'] === 0, 'Sin decretos no se gana con ninguna semilla');
comprobar(
  victorias['equilibrada'] >= SEMILLAS * 0.75,
  'Se puede ganar: «equilibrada» lo logra con al menos tres de cada cuatro semillas',
  `${victorias['equilibrada']} de ${SEMILLAS}`,
);

const lista = Object.entries(resultados);
const peor = (clave: 'descuadre' | 'ipcMax') =>
  lista.reduce((a, b) => (Math.abs(b[1][clave]) > Math.abs(a[1][clave]) ? b : a));
const [nombreDescuadre, { descuadre }] = peor('descuadre');
comprobar(
  Math.abs(descuadre) < 1,
  'La contabilidad cuadra: el parque crece lo que se construye',
  `mayor descuadre ${descuadre.toFixed(3)} viviendas (${nombreDescuadre})`,
);
comprobar(
  lista.every(([, r]) => r.finito),
  'Ningún indicador deja de ser un número en las estrategias',
);
const [nombreIpc, { ipcMax }] = peor('ipcMax');
comprobar(
  ipcMax < 0.25,
  'La inflación no se dispara en las estrategias',
  `máximo ${pct(ipcMax)} (${nombreIpc})`,
);

// Cada ley por separado, con su valor mínimo, por defecto y máximo (las repetibles, doce veces seguidas).
const ANIOS_SOLA = 15;
const ganan: string[] = [];
const rotas: string[] = [];
let ipcSola = { valor: 0, ley: '' };
for (const d of DECRETOS) {
  const valores = d.parametro
    ? [...new Set([d.parametro.min, d.parametro.defecto, d.parametro.max])]
    : [1];
  for (const v of valores) {
    const plan: Paso[] = Array(d.repetible ? 12 : 1).fill([d.id, v]);
    const r = jugar(plan, 52 * ANIOS_SOLA);
    const ley = `${d.id}=${v}`;
    if (r.fin === 'victoria') ganan.push(ley);
    if (!r.finito || Math.abs(r.descuadre) >= 1 || r.noPromulgadas.length) rotas.push(ley);
    if (r.ipcMax > ipcSola.valor) ipcSola = { valor: r.ipcMax, ley };
  }
}
comprobar(!ganan.length, `Ninguna ley gana sola en ${ANIOS_SOLA} años`, ganan.join(', '));
comprobar(
  !rotas.length,
  'Ninguna ley sola descuadra la contabilidad ni rompe un indicador',
  rotas.join(', '),
);
comprobar(
  ipcSola.valor < 0.5,
  'Ninguna ley sola lleva la inflación al 50 %',
  `máximo ${pct(ipcSola.valor)} (${ipcSola.ley})`,
);

if (fallos.length) {
  console.log(`\n${fallos.length} comprobación(es) fallida(s).`);
  process.exitCode = 1;
}
