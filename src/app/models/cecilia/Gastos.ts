/**
 * Representa un gasto individual registrado en el sistema.
 */
export interface Gasto {
  /**
   * Identificador único del gasto.
   *
   * <p>
   * Es opcional porque no se encuentra disponible al crear
   * un gasto nuevo.
   */
  id?: number;

  /**
   * Fecha en la que se realizó el gasto.
   *
   * Formato esperado: YYYY-MM-DD.
   *
   * Ejemplo:
   * 2026-09-29
   */
  fecha: string;

  /**
   * Nombre o descripción del servicio relacionado con el gasto.
   */
  nombre_servicio: string;

  /**
   * Valor monetario del gasto.
   *
   * <p>
   * Puede ser {@code null} cuando el gasto no tiene un valor
   * registrado.
   */
  valor: number | null;
}

/**
 * Representa los gastos correspondientes a un mes.
 */
export interface MesGastos {
  /**
   * Nombre del mes.
   *
   * Ejemplo:
   * Enero, Febrero, Marzo.
   */
  nombre: string;

  /**
   * Lista de gastos registrados durante el mes.
   */
  gastos: Gasto[];
}

/**
 * Representa los gastos agrupados por año.
 */
export interface AnioGastos {
  /**
   * Año al que pertenecen los gastos.
   */
  anio: number;

  /**
   * Lista de meses pertenecientes al año.
   */
  meses: MesGastos[];
}

/**
 * Datos necesarios para registrar un nuevo gasto.
 *
 * <p>
 * El identificador no se incluye porque es generado por el backend.
 */
export interface CrearGastos {
  /**
   * Fecha en la que se realizó el gasto.
   *
   * Formato esperado: YYYY-MM-DD.
   */
  fecha: string;

  /**
   * Nombre o descripción del servicio relacionado con el gasto.
   */
  nombre_servicio: string;

  /**
   * Valor monetario del gasto.
   */
  valor: number;
}
