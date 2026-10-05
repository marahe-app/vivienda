import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ESTRATEGIA_POR_ID } from './sim/datos/estrategias';
import type { FuenteId } from './sim/datos/fuentes';
import { PARAMETROS as P } from './sim/datos/parametros';
import { hogares, presion, suma } from './sim/motor/indicadores';
import { apoyo } from './sim/motor/reglas/clima';
import { tipoHipoteca } from './sim/motor/reglas/economia';
import { SimService, VELOCIDADES } from './sim/sim.service';
import type { PuntoHistorial } from './sim/tipos';
import { Decretos } from './ui/decretos';
import { EscenaClima } from './ui/escena-clima';
import { Estrategias } from './ui/estrategias';
import { Factores } from './ui/factores';
import { colorCalor, compacto, dec, eur, num, pct, tendencia, type Unidad } from './ui/formato';
import { FuenteIcono } from './ui/fuente';
import { Historial } from './ui/historial';
import { hitosDecretos } from './ui/hitos';
import { Mapa } from './ui/mapa';
import { MiniSerie } from './ui/mini-serie';
import { Objetivos } from './ui/objetivos';
import { Partidas } from './ui/partidas';
import { Tarta } from './ui/tarta';

const meur = (v: number) => num(v) + ' M€';
/** Lienzo del minigráfico de presión de cada ciudad. */
const CHISPA = { w: 60, h: 14 };

