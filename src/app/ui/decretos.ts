import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NOMBRE_CIUDAD } from '../sim/datos/ciudades';
import { DECRETOS, DECRETO_POR_ID, efectosDe, valorPorDefecto } from '../sim/datos/decretos';
import { FACTORES, type DefFactor } from '../sim/datos/factores';
import type { FuenteId } from '../sim/datos/fuentes';
import { costeLey } from '../sim/motor/gasto';
import { LEYES_POR_DECRETO, impedimento, incompatible, vigente } from '../sim/motor/motor';
import { SimService } from '../sim/sim.service';
import type { Cambio, Categoria, Decreto, Efecto } from '../sim/tipos';
import { NOMBRE_PROPIETARIO, num, valorFactor } from './formato';
import { FuenteIcono } from './fuente';

const CATEGORIAS: Categoria[] = [
  'Impuestos y dinero público',
  'Construir más',
  'Control de precios',
  'Reglas del alquiler',
  'Vivienda pública',
  'Quién busca casa',
];

/** Describe un efecto a partir de sus datos: así una ley nueva se explica sola. */
export function describirEfecto(
  ef: Efecto,
  ciudades: string[] = ef.ciudad ? [ef.ciudad] : [],
): { texto: string; bueno: boolean } {
  const def: DefFactor = FACTORES[ef.factor];
  let cambio: string;
  let sube: boolean;
  if (ef.op === 'mult') {
    sube = ef.valor > 0;
    cambio = (sube ? '+' : '−') + Math.round(Math.abs(ef.valor) * 100) + ' %';
  } else if (ef.op === 'suma') {
    sube = ef.valor > 0;
    const v = Math.abs(ef.valor);
    cambio =
      (sube ? '+' : '−') +
      (def.formato === 'pct'
        ? (v * 100).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' pt'
        : valorFactor(def, v).replace('×', ''));
  } else {
    sube = ef.op === 'suelo';
    cambio = (ef.op === 'tope' ? 'máx. ' : 'mín. ') + valorFactor(def, ef.valor);
  }
  const donde = ciudades.map((id) => NOMBRE_CIUDAD[id] ?? id);
  const ambito = [
    ef.propietario && NOMBRE_PROPIETARIO[ef.propietario].toLowerCase(),
    donde.length
      ? donde.length > 3
        ? `${donde.length} ciudades: ${donde.join(', ')}`
        : donde.join(', ')
      : '',
  ]
    .filter(Boolean)
    .join(' · ');
  const duracion = ef.semanas ? ` · ${Math.round(ef.semanas / 52)} años` : '';
  return {
    texto: `${def.nombre}${ambito ? ' (' + ambito + ')' : ''}: ${cambio}${duracion}`,
    bueno: sube !== !!def.inverso,
  };
}

/** Agrupa los efectos iguales que solo cambian de ciudad, para no repetir una línea por ciudad. */
export function describirEfectos(efectos: Efecto[]): { texto: string; bueno: boolean }[] {
  const grupos = new Map<string, { ef: Efecto; ciudades: string[] }>();
  for (const ef of efectos) {
    const clave = [ef.factor, ef.op, ef.valor, ef.propietario ?? '', ef.semanas ?? ''].join('|');
    const g = grupos.get(clave);
    if (g && ef.ciudad) g.ciudades.push(ef.ciudad);
    else
      grupos.set(ef.ciudad ? clave : clave + '|' + grupos.size, {
        ef,
        ciudades: ef.ciudad ? [ef.ciudad] : [],
      });
  }
  return [...grupos.values()].map((g) => describirEfecto(g.ef, g.ciudades));
}

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Valor de un parámetro con su unidad: «250 €/mes», «2 %». */
export function textoValor(d: Decreto, v: number): string {
  if (!d.parametro) return '';
  const n = Number.isInteger(v) ? num(v) : v.toLocaleString('es-ES', { maximumFractionDigits: 1 });
  return `${n} ${d.parametro.unidad}`;
}

function chip(d: Decreto): { texto: string; clase: string } {
  const { eco, soc } = d.ideologia;
  if (soc >= 2) return { texto: 'Restrictivo', clase: 'der' };
  if (soc <= -2) return { texto: 'Aperturista', clase: 'izq' };
  if (eco <= -2) return { texto: 'Intervención fuerte', clase: 'izq' };
  if (eco < 0) return { texto: 'Intervención', clase: 'izq' };
  if (eco >= 2) return { texto: 'Mercado fuerte', clase: 'der' };
  if (eco > 0) return { texto: 'Mercado', clase: 'der' };
  return { texto: 'Transversal', clase: '' };
}

