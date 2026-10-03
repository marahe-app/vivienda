import { Injectable, inject, signal } from '@angular/core';
import { SimService } from './sim.service';
import type { Estado } from './tipos';

/** Súbela cuando el Estado deje de ser compatible: las partidas de otra versión no se cargan. */
const VERSION = 2;
const INDICE = 'vivienda.partidas';
const clave = (id: string) => 'vivienda.partida.' + id;

/** Ficha de una partida guardada; el estado completo va aparte, en su propia clave. */
export interface Partida {
  id: string;
  nombre: string;
  /** Momento real en que se guardó (ms). */
  guardada: number;
  semana: number;
  /** Fecha de la simulación (ISO). */
  fecha: string;
  fin: Estado['fin'];
  version: number;
}

function leerIndice(): Partida[] {
  try {
    const lista = JSON.parse(localStorage.getItem(INDICE) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

/** Partidas guardadas en el navegador (localStorage). Los métodos devuelven el error, o null si todo va bien. */
@Injectable({ providedIn: 'root' })
export class PartidasService {
  private readonly sim = inject(SimService);
  readonly lista = signal<Partida[]>(leerIndice());

  /** Guarda la partida en curso. Con `id` sobrescribe esa partida. */
  guardar(nombre: string, id = Date.now().toString(36)): string | null {
    const e = this.sim.estado();
    const partida: Partida = {
      id,
      nombre,
      guardada: Date.now(),
      semana: e.semana,
      fecha: e.fecha.toISOString(),
      fin: e.fin,
      version: VERSION,
    };
    const lista = [partida, ...this.lista().filter((p) => p.id !== id)];
    try {
      localStorage.setItem(clave(id), JSON.stringify(e));
      localStorage.setItem(INDICE, JSON.stringify(lista));
    } catch {
      return 'No se ha podido guardar: el navegador no tiene espacio o bloquea el almacenamiento.';
    }
    this.lista.set(lista);
    return null;
  }

  cargar(id: string): string | null {
    const partida = this.lista().find((p) => p.id === id);
    if (partida?.version !== VERSION)
      return 'Esta partida es de otra versión del simulador y no puede cargarse.';
    try {
      const e = JSON.parse(localStorage.getItem(clave(id))!) as Estado;
      // JSON guarda la fecha como texto.
      e.fecha = new Date(e.fecha);
      if (!Array.isArray(e.ciudades) || isNaN(e.fecha.getTime())) throw new Error();
      this.sim.cargar(e);
      return null;
    } catch {
      return 'La partida guardada está dañada y no puede cargarse.';
    }
  }

  borrar(id: string): string | null {
    const lista = this.lista().filter((p) => p.id !== id);
    try {
      localStorage.removeItem(clave(id));
      localStorage.setItem(INDICE, JSON.stringify(lista));
    } catch {
      return 'No se ha podido borrar: el navegador bloquea el almacenamiento.';
    }
    this.lista.set(lista);
    return null;
  }
}