@Component({
  imports: [
    Mapa,
    Tarta,
    Objetivos,
    Decretos,
    EscenaClima,
    Estrategias,
    Factores,
    FuenteIcono,
    Historial,
    MiniSerie,
    Partidas,
  ],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly sim = inject(SimService);
  protected readonly velocidades = VELOCIDADES;
  protected readonly fuenteResultado: FuenteId = 'resultado';
  protected readonly fuenteCoyuntura: FuenteId[] = ['coyuntura'];
  protected readonly fuentesCartera: FuenteId[] = [
    'pge',
    'eurostatVivienda',
    'planEstatal',
    'casa47',
    'imprimir',
  ];
  protected readonly columnas: { titulo: string; fuentes: FuenteId[] }[] = [
    { titulo: 'Ciudad', fuentes: [] },
    { titulo: 'Presión', fuentes: ['indicePresion'] },
    { titulo: 'Alquiler', fuentes: ['precioAlquiler', 'superficieAlquiler'] },
    { titulo: 'al año', fuentes: ['precioAlquiler'] },
    { titulo: 'Compra', fuentes: ['precioVenta', 'superficieVenta'] },
    { titulo: 'Años de renta', fuentes: ['precioVenta', 'rentaProvincia', 'rentaHogar'] },
    { titulo: 'En espera', fuentes: ['deficit', 'emancipacion'] },
    { titulo: 'Oferta alquiler', fuentes: ['ofertaAlquiler'] },
  ];
  protected readonly pestana = signal<'decretos' | 'estrategias' | 'factores'>('decretos');
  protected readonly finVisto = signal(false);
  protected readonly estrategiaEnMarcha = computed(() => {
    const a = this.sim.estrategia();
    return !!a?.activa && a.paso < (ESTRATEGIA_POR_ID.get(a.id)?.pasos.length ?? 0);
  });

  private readonly barra = viewChild.required<ElementRef<HTMLElement>>('barra');

  constructor() {
    // Lo que se pega bajo la cabecera necesita saber cuánto mide: cambia si sus elementos saltan de línea.
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      const barra = this.barra().nativeElement;
      const medir = () => el.style.setProperty('--alto-barra', barra.offsetHeight + 'px');
      const observador = new ResizeObserver(medir);
      observador.observe(barra);
      medir();
      destruir.onDestroy(() => observador.disconnect());
    });
  }

  protected readonly fecha = computed(() =>
    this.sim
      .estado()
      .fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  );
  protected readonly tiempo = computed(() => {
    const s = this.sim.estado().semana;
    return s < 52 ? `semana ${s}` : `año ${Math.floor(s / 52) + 1}, semana ${s % 52}`;
  });

  /** Pasa un importe de la semana en curso a euros de inicio: toda la interfaz enseña euros de hoy. */
  private real(v: number): number {
    return v / this.sim.estado().nivelPrecios;
  }

  /** La cartera del gobierno: lo que queda este mes, lo que entra, lo que se gasta, lo que se debe y lo impreso. */
  protected readonly cartera = computed(() => {
    const e = this.sim.estado();
    const c = e.cartera;
    const gastoMes = e.gastoAnual / 12;
    const ingresosMes = e.ingresosAnual / 12;
    const entra = c.presupuestoMensual + ingresosMes;
    const uso = entra > 0 ? gastoMes / entra : 1;
    const ipc = this.sim.f()('inflacion.general');
    const presupuesto = meur(this.real(c.presupuestoMensual));
    const deuda = this.real(c.deuda);
    return {
      saldo: c.saldo,
      saldoTexto: (c.saldo < 0 ? '−' : '') + meur(Math.abs(this.real(c.saldo))),
      presupuesto,
      ingresos:
        Math.abs(ingresosMes) >= 0.5
          ? ` + ${meur(this.real(ingresosMes))} de alquileres públicos e IVA de la obra`
          : '',
      gastoMes: meur(this.real(gastoMes)),
      barra: Math.min(100, uso * 100),
      color: uso > 1 ? 'var(--mal)' : uso > 0.8 ? 'var(--aviso)' : 'var(--bien)',
      ipc: pct(ipc),
      deuda: deuda >= 0.5 ? `debe ${compacto(deuda)} M€` : '',
      impreso: c.impreso ? ` · ${compacto(c.impreso)} M€ impresos` : '',
      ayuda: `Todos los importes van en euros de hoy, descontada la inflación. Cada mes la cartera vuelve a ${presupuesto}; cada semana suma lo que rentan las viviendas públicas que posee (alquiler social menos gestión) y el IVA de la obra nueva que se añade, y descuenta el gasto de las leyes y la vivienda pública. Si acaba el mes en números rojos, la diferencia pasa a deuda: paga intereses y, por cada 10.000 M€, suma un punto de tensión y resta uno de confianza. Si sobra dinero, la deuda se amortiza. Imprimir evita endeudarse, pero cada 1.000 M€ suben la inflación 0,08 puntos durante dos años y restan confianza. Mientras está en rojo, cada 1.000 M€ suman un punto de tensión.`,
    };
  });

  protected readonly semana = computed(() => {
    const e = this.sim.estado();
    const i = this.sim.ind();
    const fl = i.flujos;
    const h = e.historial;
    const ipc = this.sim.f()('inflacion.general');
    const buscan = fl.inmigrantes + fl.emancipados + fl.desahucios + fl.noRenovados;
    return {
      semanas: h.map((p) => p.semana),
      filas: [
        {
          nombre: 'Familias que llegan del exterior',
          bueno: 0 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.inmigrantes),
          fmt: num,
          fuentes: ['inmigracion', 'inmigracionProvincia'] as FuenteId[],
          valor: num(fl.inmigrantes),
          nota: compacto(e.contadores.inmigrantesDesde2018) + ' desde 2018',
        },
        {
          nombre: 'Familias nuevas que buscan casa',
          bueno: 0 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.emancipados),
          fmt: num,
          fuentes: ['emancipacionDerivada', 'emancipacion', 'edadEmancipacion'] as FuenteId[],
          valor: num(fl.emancipados),
          nota: '',
        },
        {
          nombre: 'Familias expulsadas de su alquiler',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.desahucios + p.flujos.noRenovados),
          fmt: num,
          fuentes: ['lanzamientos', 'noRenovaciones'] as FuenteId[],
          valor: num(fl.desahucios + fl.noRenovados),
          nota: `${num(fl.desahucios)} desahucios · ${num(fl.noRenovados)} no renovaciones`,
        },
        {
          nombre: 'Logran vivienda',
          bueno: 1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.logran),
          fmt: num,
          fuentes: ['resultado'] as FuenteId[],
          valor: num(fl.logran),
          nota: buscan
            ? pct(Math.min(1, fl.logran / buscan), 0) + ' de las que entran a buscar'
            : '',
          tono: 'bien',
        },
        {
          nombre: 'No lo logran',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.noLogran),
          fmt: num,
          fuentes: ['resultado', 'deficit'] as FuenteId[],
          valor: num(fl.noLogran),
          nota: compacto(i.espera) + ' familias en espera',
          tono: 'mal',
        },
        {
          nombre: 'Viviendas terminadas',
          bueno: 1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.construidas),
          fmt: num,
          fuentes: ['terminadas', 'visados', 'licencias'] as FuenteId[],
          valor: num(fl.construidas),
          nota: compacto(e.contadores.construidas) + ' desde el inicio',
        },
        {
          nombre: 'Vivienda existente que sale al mercado',
          bueno: 1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.flujos.nuevaOferta),
          fmt: num,
          fuentes: ['ofertaVenta', 'ofertaAlquiler'] as FuenteId[],
          valor: num(fl.nuevaOferta),
          nota: `${compacto(i.ofAlquiler)} en alquiler · ${compacto(i.ofVenta)} en venta`,
        },
      ],
      precios: [
        {
          nombre: 'Alquiler de un piso que se anuncia hoy',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.alquiler / p.nivelPrecios),
          fmt: eur,
          fuentes: ['precioAlquiler', 'superficieAlquiler'] as FuenteId[],
          valor: eur(this.real(i.alquilerMercado)) + '/mes',
          nota:
            this.variacion(i.crecAlq - ipc) +
            ' · los inquilinos con contrato pagan ' +
            eur(this.real(i.alquilerPagado)),
        },
        {
          nombre: 'Precio medio de compra',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.precio / p.nivelPrecios),
          fmt: eur,
          fuentes: ['precioVenta', 'superficieVenta'] as FuenteId[],
          valor: eur(this.real(i.precioMedio)),
          nota: this.variacion(i.crecVenta - ipc),
        },
        {
          nombre: 'Salario mínimo',
          bueno: 1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.smi / p.nivelPrecios),
          fmt: eur,
          fuentes: ['smi', 'rentaHogar', 'salarios'] as FuenteId[],
          valor: eur(this.real(e.smi)) + '/mes',
          nota: 'renta media del hogar ' + eur(this.real(i.rentaMedia) / 12) + '/mes',
        },
        {
          nombre: 'Inflación (IPC)',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'puntosPct' as Unidad,
          serie: h.map((p) => p.ipc),
          fmt: (v: number) => pct(v),
          fuentes: ['ipc', 'imprimir'] as FuenteId[],
          valor: pct(ipc),
          nota:
            'de fondo ' +
            pct(0.031) +
            ' · los salarios recogen el ' +
            pct(P.traspasoInflacion, 0) +
            ' del exceso',
        },
        {
          nombre: 'Impuestos a la compra',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'puntosPct' as Unidad,
          serie: h.map((p) => p.impuestoCompra),
          fmt: (v: number) => pct(v, 0),
          fuentes: ['impuestoCompra'] as FuenteId[],
          valor: pct(this.sim.f()('impuesto.compra'), 0),
          nota:
            'hipoteca al ' +
            pct(tipoHipoteca(e, this.sim.f())) +
            ' a ' +
            num(this.sim.f()('hipoteca.plazo')) +
            ' años',
        },
      ],
    };
  });

  protected readonly clima = computed(() => {
    const e = this.sim.estado();
    const t = e.tension;
    const c = e.confianza;
    const inicio = e.historial[0];
    return [
      {
        nombre: 'Tensión social',
        tendencia: tendencia(inicio?.tension ?? t, t, 'puntos', -1),
        fuentes: ['tensionSocial'] as FuenteId[],
        valor: t,
        texto:
          t < 35
            ? 'Calma'
            : t < 60
              ? 'Malestar'
              : t < 80
                ? '⚠ Protestas'
                : '⚠ Al borde del estallido',
        color: t < 35 ? 'var(--bien)' : t < 60 ? 'var(--aviso)' : 'var(--mal)',
        ayuda: 'Si llega a 100, cae el gobierno. La marcan las grandes ciudades.',
      },
      {
        nombre: 'Confianza de propietarios e inversores',
        tendencia: tendencia(inicio?.confianza ?? c, c, 'puntos', 1),
        fuentes: ['resultado'] as FuenteId[],
        valor: c,
        texto: c < 30 ? '⚠ Huida del mercado' : c < 50 ? 'Recelo' : c < 70 ? 'Normal' : 'Optimismo',
        color: c < 30 ? 'var(--mal)' : c < 50 ? 'var(--aviso)' : 'var(--bien)',
        ayuda:
          'Mueve la construcción privada, las ganas de alquilar y el tipo de las hipotecas. La inflación, los números rojos, la deuda, la caída del precio de la vivienda y las recesiones la hunden.',
      },
      this.apoyoElectoral(),
    ];
  });

  protected readonly final = computed(() => {
    const e = this.sim.estado();
    const postura = `«${this.sim.postura().etiqueta}»`;
    if (e.fin === 'victoria')
      return {
        titulo: 'Objetivo conseguido',
        texto: `Has cumplido las tres condiciones en ${this.tiempo()}, con una postura ${postura}.`,
      };
    return e.motivoFin === 'elecciones'
      ? {
          titulo: 'Has perdido las elecciones',
          texto: `El apoyo al gobierno no llegaba a ${P.elecciones.umbral} en ${this.tiempo()}. Tu postura: ${postura}.`,
        }
      : {
          titulo: 'El gobierno ha caído',
          texto: `La tensión social ha llegado al límite en ${this.tiempo()}. Tu postura: ${postura}.`,
        };
  });

  private apoyoElectoral() {
    const e = this.sim.estado();
    const a = apoyo(e);
    const umbral = P.elecciones.umbral;
    const meses = Math.max(0, Math.ceil(((e.eleccion.semana - e.semana) * 12) / 52));
    return {
      nombre: 'Apoyo al gobierno',
      tendencia: {
        sentido: 0 as -1 | 0 | 1,
        texto: `Elecciones en ${meses} ${meses === 1 ? 'mes' : 'meses'} · se pierden con menos de ${umbral}`,
        tono: a < umbral ? 'mal' : '',
      },
      fuentes: ['elecciones'] as FuenteId[],
      valor: a,
      texto: a < umbral ? '⚠ Perdería las elecciones' : a < umbral + 8 ? 'Justo' : 'Suficiente',
      color: a < umbral ? 'var(--mal)' : a < umbral + 8 ? 'var(--aviso)' : 'var(--bien)',
      ayuda:
        'Cada cuatro años hay elecciones. El apoyo baja con la tensión social y sube si la tensión ha mejorado desde las anteriores.',
    };
  }

  /** La coyuntura económica del momento, que el jugador no controla. */
  protected readonly coyuntura = computed(() => {
    const c = this.sim.estado().coyuntura;
    const nombre =
      c < -0.5
        ? 'recesión'
        : c < -0.15
          ? 'economía floja'
          : c <= 0.15
            ? 'economía normal'
            : c <= 0.5
              ? 'economía al alza'
              : 'expansión';
    return `Coyuntura: ${nombre}. Mueve los sueldos, las llegadas, los tipos de interés y la confianza.`;
  });

  protected readonly presiones = computed(() => {
    const p = this.sim.ind().presion;
    return `Presión media del país ${Math.round(p.ponderada * 100)} · grandes ciudades ${Math.round(p.principales * 100)}. La tensión sigue a la mayor de las dos.`;
  });

  /** Decretos sobre los minigráficos de presión de la tabla. */
  protected readonly hitos = computed(() => {
    const e = this.sim.estado();
    return hitosDecretos(
      e.decretosPromulgados,
      e.historial.map((p) => p.semana),
      CHISPA.w,
    ).map((h) => h.x);
  });

  protected readonly tabla = computed(() => {
    const hist = this.sim.estado().historial;
    const ayuda = this.sim.ayuda();
    // Con el historial largo basta una muestra de cada pocas semanas.
    const paso = Math.ceil(hist.length / 80);
    return this.sim
      .estado()
      .ciudades.map((c, k) => {
        const p = presion(c, ayuda);
        return {
          evolucion: this.chispa(hist, k, paso),
          id: c.id,
          nombre: c.nombre,
          principal: c.principal,
          orden: p,
          presion: Math.round(p * 100),
          color: colorCalor((p - 0.25) / 0.6),
          alquiler: eur(this.real(c.alquiler)),
          crecAlq: this.variacion(c.crecAlq - this.sim.f()('inflacion.general'), false),
          precio: compacto(this.real(c.precio)) + ' €',
          anios: dec(c.precio / c.renta),
          espera: pct(c.espera / (hogares(c) + c.espera)),
          oferta: compacto(suma(c, 'ofAlquiler')),
        };
      })
      .sort((a, b) => b.orden - a.orden);
  });

  /** Línea de la presión de una ciudad desde el inicio: verde si ha bajado, roja si ha subido. */
  private chispa(hist: PuntoHistorial[], k: number, paso: number) {
    const pts: [number, number][] = [];
    hist.forEach((h, i) => {
      // Las partidas antiguas no guardan la presión por ciudad.
      const v = h.presiones?.[k];
      if (v !== undefined && (i % paso === 0 || i === hist.length - 1)) pts.push([i, v]);
    });
    if (pts.length < 2) return { d: '', color: 'var(--tinta-3)', ayuda: '' };
    const vs = pts.map(([, v]) => v);
    // Con un rango mínimo de 5 puntos, una ciudad estable se ve plana y no como ruido ampliado.
    const medio = (Math.min(...vs) + Math.max(...vs)) / 2;
    const rango = Math.max(0.05, Math.max(...vs) - Math.min(...vs));
    const y = (v: number) => 1 + (CHISPA.h - 2) * (0.5 - (v - medio) / rango);
    const x = (i: number) => (i / (hist.length - 1)) * CHISPA.w;
    const inicio = Math.round(vs[0] * 100);
    const actual = Math.round(vs[vs.length - 1] * 100);
    return {
      d: pts
        .map(([i, v], n) => (n ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1))
        .join(' '),
      color: actual > inicio ? 'var(--mal)' : actual < inicio ? 'var(--bien)' : 'var(--tinta-3)',
      ayuda: `Presión: ${inicio} al inicio, ${actual} ahora`,
    };
  }

  /** Variación anual por encima (o por debajo) de la inflación. */
  private variacion(v: number, conTexto = true): string {
    return (v >= 0 ? '+' : '−') + pct(Math.abs(v)) + (conTexto ? ' al año' : '');
  }

  protected velocidad(v: number) {
    this.sim.velocidad.set(this.sim.velocidad() === v ? 0 : v);
  }

  protected reiniciar() {
    this.finVisto.set(false);
    this.sim.reiniciar();
  }
}
