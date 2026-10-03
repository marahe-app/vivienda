import { PARAMETROS as P } from '../../datos/parametros';
import type { Propietario, Regla } from '../../tipos';
import { aniosFinanciables, clamp, hogares, suma } from '../indicadores';

const PRIVADOS: Propietario[] = ['familias', 'pequenos', 'grandes'];

/** Parte de los buscadores que puede pagar un precio, dado su límite: 1 si sobra, 0,5 si justo, →0 si no llega. */
const accesible = (precio: number, limite: number) =>
  1 / (1 + Math.pow(precio / Math.max(1, limite), P.exponenteAcceso));

/** Encuentro semanal entre familias que buscan y viviendas en oferta: quién logra casa y quién no. */
export const emparejamiento: Regla = {
  id: 'emparejamiento',
  nombre: 'Compras y contratos de alquiler',
  ejecutar(e, f) {
    for (const c of e.ciudades) {
      const ambito = { ciudad: c.id };
      let buscan = c.espera * f('demanda.busqueda', ambito);

      // 1. Vivienda pública: se adjudica primero, a precio social.
      const pub = c.parque.publico;
      const adjudicadas = Math.min(pub.ofAlquiler, buscan);
      pub.ofAlquiler -= adjudicadas;
      pub.alquilada += adjudicadas;
      c.espera -= adjudicadas;
      buscan -= adjudicadas;

      // 2. Compra: familias en espera, inquilinos e inversores compiten por lo que hay en venta.
      const rentaBuscador = c.renta * P.rentaBuscadores;
      const precioFinal = c.precio * (1 + f('impuesto.compra', ambito));
      // Lo que presta el banco: cuota del 35 % de la renta, al tipo y plazo medios, más el aval público.
      const anios = aniosFinanciables(
        f('hipoteca.tipo', ambito),
        f('hipoteca.plazo', ambito),
        f('hipoteca.esfuerzo', ambito),
        f('hipoteca.aval', ambito),
      );
      const demEspera =
        buscan *
        f('demanda.preferenciaCompra', ambito) *
        accesible(precioFinal, rentaBuscador * anios);
      const inquilinos = suma(c, 'alquilada', true);
      const demInquilinos =
        inquilinos * P.inquilinosCompran * accesible(precioFinal, c.renta * anios);
      const enVenta = suma(c, 'ofVenta', true);
      const atractivo = clamp((c.rentabilidad - 0.035) / 0.025, 0, 2) * (e.confianza / 60);
      // El apetito inversor depende del tamaño de la ciudad y de la rentabilidad, no de cuánto haya en venta:
      // así, cuando se construye mucho, la oferta sí presiona el precio a la baja.
      const demInversor = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      const h = hogares(c);
      for (const o of ['pequenos', 'grandes'] as const) {
        demInversor[o] =
          h *
          P.inversionBase[o] *
          atractivo *
          f('inversion.demanda', { propietario: o, ciudad: c.id });
      }
      const demCompra = demEspera + demInquilinos + demInversor.pequenos + demInversor.grandes;
      const cabeVenta = enVenta * P.rotacionVenta;
      const ventas = demCompra > 0 ? (demCompra * cabeVenta) / (demCompra + cabeVenta) : 0;
      const k = demCompra > 0 ? ventas / demCompra : 0;

      const cuotaVenta = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      const cuotaAlquilada = { familias: 0, pequenos: 0, grandes: 0, publico: 0 };
      for (const o of PRIVADOS) {
        cuotaVenta[o] = enVenta > 0 ? c.parque[o].ofVenta / enVenta : 0;
        cuotaAlquilada[o] = inquilinos > 0 ? c.parque[o].alquilada / inquilinos : 0;
      }
      const compranEspera = demEspera * k;
      const compranInquilinos = demInquilinos * k;
      for (const o of PRIVADOS) {
        const p = c.parque[o];
        p.ofVenta -= ventas * cuotaVenta[o];
        // El inquilino que compra deja libre su piso, que vuelve a anunciarse.
        p.alquilada -= compranInquilinos * cuotaAlquilada[o];
        p.ofAlquiler += compranInquilinos * cuotaAlquilada[o];
        // Lo que compra un inversor se alquila o se queda fuera de mercado según su intención.
        const inv = demInversor[o] * k;
        p.ofAlquiler += inv * c.intencion[o];
        p.vacia += inv * (1 - c.intencion[o]);
      }
      c.parque.familias.propia += compranEspera + compranInquilinos;
      c.espera -= compranEspera;
      c.ratioVenta = demCompra / (enVenta * P.absorcionVenta + 1);

      // 3. Alquiler de mercado: el resto de buscadores, si pueden pagarlo.
      const limiteAlquiler =
        (rentaBuscador / 12) * f('acceso.esfuerzoAlquiler', ambito) +
        f('acceso.ayudaAlquiler', ambito);
      const demAlquiler = (buscan - compranEspera) * accesible(c.alquiler, limiteAlquiler);
      const enAlquiler = suma(c, 'ofAlquiler', true);
      const cabeAlquiler = enAlquiler * P.rotacionAlquiler;
      const contratos =
        demAlquiler > 0 ? (demAlquiler * cabeAlquiler) / (demAlquiler + cabeAlquiler) : 0;
      for (const o of PRIVADOS) {
        const p = c.parque[o];
        const n = enAlquiler > 0 ? (contratos * p.ofAlquiler) / enAlquiler : 0;
        p.ofAlquiler -= n;
        p.alquilada += n;
      }
      c.espera -= contratos;
      c.ratioAlq = demAlquiler / (enAlquiler * P.absorcionAlquiler + 1);

      const fl = c.flujos;
      fl.compras = compranEspera + compranInquilinos;
      fl.contratos = contratos + adjudicadas;
      fl.logran = adjudicadas + compranEspera + contratos;
      fl.noLogran = Math.max(
        0,
        fl.inmigrantes + fl.emancipados + fl.desahucios + fl.noRenovados - fl.logran,
      );
    }
  },
};
