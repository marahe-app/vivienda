import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RESTO } from '../sim/datos/ciudades';
import type { FuenteId } from '../sim/datos/fuentes';
import { hogares, presion } from '../sim/motor/indicadores';
import { SimService } from '../sim/sim.service';
import { colorCalor, compacto, dec, eur, pct } from './formato';
import { FuenteIcono } from './fuente';

const ANCHO = 645;
const ALTO = 480;
const ESCALA = 50;
const LON0 = -12.2;
const LAT1 = 44.1;
const K = Math.cos((40 * Math.PI) / 180);
/** Canarias se dibuja desplazada, en un recuadro bajo la península. */
const CANARIAS = { dLon: 6.5, dLat: 7.2 };

function proyectar(lon: number, lat: number): [number, number] {
  if (lon < -12.5) {
    lon += CANARIAS.dLon;
    lat += CANARIAS.dLat;
  }
  return [(lon - LON0) * K * ESCALA, (LAT1 - lat) * ESCALA];
}
const trazo = (pts: number[][]) =>
  pts
    .map(
      ([lon, lat], i) =>
        (i ? 'L' : 'M') +
        proyectar(lon, lat)
          .map((v) => v.toFixed(1))
          .join(' '),
    )
    .join(' ') + ' Z';

// Contorno simplificado (lon, lat).
const PENINSULA = [
  [-9.27, 42.9],
  [-8.4, 43.37],
  [-7.69, 43.79],
  [-7.04, 43.54],
  [-5.66, 43.6],
  [-3.8, 43.47],
  [-2.95, 43.42],
  [-1.79, 43.37],
  [-1.4, 43.05],
  [-0.75, 42.95],
  [0, 42.7],
  [0.7, 42.85],
  [1.45, 42.6],
  [1.75, 42.5],
  [2.5, 42.35],
  [3.17, 42.43],
  [3.32, 42.32],
  [3.2, 41.85],
  [2.18, 41.3],
  [1.25, 41.08],
  [0.87, 40.72],
  [0.48, 40.47],
  [0, 39.97],
  [-0.32, 39.45],
  [-0.22, 39.18],
  [0.23, 38.73],
  [-0.48, 38.3],
  [-0.69, 37.63],
  [-0.98, 37.56],
  [-1.58, 37.38],
  [-2.19, 36.72],
  [-2.46, 36.82],
  [-3.52, 36.72],
  [-4.42, 36.68],
  [-4.88, 36.5],
  [-5.35, 36.13],
  [-5.6, 36.0],
  [-6.3, 36.52],
  [-6.35, 36.78],
  [-6.95, 37.2],
  [-7.4, 37.18],
  [-7.45, 37.6],
  [-6.93, 38.2],
  [-7.32, 38.45],
  [-7.0, 39.0],
  [-7.53, 39.66],
  [-6.87, 39.98],
  [-6.8, 40.35],
  [-6.93, 41.0],
  [-6.19, 41.57],
  [-6.6, 41.94],
  [-7.2, 41.88],
  [-8.05, 41.82],
  [-8.2, 42.14],
  [-8.87, 41.87],
  [-8.77, 42.25],
];
const ISLAS = [
  [
    [2.35, 39.58],
    [2.95, 39.92],
    [3.2, 39.9],
    [3.47, 39.72],
    [3.2, 39.3],
    [2.75, 39.33],
  ], // Mallorca
  [
    [3.8, 40.0],
    [4.2, 40.06],
    [4.32, 39.87],
    [4.0, 39.9],
  ], // Menorca
  [
    [1.22, 38.95],
    [1.5, 39.11],
    [1.62, 39.0],
    [1.37, 38.84],
  ], // Ibiza
  [
    [-16.92, 28.35],
    [-16.3, 28.58],
    [-16.12, 28.53],
    [-16.42, 28.12],
    [-16.7, 28.0],
  ], // Tenerife
  [
    [-15.8, 28.0],
    [-15.6, 28.17],
    [-15.37, 28.05],
    [-15.42, 27.8],
    [-15.65, 27.74],
  ], // Gran Canaria
  [
    [-14.5, 28.07],
    [-14.2, 28.2],
    [-13.85, 28.73],
    [-13.83, 28.4],
    [-14.3, 28.05],
  ], // Fuerteventura
  [
    [-13.87, 28.87],
    [-13.5, 29.22],
    [-13.42, 29.1],
    [-13.6, 28.9],
  ], // Lanzarote
  [
    [-18.0, 28.75],
    [-17.83, 28.85],
    [-17.73, 28.65],
    [-17.85, 28.46],
  ], // La Palma
  [
    [-17.34, 28.15],
    [-17.2, 28.2],
    [-17.1, 28.1],
    [-17.25, 28.02],
  ], // La Gomera
  [
    [-18.15, 27.75],
    [-17.95, 27.84],
    [-17.9, 27.7],
    [-18.0, 27.65],
  ], // El Hierro
];