/** Número en [0, 1) fijo para cada ley: el «azar» de su hoja no cambia al repintar. */
function azar(id: string, sal: number): number {
  let h = 2166136261 ^ sal;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

/** Cómo está doblada la hoja de una ley: giro, pliegues y esquina, como variables CSS. */
function papel(id: string): Record<string, string> {
  const esquina = azar(id, 6);
  const oreja = `${Math.round(10 + azar(id, 7) * 10)}px`;
  return {
    '--giro': `${(azar(id, 1) * 2.4 - 1.2).toFixed(2)}deg`,
    '--pliegue': `${Math.round(30 + azar(id, 2) * 40)}%`,
    '--ang': `${(177.5 + azar(id, 3) * 5).toFixed(1)}deg`,
    // Menos de la mitad de las hojas tienen además un pliegue vertical; el resto lo saca fuera.
    '--pv': azar(id, 4) < 0.45 ? `${Math.round(35 + azar(id, 5) * 30)}%` : '-50%',
    '--ang-v': `${(88 + azar(id, 8) * 4).toFixed(1)}deg`,
    '--oa': esquina < 0.4 ? oreja : '0px',
    '--ob': esquina >= 0.4 && esquina < 0.8 ? oreja : '0px',
  };
}
const PAPEL = new Map(DECRETOS.map((d) => [d.id, papel(d.id)]));

const textoCoste = (c: number) =>
  Math.abs(c) < 0.5 ? '' : c > 0 ? `Cuesta ≈ ${num(c)} M€/año` : `Recauda ≈ ${num(-c)} M€/año`;

@Component({
  selector: 'app-decretos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FuenteIcono],
  template: `
    <div class="aviso" [class.listo]="sim.estado().decretoDisponible">
      {{
        sim.estado().decretoDisponible
          ? 'Puedes promulgar un decreto este mes, con hasta ' + maxLeyes + ' cambios de ley.'
          : 'Decreto del mes ya promulgado. Avanza el tiempo hasta el mes siguiente.'
      }}
    </div>
    <p class="pie-nota">
      Cada ley tiene un ajuste: elige el valor y añádela. Si ya está en vigor, puedes cambiarla o
      derogarla. No hay niveles ni límites: la coherencia la pones tú. La intensidad de los efectos
      es un supuesto del modelo<app-fuente [ids]="fuenteEfectos" />
    </p>

    <section class="postura">
      <header>
        <span>Postura ideológica</span>
        <b>{{ sim.postura().etiqueta }}</b>
      </header>
      <div class="eje" title="Eje económico">
        <small>Estado</small>
        <div class="barra"><i [style.left.%]="50 + sim.postura().eco * 25"></i></div>
        <small>Mercado</small>
      </div>
      <div class="eje" title="Eje social">
        <small>Aperturista</small>
        <div class="barra"><i [style.left.%]="50 + sim.postura().soc * 25"></i></div>
        <small>Restrictivo</small>
      </div>
    </section>

    <input
      type="search"
      class="buscador"
      placeholder="Buscar leyes…"
      aria-label="Buscar leyes"
      [value]="busqueda()"
      (input)="busqueda.set($any($event.target).value)"
    />

    @for (g of grupos(); track g.categoria) {
      <section class="categoria" [class.abierta]="g.abierta">
        <button
          class="cabecera"
          [attr.aria-expanded]="g.abierta"
          (click)="alternarCategoria(g.categoria)"
        >
          <span class="pico" aria-hidden="true">{{ g.abierta ? '▾' : '▸' }}</span>
          <h3>{{ g.categoria }}</h3>
          @if (g.vigentes) {
            <span class="marca vig">{{ g.vigentes }} en vigor</span>
          }
          @if (g.elegidas) {
            <span class="marca">{{ g.elegidas }} en el decreto</span>
          }
          <small>{{ g.decretos.length }}</small>
        </button>
        <div class="guia" [attr.inert]="g.abierta ? null : ''">
          <div class="cajon">
            @for (d of g.decretos; track d.id) {
              <article
                [style]="d.papel"
                [style.--i]="$index"
                [class.vigente]="d.vigente !== null"
                [class.elegida]="d.cambio !== undefined"
                [class.derogar]="d.cambio === null"
              >
                @if (d.sello; as s) {
                  <span class="sello" [class]="s.clase" aria-hidden="true">{{ s.texto }}</span>
                }
                <header>
                  <strong>{{ d.titulo }}<app-fuente [ids]="d.fuentes" /></strong>
                  <span class="chip" [class]="d.chip.clase">{{ d.chip.texto }}</span>
                </header>
                <p>{{ d.descripcion }}</p>
                @if (d.parametro; as p) {
                  <div class="ajuste">
                    <label [for]="'v-' + d.id">{{ p.nombre }}</label>
                    <input
                      [id]="'v-' + d.id"
                      type="range"
                      [min]="p.min"
                      [max]="p.max"
                      [step]="p.paso"
                      [value]="d.valor"
                      (input)="fijarValor(d.id, $any($event.target).valueAsNumber)"
                    />
                    <span class="valor">
                      <input
                        type="number"
                        [min]="p.min"
                        [max]="p.max"
                        [step]="p.paso"
                        [value]="d.valor"
                        (change)="fijarValor(d.id, $any($event.target).valueAsNumber)"
                        [attr.aria-label]="p.nombre"
                      />
                      <small>{{ p.unidad }}</small>
                    </span>
                  </div>
                }
                <ul>
                  @if (d.nota) {
                    <li class="neutro">{{ d.nota }}</li>
                  }
                  @if (d.riesgo) {
                    <li class="neutro">{{ d.riesgo }}</li>
                  }
                  @for (ef of d.efectos; track $index) {
                    <li [class.bueno]="ef.bueno" [class.malo]="!ef.bueno">
                      <span class="flecha" aria-hidden="true">{{ ef.bueno ? '▲' : '▼' }}</span
                      >{{ ef.texto }}
                    </li>
                  }
                  @if (d.coste) {
                    <li class="coste">{{ d.coste }}</li>
                  }
                </ul>
                <footer>
                  <span>{{ d.estado }}</span>
                  <span class="botones">
                    @if (d.vigente !== null) {
                      <button
                        class="discreto"
                        [class.activo]="d.cambio === null"
                        [disabled]="d.cambio !== null && !!d.impedimentoDerogar"
                        [title]="d.impedimentoDerogar ?? ''"
                        (click)="alternar(d.id, null)"
                      >
                        {{ d.cambio === null ? 'No derogar' : 'Derogar' }}
                      </button>
                    }
                    <button
                      [class.activo]="d.cambio !== undefined && d.cambio !== null"
                      [disabled]="(d.cambio === undefined || d.cambio === null) && !!d.impedimento"
                      [title]="d.impedimento ?? ''"
                      (click)="alternar(d.id, d.valor)"
                    >
                      {{
                        d.cambio !== undefined && d.cambio !== null
                          ? 'Quitar del decreto'
                          : d.vigente !== null
                            ? d.repetible
                              ? 'Volver a aplicar'
                              : 'Cambiar'
                            : 'Añadir al decreto'
                      }}
                    </button>
                  </span>
                </footer>
              </article>
            }
          </div>
        </div>
      </section>
    } @empty {
      <p class="vacio">Ninguna ley coincide con «{{ busqueda() }}».</p>
    }

    <section class="decreto">
      <div class="pestanas">
        <header>
          <span>Decreto del mes</span>
          <b>{{ elegidas().length }} de {{ maxLeyes }} cambios</b>
        </header>
        <button
          class="historial"
          title="Ver todos los decretos promulgados"
          [attr.aria-expanded]="sim.historialAbierto()"
          (click)="sim.historialAbierto.set(true)"
        >
          Historial
          @if (decretosPromulgados(); as n) {
            <b>{{ n }}</b>
          }
        </button>
      </div>
      <div class="carpeta">
        @if (!sim.estado().decretoDisponible) {
          <span class="sello vigor" aria-hidden="true">Promulgado</span>
        }
        @for (c of elegidas(); track c.id) {
          <div class="ley">
            <span>{{ c.texto }}</span>
            <button
              class="discreto"
              [attr.aria-label]="'Quitar ' + c.texto"
              (click)="alternar(c.id, c.valor)"
            >
              ✕
            </button>
          </div>
        } @empty {
          <p class="hueco">
            {{
              sim.estado().decretoDisponible
                ? 'Carpeta vacía: aprueba hasta ' + maxLeyes + ' leyes para archivarlas aquí.'
                : 'Decreto archivado hasta el mes que viene.'
            }}
          </p>
        }
        @if (elegidas().length) {
          <small class="total" [class.mal]="costeDecreto() > 0" [class.bien]="costeDecreto() < 0">{{
            textoCosteDecreto()
          }}</small>
        }
        <button class="promulgar" [disabled]="!elegidas().length" (click)="promulgar()">
          Promulgar decreto
        </button>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: grid;
      gap: 10px;
      /* Grano de papel, compartido por hojas y carpeta. */
      --grano: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .14 0 0 0 .16 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .aviso {
      font-size: 12.5px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--superficie-2);
      color: var(--tinta-2);
    }
    .aviso.listo {
      background: color-mix(in srgb, var(--acento) 18%, transparent);
      color: var(--tinta);
    }
    .pie-nota {
      margin: 0;
      font-size: 11.5px;
      color: var(--tinta-3);
    }
    .postura {
      display: grid;
      gap: 6px;
      padding: 10px;
      border: 1px solid var(--borde);
      border-radius: 8px;
    }
    .postura header {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: var(--tinta-2);
    }
    .postura b {
      color: var(--tinta);
    }
    .eje {
      display: grid;
      grid-template-columns: 62px 1fr 62px;
      align-items: center;
      gap: 8px;
    }
    .eje small {
      font-size: 10.5px;
      color: var(--tinta-3);
    }
    .eje small:last-child {
      text-align: right;
    }
    .barra {
      position: relative;
      height: 4px;
      border-radius: 2px;
      background: var(--superficie-3);
    }
    .barra::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -3px;
      height: 10px;
      width: 1px;
      background: var(--borde-fuerte);
    }
    .barra i {
      position: absolute;
      top: -4px;
      width: 12px;
      height: 12px;
      margin-left: -6px;
      border-radius: 50%;
      background: var(--tinta);
      border: 2px solid var(--superficie);
      transition: left 0.3s;
    }
    .buscador {
      font: inherit;
      font-size: 12.5px;
      color: var(--tinta);
      background: var(--superficie-2);
      border: 1px solid var(--borde-fuerte);
      border-radius: 7px;
      padding: 6px 10px;
      width: 100%;
    }
    .buscador:focus-visible {
      outline: 2px solid var(--acento);
      outline-offset: 1px;
    }
    /* Archivador: la cabecera es el frente metálico del cajón y las leyes van dentro. */
    .categoria {
      display: grid;
    }
    .cabecera,
    .cabecera:hover:not(:disabled) {
      background: linear-gradient(#5d676f, #48525a 45%, #3b444b);
    }
    /* Se queda pegada arriba mientras se recorre su cajón. */
    .cabecera {
      position: sticky;
      top: var(--pegado, 0px);
      z-index: 4;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 9px 10px;
      text-align: left;
      color: #e8ecef;
      border: 1px solid #1c2024;
      border-radius: 4px;
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.2),
        inset 0 -2px 3px rgb(0 0 0 / 0.35),
        0 2px 3px rgb(0 0 0 / 0.5);
      transition:
        scale 0.2s,
        box-shadow 0.2s,
        filter 0.2s;
    }
    .cabecera:hover {
      filter: brightness(1.12);
    }
    /* Cajón abierto: el frente se adelanta. */
    .abierta .cabecera {
      scale: 1.015;
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.2),
        inset 0 -2px 3px rgb(0 0 0 / 0.35),
        0 8px 14px rgb(0 0 0 / 0.6);
    }
    /* Etiqueta de cartulina en su portaetiquetas. */
    .cabecera h3 {
      margin-right: auto;
      padding: 3px 8px;
      border: 2px solid #9aa4aa;
      border-radius: 2px;
      background: #f1ead6;
      color: #2a2419;
      font-family: 'Courier New', ui-monospace, monospace;
      box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.35);
    }
    /* Tirador cromado. */
    .cabecera::after {
      content: '';
      flex: none;
      width: 34px;
      height: 9px;
      margin-left: 4px;
      border-radius: 5px;
      background: linear-gradient(#eef1f3, #9ba5ab 50%, #6a737a);
      box-shadow: 0 2px 2px rgb(0 0 0 / 0.55);
    }
    .cabecera small {
      color: #c5ccd1;
    }
    .pico {
      width: 10px;
      color: #c5ccd1;
    }
    .marca {
      font-size: 10.5px;
      color: #bcd6ff;
    }
    .marca.vig {
      color: #a4e6a4;
    }
    /* La guía corre el cajón: de alto cero a su alto natural, y vuelta al cerrar. */
    .guia {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition:
        grid-template-rows 0.32s ease-in-out,
        visibility 0s 0.32s;
    }
    .abierta .guia {
      grid-template-rows: 1fr;
      visibility: visible;
      transition: grid-template-rows 0.32s ease-in-out;
    }
    .cajon {
      min-height: 0;
      overflow: hidden;
      display: grid;
      align-content: start;
      gap: 14px;
      margin: -3px 5px 0;
      padding: 0 10px;
      background: #131618;
      border: solid #4a545b;
      border-width: 0 3px;
      border-radius: 0 0 4px 4px;
      box-shadow: inset 0 12px 12px -6px #000;
      transition:
        padding 0.32s ease-in-out,
        border-width 0.32s ease-in-out;
    }
    .abierta .cajon {
      padding: 18px 10px 14px;
      border-width: 0 3px 3px;
    }
    @keyframes sacar {
      from {
        translate: 0 -14px;
        opacity: 0;
      }
    }
    .vacio {
      padding: 10px;
      text-align: center;
      color: var(--tinta-3);
    }
    /* Papel: las leyes y las hojas de la carpeta cambian la paleta a tinta sobre crema. */
    article,
    .ley {
      color-scheme: light;
      --tinta: #2a2419;
      --tinta-2: #4f4636;
      --tinta-3: #7d705a;
      --borde: #d8cdb0;
      --borde-fuerte: #b3a582;
      --superficie: #f4eedd;
      --superficie-2: #ebe3cc;
      --superficie-3: #e0d6ba;
      --acento: #2b5fa8;
      --bien: #1f7a2e;
      --mal: #b3322b;
      --eje-izq: #b03a6c;
      --eje-der: #5a4bc0;
      color: var(--tinta);
      font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
    }
    .ley {
      background: var(--grano), var(--superficie);
      border-radius: 2px;
      box-shadow:
        0 1px 2px rgb(0 0 0 / 0.4),
        0 4px 10px rgb(0 0 0 / 0.25);
    }
    article {
      position: relative;
      isolation: isolate;
      display: grid;
      gap: 6px;
      padding: 14px 14px 10px;
    }
    /* Las hojas salen una tras otra cada vez que se abre el cajón. */
    .abierta article {
      animation: sacar 0.3s ease-out backwards;
      animation-delay: calc(min(var(--i), 8) * 35ms);
    }
    /* La ventana de fuentes de una hoja debe quedar por encima de las hojas siguientes. */
    article:has([aria-expanded='true']) {
      z-index: 5;
    }
    /*
      La hoja se dibuja detrás del texto: así puede girarse sin emborronar la letra ni
      descolocar la ventana de fuentes (position: fixed). Giro, pliegues y esquina doblada
      salen de variables fijadas por ley.
    */
    article::before,
    article::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      rotate: var(--giro);
      transition:
        scale 0.2s,
        translate 0.2s,
        opacity 0.2s;
    }
    article::before {
      border-radius: 2px;
      clip-path: polygon(
        var(--oa) 0,
        100% 0,
        100% 100%,
        var(--ob) 100%,
        0 calc(100% - var(--ob)),
        0 var(--oa)
      );
      background:
        /* Esquinas dobladas. */
        linear-gradient(135deg, transparent 50%, rgb(0 0 0 / 0.25) 50%, #ddd2b3 58%, #f0e8d2) 0 0 /
          var(--oa) var(--oa) no-repeat,
        linear-gradient(45deg, transparent 50%, rgb(0 0 0 / 0.25) 50%, #ddd2b3 58%, #f0e8d2) 0
          100% / var(--ob) var(--ob) no-repeat,
        /* Pliegue horizontal: sombra antes, brillo después y la mitad de abajo algo más oscura. */
        linear-gradient(
            var(--ang),
            transparent calc(var(--pliegue) - 22%),
            rgb(0 0 0 / 0.09) calc(var(--pliegue) - 0.5px),
            rgb(60 40 10 / 0.32) var(--pliegue),
            rgb(255 255 255 / 0.6) calc(var(--pliegue) + 1px),
            rgb(0 0 0 / 0.045) calc(var(--pliegue) + 16%)
          ),
        /* Pliegue vertical, solo en algunas hojas. */
        linear-gradient(
            var(--ang-v),
            transparent calc(var(--pv) - 14%),
            rgb(0 0 0 / 0.07) calc(var(--pv) - 0.5px),
            rgb(60 40 10 / 0.24) var(--pv),
            rgb(255 255 255 / 0.5) calc(var(--pv) + 1px),
            transparent calc(var(--pv) + 12%)
          ),
        /* Margen rojo de folio. */
        linear-gradient(90deg, transparent 7px, rgb(179 50 43 / 0.35) 7px 8px, transparent 8px),
        var(--grano),
        var(--superficie);
    }
    /* Sombra aparte: el recorte de la esquina se llevaría un box-shadow. */
    article::after {
      z-index: -2;
      background: #000;
      opacity: 0.55;
      filter: blur(5px);
      translate: 0 3px;
    }
    article.elegida::before {
      scale: 1.012;
    }
    article.elegida::after {
      scale: 1.02;
      translate: 0 8px;
      opacity: 0.7;
    }
    .sello {
      position: absolute;
      top: 30px;
      right: 12px;
      z-index: 1;
      padding: 2px 9px;
      border: 2px solid currentColor;
      border-radius: 4px;
      outline: 1px solid currentColor;
      outline-offset: 2px;
      font:
        700 13px/1.3 system-ui,
        sans-serif;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--mal);
      opacity: 0.8;
      rotate: -11deg;
      mix-blend-mode: multiply;
      pointer-events: none;
      /* Tinta irregular. */
      -webkit-mask-image: repeating-linear-gradient(115deg, #000 0 5px, rgb(0 0 0 / 0.65) 5px 6px);
      mask-image: repeating-linear-gradient(115deg, #000 0 5px, rgb(0 0 0 / 0.65) 5px 6px);
      animation: sellar 0.28s cubic-bezier(0.3, 1.4, 0.5, 1);
    }
    .sello.vigor {
      color: var(--bien);
      rotate: -7deg;
    }
    @keyframes sellar {
      from {
        scale: 2.6;
        opacity: 0;
      }
      70% {
        scale: 0.94;
      }
    }
    @keyframes archivar {
      from {
        translate: 0 -18px;
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sello,
      .ley,
      .abierta article {
        animation: none;
      }
      .guia,
      .abierta .guia,
      .cajon,
      .cabecera,
      article::before,
      article::after {
        transition: none;
      }
    }
    button.activo {
      background: var(--acento);
      border-color: var(--acento);
      color: #fff;
    }
    .derogar button.discreto.activo {
      background: var(--mal);
      border-color: var(--mal);
    }
    .ajuste {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4px 8px;
      align-items: center;
      font-size: 11.5px;
      color: var(--tinta-2);
    }
    .ajuste label {
      grid-column: 1 / -1;
    }
    .ajuste input[type='range'] {
      width: 100%;
      accent-color: var(--acento);
      margin: 0;
    }
    .valor {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
    }
    .valor input {
      width: 64px;
      font: inherit;
      font-size: 12px;
      color: var(--tinta);
      background: var(--superficie-2);
      border: 1px solid var(--borde-fuerte);
      border-radius: 6px;
      padding: 2px 6px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .valor small {
      color: var(--tinta-3);
      font-size: 11px;
      white-space: nowrap;
    }
    /* Carpeta de archivo: pestaña arriba y las hojas aprobadas dentro. */
    .decreto {
      position: sticky;
      bottom: var(--pegado-abajo, 0px);
      z-index: 2;
      display: grid;
      justify-items: start;
      color-scheme: light;
      --tinta: #2e2413;
      --tinta-2: #54452a;
      --tinta-3: #5f4f31;
      --bien: #1e6a28;
      --mal: #9c241e;
      --carpeta: #d6b470;
      color: var(--tinta);
      filter: drop-shadow(0 -3px 8px rgb(0 0 0 / 0.5));
    }
    .pestanas {
      display: flex;
      width: 95%;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      gap: 3px;
    }
    .decreto header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding: 4px 12px 3px;
      border-radius: 8px 8px 0 0;
      background: color-mix(in srgb, var(--carpeta) 88%, #000);
      font-size: 12px;
      color: var(--tinta-2);
    }
    /* Pestañita de otra carpeta, más baja y más oscura: abre el historial de decretos. */
    .historial,
    .historial:hover:not(:disabled) {
      background: color-mix(in srgb, var(--carpeta) 68%, #000);
    }
    .historial {
      display: flex;
      align-items: baseline;
      gap: 6px;
      padding: 2px 9px 1px;
      border: 0;
      border-radius: 7px 7px 0 0;
      font-size: 11px;
      color: var(--tinta);
    }
    .historial:hover {
      filter: brightness(1.12);
    }
    .decreto b {
      color: var(--tinta);
    }
    .carpeta {
      position: relative;
      justify-self: stretch;
      display: grid;
      gap: 6px;
      padding: 10px;
      border-radius: 0 8px 8px 8px;
      border-top: 1px solid rgb(255 255 255 / 0.4);
      background:
        var(--grano), linear-gradient(var(--carpeta), color-mix(in srgb, var(--carpeta) 90%, #000));
      box-shadow: inset 0 -3px 0 rgb(0 0 0 / 0.12);
    }
    .carpeta .sello {
      top: 8px;
      right: 14px;
    }
    .ley {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 5px 4px 5px 10px;
      font-size: 12px;
      rotate: -0.6deg;
      animation: archivar 0.25s ease-out;
    }
    .ley:nth-of-type(2) {
      rotate: 0.5deg;
      margin-left: 6px;
    }
    .ley:nth-of-type(3) {
      rotate: -0.2deg;
      margin-right: 6px;
    }
    .ley button {
      padding: 0 6px;
    }
    .hueco {
      padding: 8px;
      border: 1px dashed var(--tinta-3);
      border-radius: 4px;
      text-align: center;
      font-size: 11.5px;
    }
    .total {
      font-size: 11.5px;
      color: var(--tinta-2);
    }
    .total.mal {
      color: var(--mal);
    }
    .total.bien {
      color: var(--bien);
    }
    .promulgar {
      background: #8c2a22;
      border-color: #6f1f19;
      color: #fff;
      padding: 7px 10px;
    }
    .promulgar:hover:not(:disabled) {
      background: #a2362c;
    }
    article header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    article strong {
      font-size: 13px;
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--tinta-2);
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 2px;
      font-size: 11.5px;
      color: var(--tinta-2);
    }
    ul li {
      padding-left: 14px;
      position: relative;
    }
    .flecha {
      position: absolute;
      left: 0;
      top: 3px;
      font-size: 8px;
    }
    .bueno .flecha {
      color: var(--bien);
    }
    .malo .flecha {
      color: var(--mal);
    }
    li.coste {
      color: var(--tinta);
      font-weight: 500;
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--tinta-3);
    }
    .botones {
      display: inline-flex;
      gap: 6px;
    }
    .chip {
      flex: none;
      font-size: 10.5px;
      padding: 2px 7px;
      border-radius: 99px;
      border: 1px solid var(--borde-fuerte);
      color: var(--tinta-2);
    }
    .chip.izq {
      border-color: var(--eje-izq);
      color: var(--eje-izq);
    }
    .chip.der {
      border-color: var(--eje-der);
      color: var(--eje-der);
    }
  `,
})
export class Decretos {
  protected readonly fuenteEfectos: FuenteId = 'supuestoDecretos';
  protected readonly sim = inject(SimService);

  protected readonly maxLeyes = LEYES_POR_DECRETO;
  /** Decretos promulgados (un decreto puede cambiar varias leyes a la vez). */
  protected readonly decretosPromulgados = computed(
    () => new Set(this.sim.estado().decretosPromulgados.map((d) => d.semana)).size,
  );
  protected readonly busqueda = signal('');
  private readonly abiertas = signal<ReadonlySet<Categoria>>(new Set());
  /** Valor del deslizador de cada ley; si no se ha tocado, el que esté en vigor o el de por defecto. */
  private readonly valores = signal<Readonly<Record<string, number>>>({});
  private readonly seleccion = signal<Cambio[]>([]);

  private valorDe(d: Decreto): number {
    return this.valores()[d.id] ?? vigente(this.sim.estado(), d.id) ?? valorPorDefecto(d);
  }

  /** Cambios elegidos para el decreto que siguen pudiendo aplicarse. */
  protected readonly elegidas = computed(() => {
    const e = this.sim.estado();
    return this.seleccion()
      .filter((c) => !impedimento(e, DECRETO_POR_ID.get(c.id)!, c.valor))
      .map((c) => {
        const d = DECRETO_POR_ID.get(c.id)!;
        return {
          ...c,
          texto:
            c.valor === null
              ? `Derogar: ${d.titulo}`
              : d.parametro
                ? `${d.titulo}: ${textoValor(d, c.valor)}`
                : d.titulo,
        };
      });
  });

  /** Diferencia de gasto anual (M€ de hoy) entre lo que hay en vigor y lo que se va a promulgar. */
  protected readonly costeDecreto = computed(() => {
    const e = this.sim.estado();
    const ctx = this.sim.ctx();
    let total = 0;
    for (const c of this.elegidas()) {
      const actual = vigente(e, c.id);
      total +=
        (c.valor === null ? 0 : costeLey(c.id, c.valor, ctx, e.nivelPrecios)) -
        (actual === null ? 0 : costeLey(c.id, actual, ctx, e.nivelPrecios));
    }
    return total / e.nivelPrecios;
  });
  protected readonly textoCosteDecreto = computed(() => {
    const c = this.costeDecreto();
    const saldo = this.sim.estado().cartera.saldo;
    if (Math.abs(c) < 0.5) return 'No cambia el gasto anual.';
    return (
      (c > 0
        ? `El gasto anual sube ≈ ${num(c)} M€ (${num(c / 12)} M€ al mes)`
        : `El gasto anual baja ≈ ${num(-c)} M€`) +
      (saldo < 0 ? ' · la cartera está en números rojos' : '')
    );
  });

  protected readonly grupos = computed(() => {
    const e = this.sim.estado();
    const ctx = this.sim.ctx();
    const consulta = normalizar(this.busqueda().trim());
    const seleccion = this.elegidas();
    const abiertas = this.abiertas();
    return CATEGORIAS.map((categoria) => {
      const decretos = DECRETOS.filter((d) => d.categoria === categoria)
        .map((d) => {
          const valor = this.valorDe(d);
          const vig = vigente(e, d.id);
          const cambio = seleccion.find((c) => c.id === d.id);
          const otros = seleccion.filter((c) => c.id !== d.id);
          const efectos = describirEfectos(efectosDe(d, valor, e));
          const nota = d.notaInmediata?.(valor);
          const coste = textoCoste(costeLey(d.id, valor, ctx, e.nivelPrecios) / e.nivelPrecios);
          const fila = {
            id: d.id,
            titulo: d.titulo,
            descripcion: d.descripcion,
            fuentes: d.fuentes,
            chip: chip(d),
            papel: PAPEL.get(d.id)!,
            parametro: d.parametro,
            repetible: !!d.repetible,
            valor,
            vigente: vig,
            estado:
              vig === null ? '' : d.parametro ? `En vigor: ${textoValor(d, vig)}` : 'En vigor',
            nota,
            riesgo: d.riesgoLegal
              ? `Los tribunales pueden anularla a los dos o tres años (${Math.round(d.riesgoLegal * 100)} % de probabilidad)`
              : '',
            efectos,
            coste,
            /** undefined: no está en el decreto · null: se deroga · número: se fija a ese valor. */
            cambio: cambio ? cambio.valor : undefined,
            sello: cambio
              ? cambio.valor === null
                ? { texto: 'Derogar', clase: '' }
                : { texto: 'Aprobado', clase: '' }
              : vig !== null
                ? { texto: 'En vigor', clase: 'vigor' }
                : null,
            impedimento: impedimento(e, d, valor) ?? incompatible(d, otros),
            impedimentoDerogar:
              impedimento(e, d, null) ??
              (otros.length >= LEYES_POR_DECRETO
                ? `Un decreto cambia como máximo ${LEYES_POR_DECRETO} leyes`
                : null),
          };
          const buscable = normalizar(
            [
              d.titulo,
              d.descripcion,
              categoria,
              nota ?? '',
              fila.chip.texto,
              ...efectos.map((x) => x.texto),
            ].join(' '),
          );
          return { fila, buscable };
        })
        .filter((x) => !consulta || x.buscable.includes(consulta))
        .map((x) => x.fila);
      return {
        categoria,
        decretos,
        vigentes: decretos.filter((d) => d.vigente !== null).length,
        elegidas: decretos.filter((d) => d.cambio !== undefined).length,
        // Al buscar se despliegan las categorías con resultados.
        abierta: consulta ? true : abiertas.has(categoria),
      };
    }).filter((g) => g.decretos.length);
  });

  protected alternarCategoria(categoria: Categoria) {
    if (this.busqueda().trim()) return;
    // Solo un cajón abierto a la vez: abrir uno cierra el anterior.
    this.abiertas.update((s) => new Set(s.has(categoria) ? [] : [categoria]));
  }

  protected fijarValor(id: string, v: number) {
    const d = DECRETO_POR_ID.get(id);
    if (!d?.parametro || !Number.isFinite(v)) return;
    const p = d.parametro;
    const ajustado = Math.min(p.max, Math.max(p.min, Math.round(v / p.paso) * p.paso));
    this.valores.update((s) => ({ ...s, [id]: Number(ajustado.toFixed(6)) }));
    // Si la ley ya estaba en el decreto, el decreto recoge el valor nuevo.
    this.seleccion.update((s) =>
      s.map((c) => (c.id === id && c.valor !== null ? { id, valor: ajustado } : c)),
    );
  }

  /** Añade o quita un cambio del decreto: fijar la ley al valor dado, o derogarla (null). */
  protected alternar(id: string, valor: number | null) {
    const actual = this.elegidas().map(({ id, valor }) => ({ id, valor }));
    const ya = actual.find((c) => c.id === id);
    if (ya && (ya.valor === null) === (valor === null))
      this.seleccion.set(actual.filter((c) => c.id !== id));
    else this.seleccion.set([...actual.filter((c) => c.id !== id), { id, valor }]);
  }

  protected promulgar() {
    if (this.sim.promulgar(this.elegidas().map(({ id, valor }) => ({ id, valor })))) {
      this.seleccion.set([]);
      this.valores.set({});
    }
  }
}
