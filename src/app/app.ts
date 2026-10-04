import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { FuenteId } from './sim/datos/fuentes';
import { PARAMETROS as P } from './sim/datos/parametros';
import { hogares, presion, suma } from './sim/motor/indicadores';
import { SimService, VELOCIDADES } from './sim/sim.service';
import type { PuntoHistorial } from './sim/tipos';
import { Decretos } from './ui/decretos';
import { EscenaClima } from './ui/escena-clima';
import { Factores } from './ui/factores';
import { colorCalor, compacto, dec, eur, num, pct, tendencia, type Unidad } from './ui/formato';
import { FuenteIcono } from './ui/fuente';
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
    Factores,
    FuenteIcono,
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
  protected readonly pestana = signal<'decretos' | 'factores'>('decretos');
  protected readonly finVisto = signal(false);

  protected readonly fecha = computed(() =>
    this.sim
      .estado()
      .fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  );
  protected readonly tiempo = computed(() => {
    const s = this.sim.estado().semana;
    return s < 52 ? `semana ${s}` : `año ${Math.floor(s / 52) + 1}, semana ${s % 52}`;
  });

  /** La cartera del gobierno: lo que queda este mes, lo que entra, lo que se gasta y lo impreso. */
  protected readonly cartera = computed(() => {
    const e = this.sim.estado();
    const c = e.cartera;
    const gastoMes = e.gastoAnual / 12;
    const uso = c.presupuestoMensual ? gastoMes / c.presupuestoMensual : 0;
    const ipc = this.sim.f()('inflacion.general');
    return {
      saldo: c.saldo,
      saldoTexto: (c.saldo < 0 ? '−' : '') + meur(Math.abs(c.saldo)),
      presupuesto: meur(c.presupuestoMensual),
      gastoMes: meur(gastoMes),
      barra: Math.min(100, uso * 100),
      color: uso > 1 ? 'var(--mal)' : uso > 0.8 ? 'var(--aviso)' : 'var(--bien)',
      ipc: pct(ipc),
      impreso: c.impreso
        ? `${compacto(c.impresoAnio)} M€ impresos este año · ${compacto(c.impreso)} en total`
        : 'nada impreso',
      ayuda: `Cada mes la cartera vuelve a ${meur(c.presupuestoMensual)} y cada semana se descuenta el gasto de las leyes y la vivienda pública. Si acaba el mes en números rojos, la diferencia se imprime sola: cada 1.000 M€ impresos suben la inflación 0,08 puntos durante dos años y restan confianza. Mientras está en rojo, cada 1.000 M€ suman un punto de tensión.`,
    };
  });

  protected readonly semana = computed(() => {
    const e = this.sim.estado();
    const i = this.sim.ind();
    const fl = i.flujos;
    const h = e.historial;
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
          nombre: 'Alquiler medio',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.alquiler),
          fmt: eur,
          fuentes: ['precioAlquiler', 'superficieAlquiler'] as FuenteId[],
          valor: eur(i.alquilerMercado) + '/mes',
          nota: this.variacion(i.crecAlq),
        },
        {
          nombre: 'Precio medio de compra',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.precio),
          fmt: eur,
          fuentes: ['precioVenta', 'superficieVenta'] as FuenteId[],
          valor: eur(i.precioMedio),
          nota: this.variacion(i.crecVenta),
        },
        {
          nombre: 'Salario mínimo',
          bueno: 1 as -1 | 0 | 1,
          unidad: 'relativa' as Unidad,
          serie: h.map((p) => p.smi),
          fmt: eur,
          fuentes: ['smi', 'rentaHogar', 'salarios'] as FuenteId[],
          valor: eur(e.smi) + '/mes',
          nota: 'renta media del hogar ' + eur(i.rentaMedia / 12) + '/mes',
        },
        {
          nombre: 'Inflación (IPC)',
          bueno: -1 as -1 | 0 | 1,
          unidad: 'puntosPct' as Unidad,
          serie: h.map((p) => p.ipc),
          fmt: (v: number) => pct(v),
          fuentes: ['ipc', 'imprimir'] as FuenteId[],
          valor: pct(this.sim.f()('inflacion.general')),
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
            pct(this.sim.f()('hipoteca.tipo')) +
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
          'Mueve la construcción privada y las ganas de alquilar. La inflación y los números rojos la hunden.',
      },
    ];
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
    // Con el historial largo basta una muestra de cada pocas semanas.
    const paso = Math.ceil(hist.length / 80);
    return this.sim
      .estado()
      .ciudades.map((c, k) => {
        const p = presion(c);
        return {
          evolucion: this.chispa(hist, k, paso),
          id: c.id,
          nombre: c.nombre,
          principal: c.principal,
          orden: p,
          presion: Math.round(p * 100),
          color: colorCalor((p - 0.25) / 0.6),
          alquiler: eur(c.alquiler),
          crecAlq: this.variacion(c.crecAlq, false),
          precio: compacto(c.precio) + ' €',
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
