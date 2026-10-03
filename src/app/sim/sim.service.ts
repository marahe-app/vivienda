import { Injectable, computed, signal } from '@angular/core';
import { DECRETO_POR_ID } from './datos/decretos';
import { contexto, indicadores, postura } from './motor/indicadores';
import { crearResolver } from './motor/modificadores';
import { avanzarSemana, crearEstado, imprimir, promulgar } from './motor/motor';
import type { Cambio, Estado } from './tipos';

/** Semanas por segundo de cada velocidad. */
export const VELOCIDADES = [1, 2, 4, 12];
const PASO_MS = 100;

@Injectable({ providedIn: 'root' })
export class SimService {
  // El motor muta el estado; la señal avisa en cada cambio aunque la referencia sea la misma.
  readonly estado = signal<Estado>(crearEstado(), { equal: () => false });
  readonly velocidad = signal(0);
  readonly pausarCadaMes = signal(true);
  readonly ciudadSel = signal<string | null>(null);

  readonly f = computed(() => crearResolver(this.estado()));
  readonly ind = computed(() => indicadores(this.estado(), this.f()('impuesto.compra')));
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
    if ((this.pausarCadaMes() && !teniaDecreto && e.decretoDisponible) || (!fin && e.fin))
      this.pausar();
  }

  pausar() {
    this.velocidad.set(0);
    this.acumulado = 0;
  }

  avanzarUna() {
    this.pausar();
    avanzarSemana(this.estado());
    this.estado.set(this.estado());
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
    this.estado.set(crearEstado());
  }

  /** Sustituye la partida en curso por otra (una guardada). */
  cargar(e: Estado) {
    this.pausar();
    this.ciudadSel.set(null);
    this.estado.set(e);
  }
}