/** Dónde colocar el nombre respecto al punto para que no se pisen. */
const ETIQUETA: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
  madrid: [0, -9, 'middle'],
  barcelona: [8, 4, 'start'],
  valencia: [8, 3, 'start'],
  sevilla: [-8, 3, 'end'],
  malaga: [0, 16, 'middle'],
  alicante: [8, 4, 'start'],
  baleares: [0, 17, 'middle'],
  laspalmas: [0, 17, 'middle'],
  tenerife: [0, -9, 'middle'],
  zaragoza: [0, -9, 'middle'],
  bizkaia: [6, -8, 'start'],
  murcia: [-8, 6, 'end'],
  coruna: [8, 12, 'start'],
  valladolid: [0, -9, 'middle'],
  granada: [-4, -9, 'middle'],
  asturias: [0, 15, 'middle'],
};

@Component({
  selector: 'app-mapa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FuenteIcono],
  template: `
    <div class="lienzo">
      <svg
        [attr.viewBox]="'0 0 ' + ancho + ' ' + alto"
        role="img"
        aria-label="Mapa de presión de vivienda por ciudad"
      >
        <defs>
          <filter id="mancha" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <clipPath id="tierra"><path [attr.d]="peninsula" /></clipPath>
        </defs>

        <path
          class="pais"
          [attr.d]="peninsula"
          [style.fill]="resto().color"
          (click)="sim.ciudadSel.set(restoId)"
          (mouseenter)="sobre.set(restoId)"
          (mouseleave)="sobre.set(null)"
        />
        @for (isla of islas; track $index) {
          <path class="isla" [attr.d]="isla" />
        }
        <rect
          class="recuadro"
          [attr.x]="recuadro.x"
          [attr.y]="recuadro.y"
          [attr.width]="recuadro.w"
          [attr.height]="recuadro.h"
          rx="6"
        />

        @for (c of ciudades(); track c.id) {
          <circle
            class="mancha"
            [attr.cx]="c.x"
            [attr.cy]="c.y"
            [attr.r]="c.r"
            [style.fill]="c.color"
            filter="url(#mancha)"
          />
        }
        @for (c of ciudades(); track c.id) {
          <g
            class="ciudad"
            [class.sel]="sim.ciudadSel() === c.id"
            (click)="sim.ciudadSel.set(c.id)"
            (mouseenter)="sobre.set(c.id)"
            (mouseleave)="sobre.set(null)"
          >
            <circle class="diana" [attr.cx]="c.x" [attr.cy]="c.y" r="14" />
            <circle class="punto" [attr.cx]="c.x" [attr.cy]="c.y" r="4" [style.fill]="c.color" />
            <text [attr.x]="c.x + c.dx" [attr.y]="c.y + c.dy" [attr.text-anchor]="c.ancla">
              {{ c.nombre }}
            </text>
          </g>
        }
      </svg>

      @if (detalle(); as d) {
        <div
          class="tooltip"
          [style.left.%]="d.left"
          [style.top.%]="d.top"
          [class.abajo]="d.top < 30"
        >
          <strong>{{ d.nombre }}</strong>
          <span
            >Presión <b>{{ d.presion }}</b> / 100</span
          >
          <span
            >Alquiler <b>{{ d.alquiler }}</b> · {{ d.esfuerzo }} de la renta</span
          >
          <span
            >Compra <b>{{ d.precio }}</b> · {{ d.anios }} años de renta</span
          >
          <span
            >En espera <b>{{ d.espera }}</b> familias</span
          >
        </div>
      }
    </div>
    <div class="leyenda">
      <span>Menos presión</span>
      <i [style.background]="rampa"></i>
      <span>Más presión</span>
      <span class="nota"
        >Tamaño de la mancha = hogares · el fondo es el resto de España<app-fuente [ids]="fuentes"
      /></span>
    </div>
  `,
  styles: `
    .lienzo {
      position: relative;
      max-width: 460px;
      margin-inline: auto;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    .pais {
      stroke: var(--borde-fuerte);
      stroke-width: 1;
      fill-opacity: 0.35;
      cursor: pointer;
    }
    .isla {
      fill: var(--superficie-2);
      stroke: var(--borde-fuerte);
      stroke-width: 1;
    }
    .recuadro {
      fill: none;
      stroke: var(--borde);
      stroke-dasharray: 3 3;
    }
    .mancha {
      opacity: 0.85;
      pointer-events: none;
    }
    .ciudad {
      cursor: pointer;
    }
    .diana {
      fill: transparent;
    }
    .punto {
      stroke: var(--superficie);
      stroke-width: 2;
    }
    .ciudad text {
      font-size: 10px;
      fill: var(--tinta-2);
      paint-order: stroke;
      stroke: var(--superficie);
      stroke-width: 3px;
    }
    .ciudad:hover text,
    .ciudad.sel text {
      fill: var(--tinta);
      font-weight: 600;
    }
    .ciudad.sel .punto {
      stroke: var(--tinta);
    }
    .tooltip {
      position: absolute;
      transform: translate(-50%, calc(-100% - 14px));
      pointer-events: none;
      z-index: 2;
      display: grid;
      gap: 2px;
      padding: 8px 10px;
      white-space: nowrap;
      font-size: 12px;
      color: var(--tinta-2);
      background: var(--superficie-3);
      border: 1px solid var(--borde-fuerte);
      border-radius: 8px;
      box-shadow: 0 6px 20px rgb(0 0 0 / 0.4);
    }
    .tooltip.abajo {
      transform: translate(-50%, 14px);
    }
    .tooltip strong,
    .tooltip b {
      color: var(--tinta);
    }
    .leyenda {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--tinta-3);
      flex-wrap: wrap;
    }
    .leyenda i {
      width: 120px;
      height: 8px;
      border-radius: 4px;
    }
    .nota {
      margin-left: auto;
    }
  `,
})
export class Mapa {
  protected readonly sim = inject(SimService);
  protected readonly ancho = ANCHO;
  protected readonly alto = ALTO;
  protected readonly restoId = RESTO;
  protected readonly fuentes: FuenteId[] = [
    'indicePresion',
    'hogaresProvincia',
    'precioAlquiler',
    'precioVenta',
    'rentaProvincia',
    'deficit',
  ];
  protected readonly peninsula = trazo(PENINSULA);
  protected readonly islas = ISLAS.map(trazo);
  protected readonly rampa = `linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1].map(colorCalor).join(', ')})`;
  protected readonly recuadro = (() => {
    const [x, y] = proyectar(-18.4, 29.45);
    const [x2, y2] = proyectar(-13.2, 27.45);
    return { x, y, w: x2 - x, h: y2 - y };
  })();
  protected readonly sobre = signal<string | null>(null);

