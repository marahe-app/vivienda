import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { DECRETO_POR_ID } from '../sim/datos/decretos';
import { SimService } from '../sim/sim.service';
import { textoValor } from './decretos';

/** Menú lateral que entra por la derecha con todos los decretos promulgados, del más reciente al más antiguo. */
@Component({
  selector: 'app-historial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'abierto.set(false)',
  },
  template: `
    <div class="velo" [class.visible]="abierto()" (click)="abierto.set(false)"></div>
    <aside
      role="dialog"
      aria-label="Historial de decretos"
      [class.abierto]="abierto()"
      [attr.inert]="abierto() ? null : ''"
    >
      <header>
        <h2>Historial de decretos</h2>
        <button class="discreto" aria-label="Cerrar el historial" (click)="abierto.set(false)">
          ✕
        </button>
      </header>
      <p class="resumen">{{ resumen() }}</p>
      <ol>
        @for (d of decretos(); track d.semana) {
          <li>
            <span class="fecha">{{ d.fecha }}</span>
            <ul>
              @for (c of d.cambios; track $index) {
                <li [class.derogada]="c.derogada">
                  <span class="tipo">{{
                    c.anulada ? 'Anulada por los tribunales' : c.derogada ? 'Deroga' : 'Aprueba'
                  }}</span>
                  {{ c.texto }}
                </li>
              }
            </ul>
          </li>
        } @empty {
          <li class="vacio">Todavía no has promulgado ningún decreto.</li>
        }
      </ol>
    </aside>
  `,
  styles: `
    .velo {
      position: fixed;
      inset: 0;
      z-index: 60;
      background: rgb(0 0 0 / 0.5);
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.25s,
        visibility 0s 0.25s;
    }
    .velo.visible {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.25s;
    }
    aside {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 61;
      width: 360px;
      max-width: calc(100vw - 32px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px 16px;
      background: var(--superficie);
      border-left: 1px solid var(--borde-fuerte);
      box-shadow: -12px 0 30px rgb(0 0 0 / 0.5);
      translate: 100% 0;
      visibility: hidden;
      transition:
        translate 0.28s ease-in,
        visibility 0s 0.28s;
    }
    aside.abierto {
      translate: 0 0;
      visibility: visible;
      transition: translate 0.28s ease-out;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    h2 {
      font-size: 15px;
    }
    .resumen {
      margin: 0;
      font-size: 12px;
      color: var(--tinta-3);
    }
    ol,
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
    }
    ol {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      align-content: start;
      gap: 12px;
      margin-right: -8px;
      padding-right: 8px;
    }
    /* Línea de tiempo: cada decreto cuelga de su fecha. */
    ol > li:not(.vacio) {
      display: grid;
      gap: 5px;
      padding-left: 12px;
      border-left: 2px solid var(--borde-fuerte);
    }
    .fecha {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--tinta-3);
    }
    ul {
      gap: 4px;
    }
    ul li {
      font-size: 12.5px;
      color: var(--tinta);
    }
    .tipo {
      margin-right: 4px;
      font-size: 10.5px;
      color: var(--bien);
    }
    .derogada {
      color: var(--tinta-3);
    }
    .derogada .tipo {
      color: var(--mal);
    }
    .vacio {
      padding: 20px 0;
      text-align: center;
      font-size: 12.5px;
      color: var(--tinta-3);
    }
    @media (prefers-reduced-motion: reduce) {
      .velo,
      aside {
        transition: none;
      }
    }
  `,
})
export class Historial {
  private readonly sim = inject(SimService);
  readonly abierto = model(false);

  /** Los cambios de ley agrupados por el decreto (la semana) en que se promulgaron. */
  protected readonly decretos = computed(() => {
    const e = this.sim.estado();
    const inicio = e.fecha.getTime() - e.semana * 7 * 86_400_000;
    const porSemana = new Map<number, { texto: string; derogada: boolean; anulada: boolean }[]>();
    for (const p of e.decretosPromulgados) {
      const d = DECRETO_POR_ID.get(p.id)!;
      const cambios = porSemana.get(p.semana) ?? [];
      cambios.push({
        texto:
          p.valor !== null && d.parametro ? `${d.titulo}: ${textoValor(d, p.valor)}` : d.titulo,
        derogada: p.valor === null,
        anulada: p.motivo === 'anulada',
      });
      porSemana.set(p.semana, cambios);
    }
    return [...porSemana]
      .map(([semana, cambios]) => ({
        semana,
        cambios,
        fecha: new Date(inicio + semana * 7 * 86_400_000).toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        }),
      }))
      .reverse();
  });

  protected readonly resumen = computed(() => {
    const n = this.decretos().length;
    const vigentes = Object.keys(this.sim.estado().vigentes).length;
    return n
      ? `${n} ${n === 1 ? 'decreto' : 'decretos'} · ${vigentes} ${vigentes === 1 ? 'ley' : 'leyes'} en vigor`
      : 'Aquí quedará cada decreto que promulgues.';
  });
}
