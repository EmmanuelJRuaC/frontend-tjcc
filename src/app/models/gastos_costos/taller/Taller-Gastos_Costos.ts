/**
 * Representa un gasto registrado en el módulo de Taller.
 */
export interface Taller_Gastos {
  /**
   * Identificador único del gasto.
   */
  id?: number;

  /**
   * Fecha en la que se realizó el gasto.
   *
   * Formato esperado: YYYY-MM-DD.
   */
  fecha: string;

  /**
   * Artículo o concepto asociado al gasto.
   */
  articulo: string;

  /**
   * Valor monetario del gasto.
   *
   * Puede ser null mientras se está diligenciando el formulario.
   */
  valor: number | null;

  /**
   * Tipo de pago utilizado para realizar el gasto.
   *
   * Ejemplos: EFECTIVO, TRANSFERENCIA, TARJETA.
   */
  tipoPago: string;
}

/**
 * Representa un costo registrado en el módulo de Taller.
 */
export interface Taller_Costos {
  /**
   * Identificador único del costo.
   */
  id?: number;

  /**
   * Fecha en la que se generó el costo.
   *
   * Formato esperado: YYYY-MM-DD.
   */
  fecha: string;

  /**
   * Artículo o concepto asociado al costo.
   */
  articulo: string;

  /**
   * Valor monetario del costo.
   *
   * Puede ser null mientras se está diligenciando el formulario.
   */
  valor: number | null;

  /**
   * Tipo de pago utilizado para realizar el costo.
   */
  tipoPago: string;

  /**
   * Persona o entidad a quien se realizó el pago.
   */
  pagadoA: string;

  /**
   * Detalles adicionales relacionados con el costo.
   */
  detalles: string;
}