  /** La presión real se mueve entre ~0,25 y ~0,9: se estira para aprovechar toda la rampa. */
  private readonly tono = (p: number) => colorCalor((p - 0.25) / 0.6);

  protected readonly ciudades = computed(() =>
    this.sim
      .estado()
      .ciudades.filter((c) => c.id !== RESTO)
      .map((c) => {
        const [x, y] = proyectar(c.lon, c.lat);
        const [dx, dy, ancla] = ETIQUETA[c.id] ?? [8, 4, 'start'];
        return {
          id: c.id,
          nombre: c.nombre,
          x,
          y,
          dx,
          dy,
          ancla,
          r: 9 + 24 * Math.sqrt(hogares(c) / 2.8e6),
          color: this.tono(presion(c)),
        };
      }),
  );

  protected readonly resto = computed(() => {
    const c = this.sim.estado().ciudades.find((x) => x.id === RESTO)!;
    return { color: this.tono(presion(c)) };
  });

  protected readonly detalle = computed(() => {
    const id = this.sobre();
    const c = this.sim.estado().ciudades.find((x) => x.id === id);
    if (!c) return null;
    const [x, y] = proyectar(c.lon, c.lat);
    return {
      nombre: c.nombre,
      left: (x / ANCHO) * 100,
      top: (y / ALTO) * 100,
      presion: Math.round(presion(c) * 100),
      alquiler: eur(c.alquiler),
      esfuerzo: pct(c.alquiler / (c.renta / 12), 0),
      precio: eur(c.precio),
      anios: dec(c.precio / c.renta),
      espera: compacto(c.espera),
    };
  });
}
