import type { Regla } from '../../tipos';
import { clima } from './clima';
import { construccion } from './construccion';
import { demanda, disoluciones } from './demanda';
import { economia } from './economia';
import { emparejamiento } from './emparejamiento';
import { expulsiones, intencion, ofertaExistente } from './oferta';
import { precios } from './precios';

/**
 * EL TICK SEMANAL: las reglas se ejecutan en este orden.
 * Para añadir un cálculo nuevo, escribe una Regla y colócala aquí.
 */
export const REGLAS: Regla[] = [
  economia,
  demanda,
  disoluciones,
  intencion,
  expulsiones,
  ofertaExistente,
  construccion,
  emparejamiento,
  precios,
  clima,
];
