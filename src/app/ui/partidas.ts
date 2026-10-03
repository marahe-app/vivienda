import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { PartidasService, type Partida } from '../sim/partidas.service';

/** Menú flotante para guardar la partida en el navegador y cargar o borrar las guardadas. */
@Component({
  selector: 'app-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'fuera($event)',
    '(document:keydown.escape)': 'abierto.set(false)',
    '(window:resize)': 'abierto.set(false)',
  },
  template: `
    <button type="button" [attr.aria-expanded]="abierto()" (click)="alternar()">Partidas</button>
    @if (abierto()) {
      <div
        class="caja"
        role="dialog"
        aria-label="Partidas guardadas"
        [style.left.px]="pos().x"
        [style.top.px]="pos().y"
      >
        <h2>Guardar la partida actual</h2>
        <form (submit)="guardar($event, nombre.value); nombre.value = ''">
          <input
            #nombre
            type="text"
            maxlength="40"
            placeholder="Nombre de la partida"
            aria-label="Nombre de la partida"
          />
          <button type="submit">Guardar</button>
        </form>
        @if (aviso(); as a) {
          <p class="aviso" [class.error]="a.error" role="status">{{ a.texto }}</p>
        }

        <h2>Partidas guardadas</h2>
        @for (p of partidas(); track p.id) {
          <article>
            <div class="ficha">
              <strong>{{ p.nombre }}</strong>
              <small>{{ p.detalle }}</small>
              <small>Guardada el {{ p.cuando }}</small>
            </div>
            <div class="acciones">
              <button type="button" (click)="cargar(p)">Cargar</button>
              <button
                type="button"
                class="discreto"
                (click)="sobrescribir(p)"
                title="Guarda la partida actual encima de esta"
              >
                {{ confirma() === 'sobre:' + p.id ? '¿Seguro?' : 'Sobrescribir' }}
              </button>
              <button type="button" class="discreto peligro" (click)="borrar(p)">
                {{ confirma() === 'borrar:' + p.id ? '¿Seguro?' : 'Borrar' }}
              </button>
            </div>
          </article>
        } @empty {
          <p class="vacio">Todavía no hay partidas guardadas en este navegador.</p>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: inline-block;
    }
    .caja {
      position: fixed;
      z-index: 50;
      width: 340px;
      max-width: calc(100vw - 16px);
      max-height: calc(100vh - 80px);
      overflow-y: auto;
      display: grid;
      gap: 10px;
      padding: 14px;
      background: var(--superficie-3);
      border: 1px solid var(--borde-fuerte);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgb(0 0 0 / 0.5);
    }
    form {
      display: flex;
      gap: 8px;
    }
    input {
      flex: 1;
      min-width: 0;
      font: inherit;
      font-size: 12.5px;
      color: var(--tinta);
      background: var(--superficie);
      border: 1px solid var(--borde-fuerte);
      border-radius: 7px;
      padding: 5px 9px;
    }
    input:focus-visible {
      outline: 2px solid var(--acento);
      outline-offset: 1px;
    }
    h2:not(:first-child) {
      border-top: 1px solid var(--borde-fuerte);
      padding-top: 10px;
    }
    article {
      display: grid;
      gap: 6px;
      padding: 9px 10px;
      border-radius: 8px;
      background: var(--superficie-2);
      border: 1px solid var(--borde);
    }
    .ficha {
      display: grid;
      gap: 1px;
      min-width: 0;
    }
    strong {
      font-size: 13px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    small {
      font-size: 11px;
      color: var(--tinta-3);
    }
    .acciones {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .peligro {
      margin-left: auto;
      color: var(--mal);
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--tinta-2);
    }
    .aviso {
      color: var(--bien);
    }
    .aviso.error {
      color: var(--mal);
    }
    .vacio {
      color: var(--tinta-3);
    }
  `,
})
export class Partidas {
  /** Se ha cargado una partida guardada. */
  readonly cargada = output<void>();

  private readonly servicio = inject(PartidasService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly abierto = signal(false);
  protected readonly pos = signal({ x: 0, y: 0 });
  protected readonly aviso = signal<{ texto: string; error: boolean } | null>(null);
  /** Acción destructiva pendiente de un segundo clic: «borrar:id» o «sobre:id». */
  protected readonly confirma = signal<string | null>(null);

  protected readonly partidas = computed(() =>
    this.servicio.lista().map((p) => ({
      ...p,
      detalle:
        new Date(p.fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }) +
        ` · semana ${p.semana}` +
        (p.fin ? (p.fin === 'victoria' ? ' · objetivo conseguido' : ' · gobierno caído') : ''),
      cuando: new Date(p.guardada).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })),
  );

  protected alternar() {
    if (this.abierto()) return this.abierto.set(false);
    // Posición fija respecto a la ventana, bajo el botón y sin salirse por los lados.
    const r = this.el.nativeElement.getBoundingClientRect();
    const ancho = Math.min(340, window.innerWidth - 16);
    this.pos.set({
      x: Math.max(8, Math.min(r.right - ancho, window.innerWidth - ancho - 8)),
      y: r.bottom + 8,
    });
    this.aviso.set(null);
    this.confirma.set(null);
    this.abierto.set(true);
  }

  protected fuera(ev: Event) {
    // composedPath: un botón que se redibuja al pulsarlo ya no está en el DOM cuando llega el clic al documento.
    if (this.abierto() && !ev.composedPath().includes(this.el.nativeElement))
      this.abierto.set(false);
  }

  protected guardar(ev: Event, nombre: string) {
    ev.preventDefault();
    nombre = nombre.trim() || 'Partida ' + (this.servicio.lista().length + 1);
    this.resultado(this.servicio.guardar(nombre), `«${nombre}» guardada.`);
  }

  protected cargar(p: Partida) {
    const error = this.servicio.cargar(p.id);
    this.resultado(error, `«${p.nombre}» cargada.`);
    if (error) return;
    this.cargada.emit();
    this.abierto.set(false);
  }

  protected sobrescribir(p: Partida) {
    if (!this.confirmado('sobre:' + p.id)) return;
    this.resultado(
      this.servicio.guardar(p.nombre, p.id),
      `«${p.nombre}» sobrescrita con la partida actual.`,
    );
  }

  protected borrar(p: Partida) {
    if (!this.confirmado('borrar:' + p.id)) return;
    this.resultado(this.servicio.borrar(p.id), `«${p.nombre}» borrada.`);
  }

  /** El primer clic pide confirmación; el segundo sobre el mismo botón la da. */
  private confirmado(accion: string): boolean {
    const ok = this.confirma() === accion;
    this.confirma.set(ok ? null : accion);
    if (!ok) this.aviso.set(null);
    return ok;
  }

  private resultado(error: string | null, exito: string) {
    this.confirma.set(null);
    this.aviso.set({ texto: error ?? exito, error: !!error });
  }
}
