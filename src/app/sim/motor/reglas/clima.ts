import { PARAMETROS as P } from '../../datos/parametros';
import type { Estado, Regla, Resolver } from '../../tipos';
import { gastoAnual, ingresosAnual } from '../gasto';
import { clamp, contexto, indicadores, presion, type Indicadores } from '../indicadores';
import { IPC_BASE, ayudaAlquiler, tipoDeuda } from './economia';

/** Números rojos de la cartera, en miles de millones de euros de inicio. */
const rojo = (e: Estado) => Math.max(0, -e.cartera.saldo) / e.nivelPrecios / 1000;

/** Deuda de la cartera, en miles de millones de euros de inicio. */
export const deudaReal = (e: Estado) => e.cartera.deuda / e.nivelPrecios / 1000;

/** Lo que ha caído el precio de compra (en euros corrientes: nadie descuenta la inflación de su casa) desde su máximo reciente, por encima de lo que los propietarios toleran. */
export const caidaPrecio = (e: Estado, ind: Indicadores) =>
  Math.max(0, 1 - ind.precioMedio / e.precioMax - P.propietarios.umbral);

/**
 * Apoyo al gobierno (0-100): baja con la tensión, sube si la tensión ha mejorado desde las últimas elecciones
 * y acompaña a la coyuntura económica.
 * Por debajo del umbral de PARAMETROS.elecciones, se pierden.
 */
export const apoyo = (e: Estado) =>
  clamp(
    50 -
      P.elecciones.tension * (e.tension - 60) +
      P.elecciones.mejora * (e.eleccion.tensionAnterior - e.tension) +
      P.apoyoCoyuntura * e.coyuntura,
    0,
    100,
  );

/**
 * Hacia dónde tiende la tensión social (0-100, puede pasar de 100):
 * la presión de las ciudades (manda la mayor entre la media ponderada y la de las grandes ciudades),
 * las familias expulsadas de su alquiler, la inflación por encima de la base, los números rojos,
 * la deuda, los propietarios que ven caer el valor de su casa y las leyes.
 */
export function objetivoTension(e: Estado, f: Resolver, ind: Indicadores): number {
  const expulsados = ind.flujos.desahucios + ind.flujos.noRenovados;
  const inflacionExtra = Math.max(0, f('inflacion.general') - IPC_BASE);
  // Presión 0,15 → tensión 0; presión 0,95 → tensión 100. Por encima sigue sumando: no hay techo.
  const presion = Math.max(ind.presion.ponderada, ind.presion.principales);
  return (
    (100 * (presion - 0.15)) / 0.8 +
    // Las expulsiones suman como mucho 40 puntos: a partir de cinco veces lo normal ya no pesan más.
    10 * (Math.min(5, expulsados / (ind.inquilinos * P.expulsadosRef)) - 1) +
    500 * inflacionExtra +
    1 * rojo(e) +
    P.deuda.tensionPorMil * deudaReal(e) +
    P.propietarios.tension * caidaPrecio(e, ind) +
    f('tension.extra')
  );
}

/** Tensión social, confianza del mercado, cartera, historial y fin de partida. */
export const clima: Regla = {
  id: 'clima',
  nombre: 'Tensión, confianza, cartera y objetivos',
  ejecutar(e, f) {
    if (e.calibrando) return;
    const ayuda = ayudaAlquiler(e, f);
    const ind = indicadores(e, f('impuesto.compra'), ayuda);
    // Lo que cuestan las leyes y la vivienda pública, más los intereses de lo que se debe.
    e.gastoAnual = gastoAnual(e, contexto(ind)) + e.cartera.deuda * tipoDeuda(e, f);
    e.ingresosAnual = ingresosAnual(e);
    e.cartera.saldo += (e.ingresosAnual - e.gastoAnual) / 52;

    e.precioMax = Math.max(ind.precioMedio, e.precioMax * (1 - P.propietarios.olvido / 52));

    const objetivo = objetivoTension(e, f, ind);
    e.tension = clamp(e.tension + (objetivo - e.tension) / 26, 0, 100);

    const inflacionExtra = Math.max(0, f('inflacion.general') - IPC_BASE);
    const objetivoConfianza =
      f('confianza.objetivo') -
      200 * inflacionExtra -
      1 * rojo(e) -
      P.deuda.confianzaPorMil * deudaReal(e) -
      P.propietarios.confianza * caidaPrecio(e, ind) +
      P.ciclo.confianza * e.coyuntura;
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
      nivelPrecios: e.nivelPrecios,
      gasto: e.gastoAnual,
      saldo: e.cartera.saldo,
      deuda: e.cartera.deuda,
      ofAlquiler: ind.enAlquiler,
      ofVenta: ind.enVenta,
      presiones: e.ciudades.map((c) => Math.round(presion(c, ayuda) * 1000) / 1000),
    });
    if (e.historial.length > P.maxHistorial)
      e.historial = e.historial.filter((_, i) => i % 2 === 1);

    if (!e.fin) {
      if (ind.cumple.alojadas && ind.cumple.compra && ind.cumple.alquiler) e.fin = 'victoria';
      else if (e.tension >= 100) {
        e.fin = 'derrota';
        e.motivoFin = 'tension';
      }
    }
  },
};
