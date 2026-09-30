/**
 * Estructura estándar utilizada para las respuestas de la API.
 *
 * @template T tipo de dato contenido en la propiedad {@link data}
 */
export interface ApiResponse<T> {
  /**
   * Indica si la operación se realizó correctamente.
   */
  success: boolean;

  /**
   * Mensaje descriptivo enviado por la API.
   */
  message: string;

  /**
   * Información devuelta por la API.
   *
   * El tipo de información depende de la operación realizada.
   */
  data: T;
}

/**
 * Clase que contiene funciones relacionadas con validaciones
 * de campos y formularios.
 */
export class Validaciones {
  /**
   * Permite únicamente caracteres numéricos en un campo de entrada.
   *
   * <p>
   * Todos los caracteres que no sean números son eliminados
   * automáticamente del valor del campo.
   *
   * @param event evento generado por el campo de entrada
   */
  public soloNumeros(event: Event): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/\D/g, '');
  }
}

/**
 * Clase que contiene funciones utilizadas para formatear
 * diferentes tipos de información que se muestran en la interfaz.
 */
export class Formatear {
  /**
   * Formatea un valor numérico como moneda colombiana.
   *
   * <p>
   * Utiliza el formato regional {@code es-CO} y la moneda
   * {@code COP}.
   *
   * @param valor valor numérico que se desea formatear
   * @returns valor convertido a formato de moneda colombiana
   *
   * @example
   * {@code
   * formatearMoneda(50000);
   *  "$50.000"
   * }
   */
  public formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  /**
   * Convierte una fecha en formato YYYY-MM-DD a DD/MM/YYYY.
   *
   * @param fecha fecha en formato YYYY-MM-DD
   * @returns fecha en formato DD/MM/YYYY
   *
   * @example
   * {@code
   * formatearFecha('2026-09-29');
   *  '29/09/2026'
   * }
   */
  public formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');

    return `${dia}/${mes}/${anio}`;
  }

  /**
   * Convierte una fecha en formato YYYY-MM-DD a una fecha
   * con el nombre abreviado del mes.
   *
   * @param fecha fecha en formato YYYY-MM-DD
   * @returns fecha formateada utilizando el idioma español
   *
   * @example
   * {@code
   * formatearFechaTexto('2026-09-29');
   *  '29 sept 2026'
   * }
   */
  public formatearFechaTexto(fecha: string): string {
    if (!fecha) {
      return '';
    }

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const date = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));

    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  /**
   * Convierte una fecha en formato YYYY-MM-DD a una fecha
   * con el nombre completo del mes.
   *
   * @param fecha fecha en formato YYYY-MM-DD
   * @returns fecha formateada utilizando el idioma español
   *
   * @example
   * {@code
   * formatearFechaLarga('2026-09-29');
   *  '29 de septiembre de 2026'
   * }
   */
  public formatearFechaLarga(fecha: string): string {
    if (!fecha) {
      return '';
    }

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const date = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));

    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  /**
   * Extrae las iniciales de un nombre y apellido
   * obteniendo N+A
   *
   * @param nombre nombre para obtener inicial
   * @param apellido apellido para obtener inicial
   * @returns iniciales de nombre y apellido
   *
   * @example
   * {@code
   * obtenerIniciales('NOMBRE', 'APELLIDO');
   *  'NA'
   * }
   */
  obtenerIniciales(nombre: string, apellido: string): string {
  const inicialNombre = nombre.charAt(0).toUpperCase();
  const inicialApellido = apellido.charAt(0).toUpperCase();

  return `${inicialNombre}${inicialApellido}`;
}
}
