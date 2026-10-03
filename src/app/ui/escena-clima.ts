import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const W = 320;
const H = 120;
/** Altura de la acera: base de los edificios. */
const SUELO = 92;

// Fachadas de la calle: [x, ancho, alto].
const EDIFICIOS = [
  [0, 26, 34],
  [28, 20, 52],
  [50, 30, 28],
  [82, 18, 60],
  [102, 34, 40],
  [138, 22, 70],
  [162, 28, 36],
  [192, 20, 56],
  [214, 32, 30],
  [248, 24, 48],
  [274, 20, 64],
  [296, 24, 38],
];
/** Segunda línea de edificios, más lejana, que asoma por detrás. */
const FONDO = Array.from({ length: 17 }, (_, i) => {
  const w = 16 + ((i * 7) % 9);
  const h = 44 + ((i * 37) % 30);
  return `M${i * 20 - 4} ${SUELO} v${-h} h${w} v${h} Z`;
}).join(' ');
/** Fachadas con un depósito en la azotea de una de cada tres. */
const SILUETA = EDIFICIOS.map(([x, w, h], k) => {
  const deposito = k % 3 === 1 ? ` M${x + 4} ${SUELO - h} v-5 h7 v5 Z` : '';
  return `M${x} ${SUELO} v${-h} h${w} v${h} Z${deposito}`;
}).join(' ');
const ANTENAS = EDIFICIOS.filter((_, k) => k % 3 === 0)
  .map(([x, w, h]) => `M${x + w / 2} ${SUELO - h} v-9 m-3 2.5 h6 m-5 2.5 h4`)
  .join(' ');

function ventanas(encendida: (i: number, j: number, k: number) => boolean): string {
  return EDIFICIOS.flatMap(([x, w, h], k) => {
    const huecos: string[] = [];
    for (let i = 0; x + 4 + i * 7 + 3 <= x + w - 3; i++)
      // Deja libre la planta baja, donde van los comercios.
      for (let j = 0; 6 + j * 9 + 4 <= h - 12; j++)
        if (encendida(i, j, k))
          huecos.push(`M${x + 4 + i * 7} ${SUELO - h + 6 + j * 9} h3 v4 h-3 Z`);
    return huecos;
  }).join(' ');
}
const CRISTALES = ventanas(() => true);
const LUCES = ventanas((i, j, k) => (i * 7 + j * 13 + k * 5) % 3 === 0);

/** Comercios en los bajos de los edificios anchos: abiertos en calma, con la persiana echada en las protestas. */
const TIENDAS = EDIFICIOS.filter(([, w]) => w >= 26);
const ESCAPARATES = TIENDAS.map(([x, w]) => `M${x + 3} ${SUELO - 8} h${w - 6} v8 h${6 - w} Z`).join(
  ' ',
);
const TOLDOS = TIENDAS.map(
  ([x, w]) => `M${x + 2} ${SUELO - 11} h${w - 4} l1.5 3 h${-(w - 1)} Z`,
).join(' ');
const PERSIANAS = TIENDAS.map(([x, w]) =>
  [6, 4, 2].map((dy) => `M${x + 3} ${SUELO - dy} h${w - 6}`).join(' '),
).join(' ');

const FAROLAS = [52, 160, 268];
const ARBOLES = [18, 122, 204, 302];

/** Nubes [x, y, escala]: cada nivel enseña unas cuantas más; en el estallido las tapa el humo. */
const NUBES = [
  [60, 20, 1],
  [236, 16, 0.9],
  [150, 12, 1.2],
  [200, 28, 0.9],
  [100, 32, 0.8],
];
const NUBES_NIVEL = [2, 4, 5, 3];

