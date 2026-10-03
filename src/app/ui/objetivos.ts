import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { FuenteId } from '../sim/datos/fuentes';
import { PARAMETROS as P } from '../sim/datos/parametros';
import { SimService } from '../sim/sim.service';
import type { PuntoHistorial } from '../sim/tipos';
import { dec, pct, tendencia } from './formato';
import { FuenteIcono } from './fuente';

type Clave = 'alojadas' | 'aniosCompra' | 'esfuerzoSmi';
interface Def {
  clave: Clave;
  titulo: string;
  meta: number;
  textoMeta: string;
  /** true si hay que quedar por debajo de la meta. */
  menorEsMejor: boolean;
  fmt: (v: number) => string;
  fuentes: FuenteId[];
}

const DEFS: Def[] = [
  {
    clave: 'alojadas',
    titulo: 'Familias con vivienda',
    meta: P.objetivos.alojadas,
    textoMeta: 'al menos ' + pct(P.objetivos.alojadas, 0),
    menorEsMejor: false,
    fmt: (v) => pct(v),
    fuentes: ['hogares', 'deficit', 'objetivos'],
  },
  {
    clave: 'aniosCompra',
    titulo: 'Comprar: años de renta del hogar medio',
    meta: P.objetivos.aniosCompra,
    textoMeta: 'como mucho ' + P.objetivos.aniosCompra + ' años',
    menorEsMejor: true,
    fmt: (v) => dec(v) + ' años',
    fuentes: [
      'precioVenta',
      'superficieVenta',
      'rentaHogar',
      'impuestoCompra',
      'esfuerzoBde',
      'objetivos',
    ],
  },
  {
    clave: 'esfuerzoSmi',
    titulo: 'Alquiler medio sobre el salario mínimo',
    meta: P.objetivos.esfuerzoSmi,
    textoMeta: 'como mucho ' + pct(P.objetivos.esfuerzoSmi, 0),
    menorEsMejor: true,
    fmt: (v) => pct(v),
    fuentes: ['precioAlquiler', 'superficieAlquiler', 'smi', 'esfuerzoAlquiler', 'objetivos'],
  },
];

const W = 220;
const H = 56;

@Component({
  selector: 'app-objetivos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FuenteIcono],
  template: `
    <h2>Objetivos</h2>
    @for (o of objetivos(); track o.clave) {
      <article [class.cumplido]="o.cumple">
        <header>
          <span>{{ o.titulo }}<app-fuente [ids]="o.fuentes" /></span>
          <em>{{ o.cumple ? '✓ Conseguido' : 'Meta: ' + o.textoMeta }}</em>
        </header>
        <div class="cifra">
          <strong>{{ o.valor }}</strong
          ><span class="tendencia" [class]="o.tendencia.tono">{{ o.tendencia.texto }}</span>
        </div>
        <div class="grafica" (mousemove)="mover($event, o.clave)" (mouseleave)="cursor.set(null)">
          <svg [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none">
            <line class="meta" x1="0" [attr.x2]="w" [attr.y1]="o.yMeta" [attr.y2]="o.yMeta" />
            <path class="linea" [attr.d]="o.d" />
            @if (o.marca; as m) {
              <line class="guia" [attr.x1]="m.x" [attr.x2]="m.x" y1="0" [attr.y2]="h" />
            }
          </svg>
          @if (o.marca; as m) {
            <div
              class="punto"
              [style.left.%]="(m.x / w) * 100"
              [style.top.%]="(m.y / h) * 100"
            ></div>
            <div class="lectura" [class.izq]="m.x > w / 2" [style.left.%]="(m.x / w) * 100">
              {{ m.texto }}
            </div>
          }
        </div>
      </article>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 10px;
    }
    article {
      display: grid;
      gap: 2px;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 12px;
      color: var(--tinta-2);
      align-items: baseline;
    }
    em {
      font-style: normal;
      color: var(--tinta-3);
      font-size: 11px;
      white-space: nowrap;
    }
    .cumplido em {
      color: var(--bien);
    }
    .cifra {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    strong {
      font-size: 24px;
      font-weight: 650;
      line-height: 1.15;
    }
    .grafica {
      position: relative;
      height: 44px;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }
    .linea {
      fill: none;
      stroke: var(--serie-1);
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
    }
    .meta {
      stroke: var(--tinta-3);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
    }
    .cumplido .meta {
      stroke: var(--bien);
    }
    .guia {
      stroke: var(--borde-fuerte);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .punto {
      position: absolute;
      width: 8px;
      height: 8px;
      margin: -4px;
      border-radius: 50%;
      background: var(--serie-1);
      box-shadow: 0 0 0 2px var(--superficie);
      pointer-events: none;
    }
    .lectura {
      position: absolute;
      top: -4px;
      transform: translateX(6px);
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--superficie-3);
      border: 1px solid var(--borde-fuerte);
      white-space: nowrap;
      pointer-events: none;
    }
    .lectura.izq {
      transform: translateX(calc(-100% - 6px));
    }
  `,
})
export class Objetivos {
  private readonly sim = inject(SimService);
  protected readonly w = W;
  protected readonly h = H;
  protected readonly cursor = signal<{ clave: Clave; t: number } | null>(null);

  protected readonly objetivos = computed(() => {
    const hist = this.sim.estado().historial;
    const ind = this.sim.ind();
    const cursor = this.cursor();
    return DEFS.map((def) => {
      const actual = ind[def.clave];
      const serie = hist.map((p) => p[def.clave]);
      const min = Math.min(def.meta, actual, ...serie);
      const max = Math.max(def.meta, actual, ...serie);
      const margen = (max - min) * 0.12 || 0.01;
      const y = (v: number) => H - ((v - (min - margen)) / (max - min + 2 * margen)) * H;
      const x = (i: number) => (serie.length > 1 ? (i / (serie.length - 1)) * W : 0);
      const d =
        serie.length > 1
          ? serie.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
          : '';
      let marca: { x: number; y: number; texto: string } | null = null;
      if (cursor?.clave === def.clave && serie.length > 1) {
        const i = Math.round(cursor.t * (serie.length - 1));
        marca = { x: x(i), y: y(serie[i]), texto: `${fecha(hist[i])}: ${def.fmt(serie[i])}` };
      }
      return {
        ...def,
        valor: def.fmt(actual),
        tendencia: tendencia(
          serie[0] ?? actual,
          actual,
          def.clave === 'aniosCompra' ? 'relativa' : 'puntosPct',
          def.menorEsMejor ? -1 : 1,
        ),
        cumple: def.menorEsMejor ? actual <= def.meta : actual >= def.meta,
        yMeta: y(def.meta),
        d,
        marca,
      };
    });
  });

  protected mover(ev: MouseEvent, clave: Clave) {
    const caja = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.cursor.set({ clave, t: Math.max(0, Math.min(1, (ev.clientX - caja.left) / caja.width)) });
  }
}

function fecha(p: PuntoHistorial): string {
  const d = new Date(new Date(P.fechaInicio).getTime() + p.semana * 7 * 86_400_000);
  return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}
