import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { PARAMETROS as P } from '../sim/datos/parametros';
import { SimService } from '../sim/sim.service';
import { num, tendencia, type Unidad } from './formato';
import { hitoCercano, hitosDecretos } from './hitos';

const W = 200;
const H = 28;

/** Gráfica temporal mínima de una sola serie: la línea, el nivel de partida y la lectura al pasar el ratón. */
@Component({
  selector: 'app-mini-serie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tendencia" [class]="t().tono">{{ t().texto }}</span>
    <div
      class="plano"
      [class]="t().tono"
      (mousemove)="mover($event)"
      (mouseleave)="cursor.set(null)"
    >
      <svg [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none" aria-hidden="true">
        <line class="inicio" x1="0" [attr.x2]="w" [attr.y1]="g().yInicio" [attr.y2]="g().yInicio" />
        @for (x of g().hitos; track x) {
          <line class="hito" [attr.x1]="x" [attr.x2]="x" y1="0" [attr.y2]="h" />
        }
        <path [attr.d]="g().d" />
        @if (g().marca; as m) {
          <line class="guia" [attr.x1]="m.x" [attr.x2]="m.x" y1="0" [attr.y2]="h" />
        }
      </svg>
      @if (g().marca; as m) {
        <div class="punto" [style.left.%]="(m.x / w) * 100" [style.top.%]="(m.y / h) * 100"></div>
        <div class="lectura" [class.izq]="m.x > w / 2" [style.left.%]="(m.x / w) * 100">
          {{ m.texto }}
          @for (l of m.leyes; track $index) {
            <span class="ley">{{ l }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .plano {
      position: relative;
      height: 28px;
      margin-top: 3px;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    path {
      fill: none;
      stroke: var(--serie-1);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
    }
    .bien path {
      stroke: var(--bien);
    }
    .mal path {
      stroke: var(--mal);
    }
    .plano.bien .punto {
      background: var(--bien);
    }
    .plano.mal .punto {
      background: var(--mal);
    }
    .inicio {
      stroke: var(--borde-fuerte);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      vector-effect: non-scaling-stroke;
    }
    .guia {
      stroke: var(--borde-fuerte);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .hito {
      stroke: var(--aviso);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      opacity: 0.7;
      vector-effect: non-scaling-stroke;
    }
    .ley {
      display: block;
      color: var(--aviso);
    }
    .punto {
      position: absolute;
      width: 7px;
      height: 7px;
      margin: -3.5px;
      border-radius: 50%;
      background: var(--serie-1);
      box-shadow: 0 0 0 2px var(--superficie);
      pointer-events: none;
    }
    .lectura {
      position: absolute;
      bottom: 100%;
      transform: translateX(6px);
      z-index: 3;
      font-size: 11px;
      font-weight: 400;
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--tinta);
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
export class MiniSerie {
  readonly valores = input.required<number[]>();
  /** Semana de la simulación de cada valor. */
  readonly semanas = input.required<number[]>();
  readonly formato = input<(v: number) => string>(num);
  /** Qué sentido del cambio es favorable: 1 subir, -1 bajar, 0 ninguno. */
  readonly bueno = input<-1 | 0 | 1>(0);
  readonly unidad = input<Unidad>('relativa');

  protected readonly t = computed(() => {
    const s = this.valores();
    return tendencia(s[0] ?? 0, s[s.length - 1] ?? 0, this.unidad(), this.bueno());
  });

  private readonly sim = inject(SimService);
  protected readonly w = W;
  protected readonly h = H;
  protected readonly cursor = signal<number | null>(null);

  protected readonly g = computed(() => {
    const serie = this.valores();
    const min = Math.min(...serie);
    const max = Math.max(...serie);
    const margen = (max - min) * 0.15 || Math.max(1e-9, Math.abs(max) * 0.05);
    const y = (v: number) => H - ((v - (min - margen)) / (max - min + 2 * margen)) * H;
    const x = (i: number) => (serie.length > 1 ? (i / (serie.length - 1)) * W : 0);
    const cursor = this.cursor();
    const hitos = hitosDecretos(this.sim.estado().decretosPromulgados, this.semanas(), W);
    let marca: { x: number; y: number; texto: string; leyes: string[] } | null = null;
    if (cursor !== null && serie.length > 1) {
      const i = Math.round(cursor * (serie.length - 1));
      const fecha = new Date(
        new Date(P.fechaInicio).getTime() + this.semanas()[i] * 7 * 86_400_000,
      );
      marca = {
        x: x(i),
        y: y(serie[i]),
        texto: `${fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}: ${this.formato()(serie[i])}`,
        leyes: hitoCercano(hitos, x(i), W),
      };
    }
    return {
      d:
        serie.length > 1
          ? serie.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
          : '',
      yInicio: serie.length ? y(serie[0]) : H / 2,
      hitos: hitos.map((h) => h.x),
      marca,
    };
  });

  protected mover(ev: MouseEvent) {
    const caja = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.cursor.set(Math.max(0, Math.min(1, (ev.clientX - caja.left) / caja.width)));
  }
}