const ROPA = ['#c9d2da', '#8fa3b5', '#d9b38c', '#c58a94', '#8fb39a', '#e0c56e', '#a99bd6'];
const PIEL = ['#f0c9a4', '#d9a57c', '#a8744f', '#7a5238'];
/** Gente en la calle: siempre en el mismo sitio, cada nivel suma más. */
const GENTE = Array.from({ length: 40 }, (_, i) => {
  const fila = i % 3;
  return {
    i,
    transform: `translate(${8 + ((i * 89) % 304)} ${102 + fila * 5.5}) scale(${0.9 + fila * 0.12})`,
    fila,
    ropa: ROPA[(i * 5) % ROPA.length],
    piel: PIEL[(i * 3) % PIEL.length],
    pancarta: i % 4 === 1,
    brazo: i % 3 === 0,
    retardo: `${-((i * 37) % 90) / 100}s`,
  };
});
const GENTE_NIVEL = [5, 12, 26, 40];

const HOGUERAS = [78, 214];
/** Columna de humo sobre cada hoguera: [dx, dy, radio]. */
const HUMO = [
  [0, -22, 5],
  [3, -34, 7],
  [7, -47, 9],
  [12, -61, 11],
  [18, -76, 13],
];
const ANTIDISTURBIOS = [246, 253, 260, 267, 274];
const NIVELES = ['calma', 'malestar', 'protestas', 'estallido'] as const;

/**
 * Viñeta de la calle que resume el clima social: de un día tranquilo con los comercios abiertos
 * a la manifestación y, al final, los disturbios con hogueras y antidisturbios.
 */
