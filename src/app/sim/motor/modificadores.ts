import { FACTORES, type DefFactor, type FactorId } from '../datos/factores';
import { PARAMETROS as P } from '../datos/parametros';
import type { Ambito, Estado, Modificador, Resolver } from '../tipos';

/** Un modificador con ámbito solo cuenta cuando se consulta el factor para ese ámbito. */
export function aplica(m: Modificador, ambito?: Ambito): boolean {
  if (m.propietario && m.propietario !== ambito?.propietario) return false;
  if (m.ciudad && m.ciudad !== ambito?.ciudad) return false;
  return true;
}

/**
 * Valor de un factor con sus modificadores. En los factores de comportamiento (`gradual`), una ley
 * recién promulgada pesa poco y va ganando peso semana a semana hasta desplegarse del todo.
 */
export function calcular(
  def: DefFactor,
  mods: Modificador[],
  ambito?: Ambito,
  semana = Infinity,
): number {
  let suma = def.base;
  let mult = 1;
  let tope = Infinity;
  let suelo = -Infinity;
  for (const m of mods) {
    if (!aplica(m, ambito)) continue;
    const peso =
      def.gradual && m.desde !== undefined
        ? Math.max(0, Math.min(1, (semana - m.desde) / P.semanasDespliegue))
        : 1;
    if (m.op === 'suma') suma += m.valor * peso;
    else if (m.op === 'mult') mult *= Math.max(0, 1 + m.valor * peso);
    else if (m.op === 'tope') tope = Math.min(tope, m.valor);
    else suelo = Math.max(suelo, m.valor);
  }
  let v = Math.max(suelo, Math.min(tope, suma * mult));
  if (def.min !== undefined) v = Math.max(def.min, v);
  if (def.max !== undefined) v = Math.min(def.max, v);
  return v;
}

/** Devuelve la función f(factor, ámbito) que usan las reglas durante un tick. */
export function crearResolver(e: Estado): Resolver {
  const porFactor = new Map<FactorId, Modificador[]>();
  for (const m of e.modificadores) {
    const lista = porFactor.get(m.factor);
    if (lista) lista.push(m);
    else porFactor.set(m.factor, [m]);
  }
  const vacio: Modificador[] = [];
  return (id, ambito) => calcular(FACTORES[id], porFactor.get(id) ?? vacio, ambito, e.semana);
}
