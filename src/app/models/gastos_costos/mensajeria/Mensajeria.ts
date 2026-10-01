/**
 * Representa una mensajería registrada.
 *
 * <p>
 * Contiene la información del servicio realizado, su valor,
 * el mensajero responsable y la semana a la que pertenece.
 * </p>
 */
export interface GC_Mensajeria {
  /**
   * Identificador de la mensajería.
   *
   * <p>
   * Es opcional porque no se encuentra disponible
   * antes de que el registro sea almacenado en el backend.
   * </p>
   */
  id?: number;

  /**
   * Fecha en la que se realizó la mensajería.
   *
   * Formato esperado: {@code YYYY-MM-DD}.
   */
  fecha: string;

  /**
   * Destino o descripción del servicio realizado.
   */
  destino_servicio: string;

  /**
   * Valor correspondiente al servicio.
   *
   * Puede ser {@code null} cuando no se ha registrado
   * un valor para el servicio.
   */
  valor: number | null;

  /**
   * Identificador del mensajero responsable.
   */
  mensajeros_id: number;

  /**
   * Identificador de la semana de mensajería.
   */
  semanas_mensajeria_id: number;
}

/**
 * Representa un mensajero registrado en el sistema.
 */
export interface Mensajeros {
  /**
   * Identificador del mensajero.
   */
  id?: number;

  /**
   * Nombre del mensajero.
   */
  nombre: string;

  /**
   * Apellido del mensajero.
   */
  apellido?: string;
}

/**
 * Representa un servicio dentro del formulario
 * de registro de mensajerías.
 *
 * <p>
 * Este modelo se utiliza como estructura temporal
 * antes de convertir los datos en {@link GC_Mensajeria}.
 * </p>
 */
export interface ServicioForm {
  /**
   * Destino o descripción del servicio.
   */
  destino_servicio: string;

  /**
   * Valor del servicio.
   */
  valor: number | null;
}

/**
 * Representa un grupo de servicios asociados
 * a una fecha determinada.
 *
 * <p>
 * Se utiliza para organizar el formulario de registro
 * de múltiples mensajerías.
 * </p>
 */
export interface FechaMensajeriaForm {
  /**
   * Fecha de realización de los servicios.
   *
   * Formato esperado: {@code YYYY-MM-DD}.
   */
  fecha: string;

  /**
   * Servicios realizados durante la fecha indicada.
   */
  servicios: ServicioForm[];
}

/**
 * Representa una semana de mensajería.
 *
 * <p>
 * Una semana puede encontrarse abierta o cerrada.
 * Las operaciones de creación, edición y eliminación
 * de mensajerías solamente están disponibles cuando
 * la semana se encuentra abierta.
 * </p>
 */
export interface SemanasMensajeria {
  /**
   * Identificador de la semana.
   */
  id?: number;

  /**
   * Fecha inicial de la semana.
   *
   * Formato esperado: {@code YYYY-MM-DD}.
   */
  fecha_inicio: string;

  /**
   * Fecha final de la semana.
   *
   * Formato esperado: {@code YYYY-MM-DD}.
   */
  fecha_fin: string;

  /**
   * Estado actual de la semana.
   *
   * {@code ABIERTA}: permite registrar y modificar mensajerías.
   *
   * {@code CERRADA}: impide modificaciones.
   */
  estado: 'ABIERTA' | 'CERRADA';
}
