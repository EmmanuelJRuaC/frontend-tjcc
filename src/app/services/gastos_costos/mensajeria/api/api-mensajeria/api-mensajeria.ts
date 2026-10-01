import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../../hooks/utils';
import { environment } from '../../../../../enviroments/environment';

import { GC_Mensajeria } from '../../../../../models/gastos_costos/mensajeria/Mensajeria';

/**
 * Servicio encargado de gestionar las operaciones relacionadas
 * con las mensajerías del módulo Gastos y Costos.
 *
 * <p>
 * Este servicio se comunica con la API REST de Spring Boot para:
 * </p>
 *
 * <ul>
 *   <li>Obtener las mensajerías registradas.</li>
 *   <li>Registrar múltiples mensajerías.</li>
 *   <li>Actualizar una mensajería existente.</li>
 *   <li>Eliminar una mensajería.</li>
 * </ul>
 */
@Injectable({
  providedIn: 'root',
})
export class ApiMensajeria {
  // =========================================================================
  // CONFIGURACIÓN
  // =========================================================================

  /**
   * URL base de los endpoints de mensajería.
   */
  private readonly baseUrl = `${environment.apiUrl}/gastos-costos/mensajeria/mensajeria`;

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  /**
   * Inicializa el servicio.
   *
   * @param httpClient cliente HTTP utilizado para comunicarse
   *                   con el backend.
   */
  constructor(private readonly httpClient: HttpClient) {}

  // =========================================================================
  // OBTENER MENSAJERÍAS
  // =========================================================================

  /**
   * Obtiene todas las mensajerías registradas.
   *
   * @returns observable con la respuesta de la API y la lista
   *          de mensajerías.
   */
  public obtenerMensajerias(): Observable<ApiResponse<GC_Mensajeria[]>> {
    return this.httpClient.get<ApiResponse<GC_Mensajeria[]>>(`${this.baseUrl}/obtener-todas`);
  }

  // =========================================================================
  // REGISTRAR MENSAJERÍAS
  // =========================================================================

  /**
   * Registra una lista de mensajerías.
   *
   * @param mensajerias lista de mensajerías que serán registradas.
   * @returns observable con la respuesta de la API y las mensajerías
   *          registradas.
   */
  public registrarMensajerias(
    mensajerias: GC_Mensajeria[],
  ): Observable<ApiResponse<GC_Mensajeria[]>> {
    return this.httpClient.post<ApiResponse<GC_Mensajeria[]>>(
      `${this.baseUrl}/registrar`,
      mensajerias,
    );
  }

  // =========================================================================
  // ACTUALIZAR MENSAJERÍA
  // =========================================================================

  /**
   * Actualiza una mensajería existente.
   *
   * <p>
   * Los datos se envían como parámetros de consulta porque
   * el endpoint del backend utiliza {@code @RequestParam}.
   * </p>
   *
   * @param id identificador de la mensajería.
   * @param fecha nueva fecha de la mensajería.
   * @param destinoServicio nuevo destino o servicio.
   * @param valor nuevo valor de la mensajería.
   * @returns observable con la mensajería actualizada.
   */
  public actualizarMensajeria(
    id: number,
    fecha: string,
    destinoServicio: string,
    valor: number | null,
  ): Observable<ApiResponse<GC_Mensajeria>> {
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('destino_servicio', destinoServicio)
      .set('valor', valor ?? 0);

    return this.httpClient.patch<ApiResponse<GC_Mensajeria>>(
      `${this.baseUrl}/actualizar/${id}`,
      null,
      { params },
    );
  }

  // =========================================================================
  // ELIMINAR MENSAJERÍA
  // =========================================================================

  /**
   * Elimina una mensajería por su identificador.
   *
   * @param id identificador de la mensajería.
   * @returns observable con la respuesta de la API.
   */
  public eliminarMensajeria(id: number): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`${this.baseUrl}/eliminar/${id}`);
  }
}
