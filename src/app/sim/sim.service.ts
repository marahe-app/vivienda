import { Injectable, computed, signal } from '@angular/core';
import { DECRETO_POR_ID } from './datos/decretos';
import { ESTRATEGIA_POR_ID, cambioDe } from './datos/estrategias';
import { contexto, indicadores, postura } from './motor/indicadores';
import { crearResolver } from './motor/modificadores';
import { avanzarSemana, crearEstado, imprimir, promulgar } from './motor/motor';
import { ayudaAlquiler } from './motor/reglas/economia';
import type { Cambio, Estado } from './tipos';

/** Estrategia preparada que el simulador va promulgando solo, un paso por mes. */
export interface Automatica {
  id: string;
  /** Índice del siguiente paso por aplicar. */
  paso: number;
  /** Pasos que no se pudieron promulgar (por ejemplo, la ley ya estaba en vigor con ese valor). */
  saltados: number[];
  /** false si el jugador la ha detenido a medias. */
  activa: boolean;
}

/** Cada partida nueva tiene su propia coyuntura y sus propias sentencias. */
const semillaNueva = () => Math.floor(Math.random() * 2 ** 31) + 1;

/** Semanas por segundo de cada velocidad. */
export const VELOCIDADES = [1, 2, 4, 12];
const PASO_MS = 100;

@Injectable({ providedIn: 'root' })
export class SimService {
  // El motor muta el estado; la señal avisa en cada cambio aunque la referencia sea la misma.
  readonly estado = signal<Estado>(crearEstado(semillaNueva()), { equal: () => false });
  readonly velocidad = signal(0);
  readonly ciudadSel = signal<string | null>(null);
  /** Menú lateral con el historial de decretos. */
  readonly historialAbierto = signal(false);
  /** No se guarda con la partida: al cargar o reiniciar hay que volver a activarla. */
  readonly estrategia = signal<Automatica | null>(null);

  readonly f = computed(() => crearResolver(this.estado()));
  /** Ayuda pública al alquiler en vigor (€/mes de esta semana). */
  readonly ayuda = computed(() => ayudaAlquiler(this.estado(), this.f()));
  readonly ind = computed(() =>
    indicadores(this.estado(), this.f()('impuesto.compra'), this.ayuda()),
  );
  readonly ctx = computed(() => contexto(this.ind()));
  readonly postura = computed(() =>
    postura(
      this.estado()
        .decretosPromulgados.filter((d) => d.valor !== null)
        .map((d) => DECRETO_POR_ID.get(d.id)!.ideologia),
    ),
  );

  private acumulado = 0;

  constructor() {
    setInterval(() => this.bucle(), PASO_MS);
  }

  private bucle() {
    const v = this.velocidad();
    if (!v) return;
    this.acumulado += (v * PASO_MS) / 1000;
    let avanzo = false;
    while (this.acumulado >= 1 && this.velocidad()) {
      this.acumulado -= 1;
      this.tick();
      avanzo = true;
    }
    if (avanzo) this.estado.set(this.estado());
  }

  private tick() {
    const e = this.estado();
    const teniaDecreto = e.decretoDisponible;
    const fin = e.fin;
    avanzarSemana(e);
    this.aplicarEstrategia();
    // Se detiene cuando vuelve a haber decreto disponible y nadie lo ha usado (cada mes), y al acabar la partida.
    if ((!teniaDecreto && e.decretoDisponible) || (!fin && e.fin)) this.pausar();
  }

  pausar() {
    this.velocidad.set(0);
    this.acumulado = 0;
  }

  avanzarUna() {
    this.pausar();
    avanzarSemana(this.estado());
    this.aplicarEstrategia();
    this.estado.set(this.estado());
  }

  /** Empieza una estrategia desde su primer paso; si hay decreto disponible, lo usa ya. */
  activarEstrategia(id: string) {
    this.estrategia.set({ id, paso: 0, saltados: [], activa: true });
    this.aplicarEstrategia();
    this.estado.set(this.estado());
  }

  detenerEstrategia() {
    this.estrategia.update((a) => a && { ...a, activa: false });
  }

  reanudarEstrategia() {
    this.estrategia.update((a) => a && { ...a, activa: true });
    this.aplicarEstrategia();
    this.estado.set(this.estado());
  }

  /** Si hay decreto disponible, promulga el siguiente paso de la estrategia en marcha. Los que no se pueden, se saltan. */
  private aplicarEstrategia() {
    const a = this.estrategia();
    if (!a?.activa) return;
    const e = this.estado();
    const pasos = ESTRATEGIA_POR_ID.get(a.id)?.pasos ?? [];
    let { paso, saltados } = a;
    while (e.decretoDisponible && paso < pasos.length) {
      const cambio = cambioDe(pasos[paso]);
      if (!cambio) {
        imprimir(e);
        e.decretoDisponible = false;
      } else if (!promulgar(e, [cambio])) saltados = [...saltados, paso];
      paso++;
    }
    if (paso !== a.paso) this.estrategia.set({ ...a, paso, saltados });
  }

  promulgar(cambios: Cambio[]): boolean {
    const ok = promulgar(this.estado(), cambios);
    if (ok) this.estado.set(this.estado());
    return ok;
  }

  imprimir() {
    imprimir(this.estado());
    this.estado.set(this.estado());
  }

  reiniciar() {
    this.pausar();
    this.ciudadSel.set(null);
    this.estrategia.set(null);
    this.estado.set(crearEstado(semillaNueva()));
  }

  /** Sustituye la partida en curso por otra (una guardada). */
  cargar(e: Estado) {
    this.pausar();
    this.ciudadSel.set(null);
    this.estrategia.set(null);
    this.estado.set(e);
  }
}