@Component({
  selector: 'app-escena-clima',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + w + ' ' + h"
      [class]="nombre()"
      role="img"
      [attr.aria-label]="'Clima social: ' + nombre()"
    >
      <defs>
        <linearGradient id="ec-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop class="c1" offset="0" />
          <stop class="c2" offset="1" />
        </linearGradient>
        <radialGradient id="ec-sol">
          <stop offset="0" stop-color="#fff3c4" stop-opacity="0.9" />
          <stop offset="1" stop-color="#fff3c4" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="ec-halo">
          <stop offset="0" stop-color="#ffd98a" stop-opacity="0.75" />
          <stop offset="1" stop-color="#ffd98a" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="ec-fuego">
          <stop offset="0" stop-color="#ff8a3c" stop-opacity="0.8" />
          <stop offset="1" stop-color="#ff5a1c" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect fill="url(#ec-cielo)" [attr.width]="w" [attr.height]="h" />
      @if (nivel() < 2) {
        <g class="sol">
          <circle cx="270" cy="24" r="26" fill="url(#ec-sol)" />
          <circle cx="270" cy="24" r="9" fill="#ffe08a" />
        </g>
      }
      @for (n of nubes(); track $index) {
        <g
          class="nube"
          [attr.transform]="'translate(' + n[0] + ' ' + n[1] + ') scale(' + n[2] + ')'"
        >
          <ellipse rx="16" ry="6" />
          <ellipse cx="-9" cy="2.5" rx="11" ry="4.5" />
          <ellipse cx="8" cy="-4" rx="9" ry="6" />
        </g>
      }

      <path class="fondo" [attr.d]="fondo" />
      <path class="antenas" [attr.d]="antenas" />
      <path class="edificios" [attr.d]="silueta" />
      <path class="cristales" [attr.d]="cristales" />
      <path class="luces" [attr.d]="luces" />
      <path class="escaparates" [attr.d]="escaparates" />
      <path class="persianas" [attr.d]="persianas" />
      <path class="toldos" [attr.d]="toldos" />

      <rect class="acera" [attr.y]="suelo" [attr.width]="w" height="7" />
      <rect class="calzada" [attr.y]="suelo + 7" [attr.width]="w" [attr.height]="h - suelo - 7" />
      <path class="carril" [attr.d]="'M0 ' + (h - 3) + ' H' + w" />

      @for (x of arboles; track x) {
        <g class="arbol" [attr.transform]="'translate(' + x + ' ' + (suelo + 4) + ')'">
          <rect class="tronco" x="-1" y="-12" width="2" height="12" />
          <circle class="copa" cy="-17" r="8" />
          <circle class="copa clara" cx="-3" cy="-19.5" r="4.5" />
        </g>
      }
      @for (x of farolas; track x) {
        <g [attr.transform]="'translate(' + x + ' ' + (suelo + 5) + ')'">
          <circle class="halo" cx="6" cy="-29" r="13" fill="url(#ec-halo)" />
          <path class="poste" d="M0 0 v-25 q0 -4 5 -4" />
          <circle class="bombilla" cx="6" cy="-28.5" r="1.8" />
        </g>
      }

      @if (nivel() === 3) {
        @for (x of hogueras; track x) {
          <g [attr.transform]="'translate(' + x + ' 109)'">
            @for (c of humo; track $index) {
              <circle
                class="humo"
                [attr.cx]="c[0]"
                [attr.cy]="c[1]"
                [attr.r]="c[2]"
                [style.animation-delay]="-$index * 0.7 + 's'"
              />
            }
            <circle cy="-6" r="34" fill="url(#ec-fuego)" />
            <rect class="contenedor" x="7" y="-7" width="14" height="7" rx="1" />
            <path class="llama" d="M0 0 C-9 -6 -5 -14 0 -22 C2 -14 10 -9 0 0 Z" />
            <path class="brasa" d="M0 0 C-4 -3 -2 -8 0 -12 C1 -8 5 -4 0 0 Z" />
          </g>
        }
      }
      @if (nivel() >= 2) {
        <g class="furgon" transform="translate(284 106)">
          <rect class="sirena a" x="11" y="-17.5" width="4.5" height="2.5" rx="1" />
          <rect class="sirena b" x="15.5" y="-17.5" width="4.5" height="2.5" rx="1" />
          <rect class="chapa" y="-15" width="32" height="12" rx="2" />
          <path class="luna" d="M2 -13 h7 v4 h-8 Z M12 -13 h5 v4 h-5 Z M19 -13 h5 v4 h-5 Z" />
          <rect class="franja" y="-7.5" width="32" height="1.5" />
          <circle class="rueda" cx="7" cy="-2.5" r="3" />
          <circle class="rueda" cx="25" cy="-2.5" r="3" />
        </g>
      }
      @if (nivel() === 3) {
        @for (x of antidisturbios; track x) {
          <g class="agente" [attr.transform]="'translate(' + x + ' 108)'">
            <path class="piernas" d="M-1.1 0v-4.5M1.1 0v-4.5" />
            <rect x="-2.4" y="-10.5" width="4.8" height="6.8" rx="1.5" />
            <circle cy="-12.6" r="2.3" />
            <rect class="escudo" x="-5.5" y="-11" width="4" height="10" rx="1" />
          </g>
        }
      }

      <g class="gente">
        @for (p of gente(); track p.i) {
          <g [attr.transform]="p.transform">
            <g class="cuerpo" [style.animation-delay]="p.retardo">
              @if (p.pancarta && nivel() >= 1) {
                <line class="palo" x1="3.2" y1="-9" x2="3.2" y2="-21" />
                <rect class="pancarta" x="-1.5" y="-26.5" width="9.5" height="6" rx="0.8" />
                <path class="letras" d="M0 -24.6h6.5M0 -22.6h4.5" />
              }
              @if (p.brazo && nivel() >= 2) {
                <path class="brazo" d="M-1.6 -9 l-2.6 -5.2" [attr.stroke]="p.ropa" />
              }
              <path class="piernas" d="M-1.1 0v-4.5M1.1 0v-4.5" />
              <rect x="-2.3" y="-10.5" width="4.6" height="6.8" rx="1.7" [attr.fill]="p.ropa" />
              <circle cy="-12.6" r="2" [attr.fill]="p.piel" />
            </g>
          </g>
        }
      </g>

      @if (nivel() >= 2) {
        <g class="lema">
          <path class="palo" d="M119 108 V70 M171 108 V70" />
          <rect class="pancarta" x="118" y="69" width="54" height="11" rx="1" />
          <text x="145" y="77.2" textLength="46" lengthAdjust="spacingAndGlyphs">
            VIVIENDA DIGNA
          </text>
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
      /* Colores de la escena en calma; cada nivel los va oscureciendo. */
      --cielo-1: #2f78b7;
      --cielo-2: #bfe0f2;
      --nube: #f2f7fb;
      --fondo: #7fa3c2;
      --fachada: #3e4c5c;
      --luz: #ffe9a8;
      --luz-op: 0.3;
      --acera: #8b9299;
      --calzada: #4a4f55;
      --copa: #4c8f5c;
      --pancarta: #f5f1e6;
    }
    svg.malestar {
      --cielo-1: #4a5866;
      --cielo-2: #a9afb3;
      --nube: #b9c0c6;
      --fondo: #6f7c86;
      --fachada: #333b44;
      --luz-op: 0.55;
      --acera: #6c7279;
      --calzada: #3b4046;
      --copa: #447a52;
      --pancarta: #f1cf5a;
    }
    svg.protestas {
      --cielo-1: #1d2030;
      --cielo-2: #86606a;
      --nube: #4c4a5a;
      --fondo: #3f3c4c;
      --fachada: #1a1c24;
      --luz: #ffd27a;
      --luz-op: 0.8;
      --acera: #3d4047;
      --calzada: #24272c;
      --copa: #2c4a38;
    }
    svg.estallido {
      --cielo-1: #120b10;
      --cielo-2: #8a3418;
      --nube: #2c2228;
      --fondo: #3d1d18;
      --fachada: #120d10;
      --luz: #ff9a4a;
      --luz-op: 0.5;
      --acera: #33282a;
      --calzada: #1c1719;
      --copa: #26302a;
      --pancarta: #e2493f;
    }
    path,
    rect,
    circle,
    ellipse,
    stop {
      transition:
        fill 0.6s,
        stop-color 0.6s,
        opacity 0.6s;
    }
    .c1 {
      stop-color: var(--cielo-1);
    }
    .c2 {
      stop-color: var(--cielo-2);
    }
    .malestar .sol {
      opacity: 0.45;
    }
    .nube {
      fill: var(--nube);
      opacity: 0.9;
    }
    .fondo {
      fill: var(--fondo);
    }
    .edificios {
      fill: var(--fachada);
    }
    .antenas {
      fill: none;
      stroke: var(--fachada);
      stroke-width: 0.8;
    }
    .cristales {
      fill: #fff;
      opacity: 0.08;
    }
    .luces {
      fill: var(--luz);
      opacity: var(--luz-op);
    }
    .escaparates {
      fill: #ffdf94;
      opacity: 0.85;
    }
    .toldos {
      fill: #c0563f;
    }
    .persianas {
      fill: none;
      stroke: #6a7078;
      stroke-width: 0.7;
      opacity: 0;
    }
    /* Con las protestas los comercios echan la persiana. */
    .protestas .escaparates,
    .estallido .escaparates {
      fill: #2b2f35;
      opacity: 1;
    }
    .protestas .persianas,
    .estallido .persianas {
      opacity: 1;
    }
    .protestas .toldos,
    .estallido .toldos {
      fill: #5a2f28;
    }
    .acera {
      fill: var(--acera);
    }
    .calzada {
      fill: var(--calzada);
    }
    .carril {
      fill: none;
      stroke: #fff;
      stroke-width: 1;
      stroke-dasharray: 10 8;
      opacity: 0.25;
    }
    .tronco {
      fill: #4a3a2c;
    }
    .copa {
      fill: var(--copa);
    }
    .copa.clara {
      fill: #fff;
      opacity: 0.12;
    }
    .poste {
      fill: none;
      stroke: #14161a;
      stroke-width: 1.2;
      stroke-linecap: round;
    }
    .bombilla {
      fill: #5f666e;
    }
    .halo {
      opacity: 0;
    }
    /* Las farolas se encienden cuando el día se apaga. */
    .protestas .halo,
    .estallido .halo {
      opacity: 1;
    }
    .protestas .bombilla,
    .estallido .bombilla {
      fill: #ffe7a8;
    }
    .piernas {
      fill: none;
      stroke: #23262b;
      stroke-width: 1.4;
      stroke-linecap: round;
    }
    .brazo {
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .palo {
      fill: none;
      stroke: #8a7a66;
      stroke-width: 0.9;
    }
    .pancarta {
      fill: var(--pancarta);
      stroke: rgb(0 0 0 / 0.35);
      stroke-width: 0.4;
    }
    .letras {
      fill: none;
      stroke: #23262b;
      stroke-width: 0.8;
      opacity: 0.7;
    }
    .lema text {
      font:
        700 5.5px system-ui,
        sans-serif;
      text-anchor: middle;
      fill: #1b1d22;
    }
    .estallido .lema text {
      fill: #fff;
    }
    .protestas .gente {
      filter: brightness(0.82);
    }
    .estallido .gente {
      filter: brightness(0.62) sepia(0.35);
    }
    /* La multitud salta y corea a partir de las protestas. */
    .protestas .cuerpo,
    .estallido .cuerpo {
      animation: corear 0.9s ease-in-out infinite alternate;
    }
    .estallido .cuerpo {
      animation-duration: 0.55s;
    }
    .chapa {
      fill: #1f3357;
    }
    .luna {
      fill: #a9cbea;
      opacity: 0.8;
    }
    .franja {
      fill: #e8edf2;
    }
    .rueda {
      fill: #0c0d0f;
      stroke: #5a6068;
      stroke-width: 0.8;
    }
    .sirena {
      fill: #4d8dff;
    }
    .estallido .sirena {
      animation: sirena 0.7s steps(1) infinite;
    }
    .estallido .sirena.b {
      animation-delay: -0.35s;
    }
    .agente rect,
    .agente circle {
      fill: #1b2740;
    }
    .agente .escudo {
      fill: #bcd6ee;
      opacity: 0.55;
    }
    .contenedor {
      fill: #1d2226;
      transform: rotate(8deg);
    }
    .humo {
      fill: #2a2326;
      opacity: 0.5;
      transform-box: fill-box;
      transform-origin: center;
      animation: humear 3.5s ease-in-out infinite alternate;
    }
    .llama {
      fill: #ff6a2a;
    }
    .brasa {
      fill: #ffd060;
    }
    .llama,
    .brasa {
      transform-box: fill-box;
      transform-origin: center bottom;
      animation: arder 0.45s ease-in-out infinite alternate;
    }
    .brasa {
      animation-duration: 0.3s;
    }
    @keyframes corear {
      to {
        transform: translateY(-1.6px);
      }
    }
    @keyframes sirena {
      50% {
        fill: #ff4b4b;
      }
    }
    @keyframes humear {
      to {
        transform: translate(5px, -6px) scale(1.2);
        opacity: 0.3;
      }
    }
    @keyframes arder {
      to {
        transform: scale(0.9, 1.18);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .cuerpo,
      .sirena,
      .humo,
      .llama,
      .brasa {
        animation: none !important;
      }
    }
  `,
})
export class EscenaClima {
  /** Tensión social, de 0 a 100. */
  readonly tension = input.required<number>();

  protected readonly w = W;
  protected readonly h = H;
  protected readonly suelo = SUELO;
  protected readonly fondo = FONDO;
  protected readonly silueta = SILUETA;
  protected readonly antenas = ANTENAS;
  protected readonly cristales = CRISTALES;
  protected readonly luces = LUCES;
  protected readonly escaparates = ESCAPARATES;
  protected readonly toldos = TOLDOS;
  protected readonly persianas = PERSIANAS;
  protected readonly farolas = FAROLAS;
  protected readonly arboles = ARBOLES;
  protected readonly hogueras = HOGUERAS;
  protected readonly humo = HUMO;
  protected readonly antidisturbios = ANTIDISTURBIOS;

  /** Mismos umbrales que el texto del medidor: calma, malestar, protestas y estallido. */
  protected readonly nivel = computed(() => {
    const t = this.tension();
    return t < 35 ? 0 : t < 60 ? 1 : t < 80 ? 2 : 3;
  });
  protected readonly nombre = computed(() => NIVELES[this.nivel()]);
  protected readonly nubes = computed(() => NUBES.slice(0, NUBES_NIVEL[this.nivel()]));
  /** Las filas del fondo se pintan antes para que las de delante las tapen. */
  protected readonly gente = computed(() =>
    GENTE.slice(0, GENTE_NIVEL[this.nivel()]).sort((a, b) => a.fila - b.fila),
  );
}
