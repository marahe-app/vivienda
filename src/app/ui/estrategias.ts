import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DECRETO_POR_ID } from '../sim/datos/decretos';
import { ESTRATEGIAS, cambioDe, type Paso } from '../sim/datos/estrategias';
import { SimService } from '../sim/sim.service';
import { textoValor } from './decretos';

type EstadoPaso = 'hecho' | 'saltado' | 'siguiente' | 'pendiente';

function textoPaso(paso: Paso): string {
  const c = cambioDe(paso);
  if (!c) return 'Imprimir 1.000 M€';
  const d = DECRETO_POR_ID.get(c.id)!;
  return d.parametro ? `${d.titulo}: ${textoValor(d, c.valor!)}` : d.titulo;
}

/** Estrategias preparadas: listas de leyes que el simulador promulga solo, un paso por mes. */
@Component({
  selector: 'app-estrategias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="nota">
      Cada estrategia es una lista de leyes. Al activarla, el simulador promulga un paso cada mes,
      en orden, y el tiempo ya no se detiene a esperar tu decreto. Puedes pararla cuando quieras y
      seguir decretando a mano: si gastas tú el decreto del mes, la estrategia espera al siguiente.
    </p>
    @for (x of estrategias(); track x.id) {
      <article [class.activa]="x.activa">
        <header>
          <strong>{{ x.nombre }}</strong>
          <small>{{ x.progreso }}</small>
        </header>
        <p>{{ x.descripcion }}</p>
        @if (x.elegida) {
          <div class="pista"><i [style.width.%]="x.avance"></i></div>
        }
        <details [open]="x.elegida">
          <summary>{{ x.pasos.length }} pasos</summary>
          <ol>
            @for (p of x.pasos; track $index) {
              <li [class]="p.estado">
                <span class="marca" aria-hidden="true">{{ p.marca }}</span>
                <span
                  >{{ p.texto }}
                  @if (p.estado === 'saltado') {
                    <em>no se pudo promulgar</em>
                  }
                </span>
              </li>
            }
          </ol>
        </details>
        <footer>
          @if (x.activa) {
            <button (click)="sim.detenerEstrategia()">Detener</button>
          } @else {
            <button class="aplicar" (click)="sim.activarEstrategia(x.id)">
              {{ x.elegida ? 'Volver a empezar' : 'Aplicar automáticamente' }}
            </button>
            @if (x.elegida && !x.terminada) {
              <button class="discreto" (click)="sim.reanudarEstrategia()">Continuar</button>
            }
          }
        </footer>
      </article>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 10px;
    }
    .nota {
      margin: 0;
      font-size: 11.5px;
      color: var(--tinta-3);
    }
    article {
      display: grid;
      gap: 7px;
      padding: 10px 12px;
      border: 1px solid var(--borde);
      border-radius: 9px;
      background: var(--superficie-2);
    }
    article.activa {
      border-color: var(--acento);
      background: color-mix(in srgb, var(--acento) 10%, var(--superficie-2));
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    strong {
      font-size: 13.5px;
    }
    header small {
      font-size: 11px;
      color: var(--tinta-3);
      white-space: nowrap;
    }
    .activa header small {
      color: var(--acento);
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--tinta-2);
    }
    .pista {
      height: 4px;
      border-radius: 2px;
      background: var(--superficie-3);
      overflow: hidden;
    }
    .pista i {
      display: block;
      height: 100%;
      background: var(--acento);
      transition: width 0.3s;
    }
    summary {
      cursor: pointer;
      font-size: 11.5px;
      color: var(--tinta-3);
    }
    ol {
      margin: 6px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 3px;
      font-size: 12px;
      color: var(--tinta-2);
    }
    li {
      display: grid;
      grid-template-columns: 14px 1fr;
      gap: 4px;
    }
    .marca {
      color: var(--tinta-3);
    }
    li.hecho {
      color: var(--tinta-3);
    }
    li.hecho .marca {
      color: var(--bien);
    }
    li.siguiente {
      color: var(--tinta);
      font-weight: 600;
    }
    li.siguiente .marca {
      color: var(--acento);
    }
    li.saltado {
      color: var(--tinta-3);
      text-decoration: line-through;
    }
    li.saltado .marca {
      color: var(--mal);
    }
    em {
      display: inline-block;
      margin-left: 4px;
      font-size: 10.5px;
      color: var(--mal);
      text-decoration: none;
    }
    footer {
      display: flex;
      gap: 6px;
    }
    .aplicar {
      background: var(--acento);
      border-color: var(--acento);
      color: #fff;
    }
    .aplicar:hover:not(:disabled) {
      background: color-mix(in srgb, var(--acento) 85%, #fff);
    }
  `,
})
export class Estrategias {
  protected readonly sim = inject(SimService);

  protected readonly estrategias = computed(() => {
    const auto = this.sim.estrategia();
    return ESTRATEGIAS.map((x) => {
      const elegida = auto?.id === x.id;
      const paso = elegida ? auto.paso : 0;
      const terminada = elegida && paso >= x.pasos.length;
      const activa = elegida && auto.activa && !terminada;
      const pasos = x.pasos.map((p, k) => {
        const estado: EstadoPaso = !elegida
          ? 'pendiente'
          : auto.saltados.includes(k)
            ? 'saltado'
            : k < paso
              ? 'hecho'
              : k === paso
                ? 'siguiente'
                : 'pendiente';
        return {
          texto: textoPaso(p),
          estado,
          marca: { hecho: '✓', saltado: '✕', siguiente: '▸', pendiente: '·' }[estado],
        };
      });
      return {
        id: x.id,
        nombre: x.nombre,
        descripcion: x.descripcion,
        pasos,
        elegida,
        activa,
        terminada,
        avance: (paso / x.pasos.length) * 100,
        progreso: !elegida
          ? ''
          : terminada
            ? 'completada'
            : `${activa ? 'en marcha' : 'detenida'} · paso ${paso + 1} de ${x.pasos.length}`,
      };
    });
  });
}
