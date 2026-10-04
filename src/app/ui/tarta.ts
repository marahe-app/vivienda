import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { FuenteId } from '../sim/datos/fuentes';
import { PARAMETROS as P } from '../sim/datos/parametros';
import { SimService } from '../sim/sim.service';
import { PROPIETARIOS, type Propietario } from '../sim/tipos';
import { NOMBRE_PROPIETARIO, compacto, pct } from './formato';
import { hitoCercano, hitosDecretos } from './hitos';
import { FuenteIcono } from './fuente';

// El color sigue al propietario, no a su tamaño.
const COLOR: Record<Propietario, string> = {
  familias: 'var(--serie-1)',
  pequenos: 'var(--serie-2)',
  grandes: 'var(--serie-3)',
  publico: 'var(--serie-4)',
};
const R = 54;
const R_INT = 34;
const W = 300;
const H = 90;

type Tipo = 'total' | 'alquiler' | 'venta';
const TIPOS: { id: Tipo; nombre: string }[] = [
  { id: 'total', nombre: 'Toda' },
  { id: 'alquiler', nombre: 'Alquiler' },
  { id: 'venta', nombre: 'Venta' },
];

function arco(a0: number, a1: number): string {
  const p = (a: number, r: number) =>
    `${(60 + r * Math.sin(a)).toFixed(2)} ${(60 - r * Math.cos(a)).toFixed(2)}`;
  const largo = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(a0, R)} A${R} ${R} 0 ${largo} 1 ${p(a1, R)} L${p(a1, R_INT)} A${R_INT} ${R_INT} 0 ${largo} 0 ${p(a0, R_INT)} Z`;
}

const fecha = (semana: number) =>
  new Date(new Date(P.fechaInicio).getTime() + semana * 7 * 86_400_000).toLocaleDateString(
    'es-ES',
    { month: 'short', year: 'numeric' },
  );

@Component({
  selector: 'app-tarta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FuenteIcono],
  template: `
    <div class="cabecera">
      <h2>¿De quién es la vivienda?<app-fuente [ids]="fuentes" /></h2>
      <div class="conmutador" role="group" aria-label="Qué viviendas contar">
        <button [class.activo]="vista() === 'mercado'" (click)="vista.set('mercado')">
          En el mercado
        </button>
        <button [class.activo]="vista() === 'parque'" (click)="vista.set('parque')">
          Todo el parque
        </button>
      </div>
    </div>
    <div class="cuerpo">
      <svg
        class="tarta"
        viewBox="0 0 120 120"
        role="img"
        [attr.aria-label]="'Reparto por propietario: ' + resumen()"
      >
        @for (s of sectores(); track s.id) {
          <path
            [attr.d]="s.d"
            [style.fill]="s.color"
            [class.tenue]="destacado() && destacado() !== s.id"
            (mouseenter)="sobre.set(s.id)"
            (mouseleave)="sobre.set(null)"
            (click)="alternar(s.id)"
          >
            <title>{{ s.nombre }}: {{ s.valor }} ({{ s.pct }})</title>
          </path>
        }
        <text x="60" y="58" class="total">{{ centro().valor }}</text>
        <text x="60" y="71" class="pie">{{ centro().pie }}</text>
      </svg>
      <ul>
        @for (s of sectores(); track s.id) {
          <li>
            <button
              type="button"
              [class.tenue]="destacado() && destacado() !== s.id"
              [attr.aria-pressed]="filtro() === s.id"
              (mouseenter)="sobre.set(s.id)"
              (mouseleave)="sobre.set(null)"
              (click)="alternar(s.id)"
            >
              <i [style.background]="s.color"></i>
              <span>{{ s.nombre }}</span>
              <b>{{ s.pct }}</b>
              <small>{{ s.valor }}</small>
            </button>
          </li>
        }
      </ul>
    </div>
    <p class="nota">
      {{
        vista() === 'mercado'
          ? 'Viviendas alquiladas o anunciadas en alquiler o venta.'
          : 'Todas las viviendas, incluidas las habitadas por su dueño y las vacías.'
      }}
      Pulsa un color para filtrar el gráfico de abajo.
    </p>

    <section class="oferta">
      <div class="cabecera">
        <h2>
          Viviendas en oferta ·
          <span class="serie"
            ><i [style.background]="evolucion().color"></i>{{ evolucion().titulo }}</span
          >
          <app-fuente [ids]="fuentesOferta" />
        </h2>
        <div class="acciones">
          @if (filtro()) {
            <button class="discreto" (click)="filtro.set(null)">Quitar filtro ✕</button>
          }
          <div class="conmutador" role="group" aria-label="Tipo de oferta">
            @for (t of tipos; track t.id) {
              <button [class.activo]="tipo() === t.id" (click)="tipo.set(t.id)">
                {{ t.nombre }}
              </button>
            }
          </div>
        </div>
      </div>
      <div class="cifra">
        <strong>{{ evolucion().actual }}</strong>
        <span [class.sube]="evolucion().delta > 0" [class.baja]="evolucion().delta < 0">
          {{ evolucion().delta > 0 ? '▲ sube' : evolucion().delta < 0 ? '▼ baja' : '= igual' }}
          {{ evolucion().deltaTexto }} desde el inicio
        </span>
        @if (evolucion().personas; as p) {
          <span class="sin-acceso" [title]="ayudaPersonas"
            ><i [style.border-top-color]="p.color"></i
            ><span
              >Déficit de <b>{{ p.deficit }}</b> viviendas · {{ p.familias }} familias en espera ({{
                p.actual
              }}
              personas)</span
            ></span
          >
        }
      </div>
      <div class="grafica">
        <div class="ejes">
          <span>{{ evolucion().max }}</span
          ><span>{{ evolucion().min }}</span>
        </div>
        <div class="plano" (mousemove)="mover($event)" (mouseleave)="cursor.set(null)">
          <svg
            [attr.viewBox]="'0 0 ' + w + ' ' + h"
            preserveAspectRatio="none"
            role="img"
            [attr.aria-label]="'Evolución de las viviendas en oferta: ' + evolucion().titulo"
          >
            <line class="rejilla" x1="0" [attr.x2]="w" y1="0" y2="0" />
            <line class="rejilla" x1="0" [attr.x2]="w" [attr.y1]="h" [attr.y2]="h" />
            <line
              class="inicio"
              x1="0"
              [attr.x2]="w"
              [attr.y1]="evolucion().yInicio"
              [attr.y2]="evolucion().yInicio"
            />
            @for (x of evolucion().hitos; track x) {
              <line class="hito" [attr.x1]="x" [attr.x2]="x" y1="0" [attr.y2]="h" />
            }
            @if (evolucion().personas; as p) {
              <path class="linea personas" [attr.d]="p.d" [style.stroke]="p.color" />
            }
            <path class="linea" [attr.d]="evolucion().d" [style.stroke]="evolucion().trazo" />
            @if (evolucion().marca; as m) {
              <line class="guia" [attr.x1]="m.x" [attr.x2]="m.x" y1="0" [attr.y2]="h" />
            }
          </svg>
          @if (evolucion().marca; as m) {
            @if (m.yPersonas !== null) {
              <div
                class="punto personas"
                [style.background]="evolucion().personas?.color"
                [style.left.%]="(m.x / w) * 100"
                [style.top.%]="(m.yPersonas / h) * 100"
              ></div>
            }
            <div
              class="punto"
              [style.left.%]="(m.x / w) * 100"
              [style.top.%]="(m.y / h) * 100"
              [style.background]="evolucion().trazo"
            ></div>
            <div class="lectura" [class.izq]="m.x > w / 2" [style.left.%]="(m.x / w) * 100">
              {{ m.texto }}
              @if (m.personas) {
                <span>Déficit {{ m.deficit }} · {{ m.personas }} personas en espera</span>
              }
              @for (l of m.leyes; track $index) {
                <span class="ley">{{ l }}</span>
              }
            </div>
          }
        </div>
        @if (evolucion().personas; as p) {
          <div class="ejes personas" [style.color]="p.color">
            <span>{{ p.max }}</span
            ><span>{{ p.min }}</span>
          </div>
        }
      </div>
      <div class="tiempo">
        <span>{{ evolucion().desde }}</span
        ><span>{{ evolucion().hasta }}</span>
      </div>
    </section>
  `,
  styles: `
    .cabecera {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .cuerpo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
    }
    .tarta {
      width: 132px;
      flex: none;
    }
    .tarta path {
      stroke: var(--superficie);
      stroke-width: 2;
      transition: opacity 0.15s;
      cursor: pointer;
    }
    .tenue {
      opacity: 0.35;
    }
    .total {
      text-anchor: middle;
      font-size: 15px;
      font-weight: 650;
      fill: var(--tinta);
    }
    .pie {
      text-anchor: middle;
      font-size: 7.5px;
      fill: var(--tinta-3);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }
    li button {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      cursor: pointer;
      display: grid;
      grid-template-columns: 10px 1fr auto;
      column-gap: 8px;
      align-items: center;
      padding: 3px 6px;
      border-radius: 6px;
      font-size: 12.5px;
      color: var(--tinta-2);
      transition: opacity 0.15s;
    }
    li button:hover,
    li button[aria-pressed='true'] {
      background: var(--superficie-2);
    }
    li button:focus-visible {
      outline: 2px solid var(--acento);
    }
    li i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
    li b {
      color: var(--tinta);
      font-variant-numeric: tabular-nums;
    }
    li small {
      grid-column: 2 / 4;
      color: var(--tinta-3);
      font-size: 11px;
      margin-top: -2px;
    }
    .nota {
      margin: 8px 0 0;
      font-size: 11px;
      color: var(--tinta-3);
    }

    .oferta {
      display: grid;
      gap: 6px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--borde);
    }
    .serie {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 400;
      color: var(--tinta-2);
    }
    .serie i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
    .acciones {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cifra {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    .cifra strong {
      font-size: 22px;
      font-weight: 650;
    }
    .cifra span {
      font-size: 12px;
      color: var(--tinta-3);
    }
    .cifra .sube {
      color: var(--bien);
    }
    .cifra .baja {
      color: var(--mal);
    }
    .cifra .sin-acceso {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--tinta-2);
      cursor: help;
    }
    .cifra .sin-acceso span {
      color: inherit;
    }
    .sin-acceso i {
      flex: none;
      width: 14px;
      border-top: 2px dashed var(--mal);
    }
    .sin-acceso b {
      color: var(--mal);
      font-variant-numeric: tabular-nums;
    }
    .grafica {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 8px;
      height: 110px;
    }
    .plano {
      position: relative;
      height: 110px;
    }
    .grafica svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .linea {
      fill: none;
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
    }
    .linea.personas {
      stroke: var(--mal);
      stroke-width: 1.5;
      stroke-dasharray: 5 4;
      opacity: 0.75;
    }
    .rejilla {
      stroke: var(--borde);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .inicio {
      stroke: var(--tinta-3);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
    }
    .guia {
      stroke: var(--borde-fuerte);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .ejes {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
      font-size: 10.5px;
      line-height: 1;
      color: var(--tinta-3);
      font-variant-numeric: tabular-nums;
    }
    .punto {
      position: absolute;
      width: 8px;
      height: 8px;
      margin: -4px;
      border-radius: 50%;
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
    .lectura span {
      display: block;
      color: var(--mal);
    }
    .lectura .ley {
      color: var(--aviso);
    }
    .hito {
      stroke: var(--aviso);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      opacity: 0.7;
      vector-effect: non-scaling-stroke;
    }
    .ejes.personas {
      text-align: left;
      color: var(--mal);
    }
    .punto.personas {
      background: var(--mal);
    }
    .tiempo {
      padding: 0 46px;
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: var(--tinta-3);
    }
  `,
})
export class Tarta {
  private readonly sim = inject(SimService);
  protected readonly w = W;
  protected readonly h = H;
  protected readonly tipos = TIPOS;
  protected readonly fuentes: FuenteId[] = [
    'propiedadAlquiler',
    'viviendaPublica',
    'tenenciaEcv',
    'parque',
    'ofertaVenta',
  ];
  protected readonly fuentesOferta: FuenteId[] = [
    'ofertaVenta',
    'ofertaAlquiler',
    'deficit',
    'emancipacion',
    'resultado',
  ];
  protected readonly ayudaPersonas = `Déficit: familias en espera sin contar los ${compacto(P.jovenesLatentes)} hogares jóvenes que querrían emanciparse (supuesto del modelo). Personas: todas las familias en espera, a ${P.tamanoHogar.toLocaleString('es-ES')} personas por hogar. Línea discontinua, con su propia escala (eje derecho).`;
  protected readonly vista = signal<'mercado' | 'parque'>('mercado');
  protected readonly sobre = signal<Propietario | null>(null);
  /** Propietario elegido en la tarta: filtra el gráfico de oferta. */
  protected readonly filtro = signal<Propietario | null>(null);
  protected readonly tipo = signal<Tipo>('total');
  protected readonly cursor = signal<number | null>(null);

  protected readonly destacado = computed(() => this.sobre() ?? this.filtro());
  private readonly datos = computed(() => this.sim.ind()[this.vista()]);
  private readonly total = computed(() => PROPIETARIOS.reduce((s, o) => s + this.datos()[o], 0));

  protected readonly sectores = computed(() => {
    const total = this.total();
    let a = 0;
    return PROPIETARIOS.map((o) => {
      const v = this.datos()[o];
      const a0 = a;
      a += (v / total) * Math.PI * 2;
      return {
        id: o,
        nombre: NOMBRE_PROPIETARIO[o],
        d: arco(a0, Math.min(a, a0 + Math.PI * 2 - 0.001)),
        color: COLOR[o],
        valor: compacto(v),
        pct: pct(v / total),
      };
    });
  });

  protected readonly centro = computed(() => {
    const s = this.sectores().find((x) => x.id === this.destacado());
    return s
      ? { valor: s.pct, pie: s.valor + ' viviendas' }
      : { valor: compacto(this.total()), pie: 'viviendas' };
  });

  protected readonly resumen = computed(() =>
    this.sectores()
      .map((s) => `${s.nombre} ${s.pct}`)
      .join(', '),
  );

  /** Serie semanal de viviendas anunciadas, de todos los propietarios o del elegido en la tarta. */
  protected readonly evolucion = computed(() => {
    const hist = this.sim.estado().historial;
    const filtro = this.filtro();
    const tipo = this.tipo();
    const quienes: readonly Propietario[] = filtro ? [filtro] : PROPIETARIOS;
    const serie = hist.map((p) =>
      quienes.reduce(
        (s, o) =>
          s + (tipo !== 'venta' ? p.ofAlquiler[o] : 0) + (tipo !== 'alquiler' ? p.ofVenta[o] : 0),
        0,
      ),
    );
    const inicio = serie[0] ?? 0;
    const actual = serie[serie.length - 1] ?? 0;
    const min = Math.min(...serie, inicio);
    const max = Math.max(...serie, inicio);
    const margen = (max - min) * 0.1 || Math.max(1, max * 0.05);
    const y = (v: number) => H - ((v - (min - margen)) / (max - min + 2 * margen)) * H;
    const x = (i: number) => (serie.length > 1 ? (i / (serie.length - 1)) * W : 0);
    // Personas en espera de vivienda, superpuestas con su propia escala. Las partidas antiguas no guardan el dato.
    const gente = hist.map((p) => (p.espera === undefined ? null : p.espera * P.tamanoHogar));
    // Déficit de viviendas: familias en espera sin contar la demanda joven latente, que el déficit oficial no recoge.
    const deficit = (personas: number) => Math.max(0, personas / P.tamanoHogar - P.jovenesLatentes);
    const conDato = gente.filter((v): v is number => v !== null);
    const minP = Math.min(...conDato);
    const maxP = Math.max(...conDato);
    const margenP = (maxP - minP) * 0.1 || Math.max(1, maxP * 0.05);
    const yP = (v: number) => H - ((v - (minP - margenP)) / (maxP - minP + 2 * margenP)) * H;
    let dPersonas = '';
    gente.forEach((v, i) => {
      if (v !== null)
        dPersonas += (dPersonas ? 'L' : 'M') + x(i).toFixed(1) + ' ' + yP(v).toFixed(1) + ' ';
    });
    const cursor = this.cursor();
    const hitos = hitosDecretos(
      this.sim.estado().decretosPromulgados,
      hist.map((p) => p.semana),
      W,
    );
    let marca: {
      x: number;
      y: number;
      texto: string;
      leyes: string[];
      yPersonas: number | null;
      personas: string;
      deficit: string;
    } | null = null;
    if (cursor !== null && serie.length > 1) {
      const i = Math.round(cursor * (serie.length - 1));
      const g = gente[i];
      marca = {
        x: x(i),
        y: y(serie[i]),
        texto: `${fecha(hist[i].semana)}: ${compacto(serie[i])}`,
        yPersonas: g === null ? null : yP(g),
        personas: g === null ? '' : compacto(g),
        deficit: g === null ? '' : compacto(deficit(g)),
        leyes: hitoCercano(hitos, x(i), W),
      };
    }
    const delta = inicio ? actual / inicio - 1 : 0;
    const color = filtro ? COLOR[filtro] : 'var(--tinta-2)';
    // Más vivienda en oferta es buena noticia; más gente en espera, mala.
    const cambioP = conDato.length ? conDato[conDato.length - 1] / conDato[0] - 1 : 0;
    return {
      titulo:
        (filtro ? NOMBRE_PROPIETARIO[filtro] : 'Todos los propietarios') +
        (tipo === 'total' ? '' : tipo === 'alquiler' ? ' · en alquiler' : ' · en venta'),
      color,
      trazo: delta > 0.0005 ? 'var(--bien)' : delta < -0.0005 ? 'var(--mal)' : color,
      d:
        serie.length > 1
          ? serie.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
          : '',
      yInicio: y(inicio),
      actual: compacto(actual),
      delta: Math.abs(delta) < 0.0005 ? 0 : delta,
      deltaTexto: pct(Math.abs(delta)),
      min: compacto(min - margen),
      max: compacto(max + margen),
      desde: hist.length ? fecha(hist[0].semana) : '',
      hasta: hist.length ? fecha(hist[hist.length - 1].semana) : '',
      personas: conDato.length
        ? {
            d: conDato.length > 1 ? dPersonas : '',
            color:
              cambioP > 0.0005
                ? 'var(--mal)'
                : cambioP < -0.0005
                  ? 'var(--bien)'
                  : 'var(--tinta-3)',
            actual: compacto(conDato[conDato.length - 1]),
            familias: compacto(conDato[conDato.length - 1] / P.tamanoHogar),
            deficit: compacto(deficit(conDato[conDato.length - 1])),
            min: compacto(minP - margenP),
            max: compacto(maxP + margenP),
          }
        : null,
      hitos: hitos.map((h) => h.x),
      marca,
    };
  });

  protected alternar(o: Propietario) {
    this.filtro.set(this.filtro() === o ? null : o);
  }

  protected mover(ev: MouseEvent) {
    const caja = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.cursor.set(Math.max(0, Math.min(1, (ev.clientX - caja.left) / caja.width)));
  }
}
