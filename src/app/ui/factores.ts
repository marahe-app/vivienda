import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FACTORES, type DefFactor, type FactorId } from '../sim/datos/factores';
import { SimService } from '../sim/sim.service';
import { describirEfecto } from './decretos';
import { valorFactor } from './formato';
import { FuenteIcono } from './fuente';

/** Transparencia del modelo: cada factor con su valor base, el actual y los modificadores que lo mueven. */
@Component({
  selector: 'app-factores',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FuenteIcono],
  template: `
    <p class="intro">
      Todo el simulador son estos números. El icono junto a cada uno indica si su valor base sale de
      una fuente publicada o es un supuesto del modelo. Cada decreto añade bonificadores o
      penalizadores sobre ellos y las reglas semanales calculan con el valor resultante.
    </p>
    @for (g of grupos(); track g.grupo) {
      <h3>{{ g.grupo }}</h3>
      <table>
        <tbody>
          @for (f of g.factores; track f.id) {
            <tr [class.movido]="f.mods.length">
              <td>
                {{ f.nombre }}<app-fuente [ids]="f.fuente" />
                @for (m of f.mods; track $index) {
                  <small [class.bueno]="m.bueno" [class.malo]="!m.bueno"
                    >{{ m.cambio }} · {{ m.origen }}</small
                  >
                }
              </td>
              <td class="n">
                <b>{{ f.valor }}</b>
                @if (f.mods.length) {
                  <small>base {{ f.base }}</small>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 8px;
    }
    .intro {
      margin: 0;
      font-size: 12px;
      color: var(--tinta-2);
    }
    h3 {
      margin: 6px 0 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    td {
      padding: 5px 0;
      border-top: 1px solid var(--borde);
      color: var(--tinta-2);
      vertical-align: top;
    }
    td.n {
      text-align: right;
      white-space: nowrap;
      padding-left: 10px;
      font-variant-numeric: tabular-nums;
    }
    b {
      color: var(--tinta);
      font-weight: 600;
    }
    small {
      display: block;
      font-size: 11px;
      color: var(--tinta-3);
    }
    small.bueno {
      color: var(--bien);
    }
    small.malo {
      color: var(--mal);
    }
    tr.movido td:first-child {
      color: var(--tinta);
    }
  `,
})
export class Factores {
  private readonly sim = inject(SimService);

  protected readonly grupos = computed(() => {
    const e = this.sim.estado();
    const f = this.sim.f();
    const ids = Object.keys(FACTORES) as FactorId[];
    const grupos = [...new Set(ids.map((id) => FACTORES[id].grupo))];
    return grupos.map((grupo) => ({
      grupo,
      factores: ids
        .filter((id) => FACTORES[id].grupo === grupo)
        .map((id) => {
          const def: DefFactor = FACTORES[id];
          return {
            id,
            nombre: def.nombre,
            fuente: def.fuente,
            valor: valorFactor(def, f(id)),
            base: valorFactor(def, def.base),
            mods: e.modificadores
              .filter((m) => m.factor === id)
              .map((m) => {
                const d = describirEfecto(m);
                return {
                  cambio: d.texto.slice(d.texto.lastIndexOf(': ') + 2),
                  origen: m.etiqueta,
                  bueno: d.bueno,
                };
              }),
          };
        }),
    }));
  });
}
