import { FACTORES } from '../../datos/factores';
import { PARAMETROS as P } from '../../datos/parametros';
import type { Estado, Regla, Resolver } from '../../tipos';
import { gastoAnual } from '../gasto';
import { clamp, contexto, indicadores, type Indicadores } from '../indicadores';

const IPC_BASE = FACTORES['inflacion.general'].base;

/** Números rojos de la cartera, en miles de millones. */
const rojo = (e: Estado) => Math.max(0, -e.cartera.saldo) / 1000;

/**
 * Hacia dónde tiende la tensión social (0-100, puede pasar de 100):
 * la presión de las ciudades (manda la mayor entre la media ponderada y la de las grandes ciudades),
 * las familias expulsadas de su alquiler, la inflación por encima de la base, los números rojos y las leyes.
 */
export function objetivoTension(e: Estado, f: Resolver, ind: Indicadores): number {
  const expulsados = ind.flujos.desahucios + ind.flujos.noRenovados;
  const inflacionExtra = Math.max(0, f('inflacion.general') - IPC_BASE);
  // Presión 0,15 → tensión 0; presión 0,95 → tensión 100. Por encima sigue sumando: no hay techo.
  const presion = Math.max(ind.presion.ponderada, ind.presion.principales);
  return (
    (100 * (presion - 0.15)) / 0.8 +
    10 * (expulsados / P.expulsadosRef - 1) +
    500 * inflacionExtra +
    1 * rojo(e) +
    f('tension.extra')
  );
}

/** Tensión social, confianza del mercado, cartera, historial y fin de partida. */
export const clima: Regla = {
  id: 'clima',
  nombre: 'Tensión, confianza, cartera y objetivos',
  ejecutar(e, f) {
    if (e.calibrando) return;
    const ind = indicadores(e, f('impuesto.compra'));
    e.gastoAnual = gastoAnual(e, contexto(ind));
    e.cartera.saldo -= e.gastoAnual / 52;

    const objetivo = objetivoTension(e, f, ind);
    e.tension = clamp(e.tension + (objetivo - e.tension) / 26, 0, 100);

    const inflacionExtra = Math.max(0, f('inflacion.general') - IPC_BASE);
    const objetivoConfianza = f('confianza.objetivo') - 200 * inflacionExtra - 1 * rojo(e);
    e.confianza = clamp(e.confianza + (objetivoConfianza - e.confianza) / 26, 0, 100);

    e.historial.push({
      semana: e.semana,
      alojadas: ind.alojadas,
      espera: ind.espera,
      aniosCompra: ind.aniosCompra,
      esfuerzoSmi: ind.esfuerzoSmi,
      tension: e.tension,
      confianza: e.confianza,
      flujos: ind.flujos,
      alquiler: ind.alquilerMercado,
      precio: ind.precioMedio,
      smi: e.smi,
      impuestoCompra: f('impuesto.compra'),
      ipc: f('inflacion.general'),
      gasto: e.gastoAnual,
      saldo: e.cartera.saldo,
      ofAlquiler: ind.enAlquiler,
      ofVenta: ind.enVenta,
    });
    if (e.historial.length > P.maxHistorial)
      e.historial = e.historial.filter((_, i) => i % 2 === 1);

    if (!e.fin) {
      if (ind.cumple.alojadas && ind.cumple.compra && ind.cumple.alquiler) e.fin = 'victoria';
      else if (e.tension >= 100) e.fin = 'derrota';
    }
  },
};
