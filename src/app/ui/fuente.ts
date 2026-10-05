import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FUENTES, type Fuente, type FuenteId } from '../sim/datos/fuentes';

/**
 * Icono de fuente: al pulsarlo muestra de dónde sale un número y enlaza al original.
 * Un   (sin fuente publicada) se marca con otro icono y lo dice.
 */
@Component({
  selector: 'app-fuente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'fuera($event)',
    '(document:keydown.escape)': 'abierto.set(false)',
    '(window:scroll)': 'abierto.set(false)',
    '(window:resize)': 'abierto.set(false)',
  },
  template: `
    <button
      type="button"
      [class.supuesto]="soloSupuestos()"
      [attr.aria-label]="etiqueta()"
      [title]="etiqueta()"
      [attr.aria-expanded]="abierto()"
      (click)="alternar($event)"
    >
      @if (soloSupuestos()) {
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1.5 14.5 8 8 14.5 1.5 8Z" />
          <path d="M8 5v3.5M8 11v.2" />
        </svg>
      } @else {
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 2.5h6.5L13 6v7.5H3Z" />
          <path d="M9.5 2.5V6H13M5.5 8.5h5M5.5 11h5" />
        </svg>
      }
    </button>
    @if (abierto()) {
      <div
        class="caja"
        role="dialog"
        aria-label="Fuentes"
        [style.left.px]="pos().x"
        [style.top.px]="pos().y"
        (click)="$event.stopPropagation()"
      >
        @for (f of fuentes(); track f.id) {
          <article>
            <small>{{
              f.tipo === 'supuesto'
                ? '  · sin fuente publicada'
                : f.tipo === 'derivado'
                  ? 'Calculado con datos publicados · ' + f.organismo
                  : f.organismo + ' · ' + f.periodo
            }}</small>
            <strong>{{ f.dato }}</strong>
            @if (f.nota) {
              <p>{{ f.nota }}</p>
            }
            @if (f.url) {
              <a [href]="f.url" target="_blank" rel="noopener noreferrer">{{ f.titulo }} ↗</a>
            }
          </article>
        }
        <p class="pie">
          La fuente respalda la cifra de partida. Lo que ves en pantalla evoluciona con la
          simulación.
        </p>
      </div>
    }
  `,
  styles: `
    :host {
      display: inline-block;
      vertical-align: middle;
      margin-left: 4px;
      line-height: 0;
    }
    button {
      all: unset;
      cursor: pointer;
      display: inline-grid;
      place-items: center;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      color: var(--tinta-3);
    }
    button:hover,
    button[aria-expanded='true'] {
      color: var(--acento);
      background: var(--superficie-3);
    }
    button.supuesto:hover,
    button.supuesto[aria-expanded='true'] {
      color: var(--aviso);
    }
    button:focus-visible {
      outline: 2px solid var(--acento);
    }
    svg {
      width: 12px;
      height: 12px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.3;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .caja {
      position: fixed;
      z-index: 50;
      width: 300px;
      max-width: calc(100vw - 16px);
      max-height: 60vh;
      overflow-y: auto;
      display: grid;
      gap: 10px;
      padding: 12px;
      text-align: left;
      white-space: normal;
      line-height: 1.4;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      background: var(--superficie-3);
      border: 1px solid var(--borde-fuerte);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgb(0 0 0 / 0.5);
    }
    article {
      display: grid;
      gap: 3px;
    }
    article + article {
      border-top: 1px solid var(--borde-fuerte);
      padding-top: 10px;
    }
    small {
      font-size: 10.5px;
      color: var(--tinta-3);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    strong {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--tinta);
    }
    p {
      margin: 0;
      font-size: 11.5px;
      color: var(--tinta-2);
    }
    a {
      font-size: 12px;
      color: var(--acento);
      text-decoration: none;
      overflow-wrap: anywhere;
    }
    a:hover {
      text-decoration: underline;
    }
    .pie {
      font-size: 10.5px;
      color: var(--tinta-3);
      border-top: 1px solid var(--borde-fuerte);
      padding-top: 8px;
    }
  `,
})
export class FuenteIcono {
  readonly ids = input.required<FuenteId | readonly FuenteId[]>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly abierto = signal(false);
  protected readonly pos = signal({ x: 0, y: 0 });

  protected readonly fuentes = computed(() => {
    const ids = this.ids();
    return (typeof ids === 'string' ? [ids] : ids).map((id): Fuente & { id: FuenteId } => ({
      id,
      ...FUENTES[id],
    }));
  });
  protected readonly soloSupuestos = computed(() =>
    this.fuentes().every((f) => f.tipo === 'supuesto'),
  );
  protected readonly etiqueta = computed(() =>
    this.soloSupuestos()
      ? ' '
      : 'Fuente: ' +
        this.fuentes()
          .filter((f) => f.tipo !== 'supuesto')
          .map((f) => f.organismo)
          .join(', '),
  );

  protected alternar(ev: Event) {
    ev.stopPropagation();
    if (this.abierto()) return this.abierto.set(false);
    // Posición fija respecto a la ventana: así no la recorta ningún panel con scroll.
    const r = this.el.nativeElement.getBoundingClientRect();
    const ancho = Math.min(300, window.innerWidth - 16);
    const x = Math.max(8, Math.min(r.left - 8, window.innerWidth - ancho - 8));
    const debajo = r.bottom + 6;
    const y = debajo + 220 > window.innerHeight ? Math.max(8, r.top - 226) : debajo;
    this.pos.set({ x, y });
    this.abierto.set(true);
  }

  protected fuera(ev: Event) {
    if (this.abierto() && !this.el.nativeElement.contains(ev.target as Node))
      this.abierto.set(false);
  }
}
