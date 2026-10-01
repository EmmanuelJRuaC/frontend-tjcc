import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../../hooks/utils';
import { SemanasMensajeria } from '../../../../../models/gastos_costos/mensajeria/Mensajeria';
import { environment } from '../../../../../enviroments/environment';

/**
 * Servicio encargado de gestionar las peticiones HTTP relacionadas
 * con las semanas de mensajería.
 *
 * <p>
 * Este servicio centraliza la comunicación entre Angular y la API
 * de Spring Boot para:
 * </p>
 *
 * <ul>
 *   <li>Consultar las semanas de mensajería.</li>
 *   <li>Registrar nuevas semanas.</li>
 *   <li>Actualizar el estado de una semana.</li>
 * </ul>
 */
@Injectable({
  providedIn: 'root',
})
export class ApiSemanasMensajeria {
  // -------------------------------------------------------------------------
  // CONFIGURACIÓN
  // -------------------------------------------------------------------------

  /**
   * URL base de los endpoints de semanas de mensajería.
   */
  private readonly baseUrl = `${environment.apiUrl}/gastos-costos/mensajeria/semanas-mensajeria`;

  /**
   * Cliente HTTP utilizado para comunicarse con el backend.
   */
  constructor(private readonly httpClient: HttpClient) {}

  // -------------------------------------------------------------------------
  // OBTENER SEMANAS
  // -------------------------------------------------------------------------

  /**
   * Obtiene todas las semanas de mensajería registradas.
   *
   * @returns Observable con la respuesta de la API y la lista
   *          de semanas de mensajería.
   */
  public obtenerSemanasMensajeria(): Observable<ApiResponse<SemanasMensajeria[]>> {
    return this.httpClient.get<ApiResponse<SemanasMensajeria[]>>(`${this.baseUrl}/obtener-todas`);
  }

  // -------------------------------------------------------------------------
  // REGISTRAR SEMANA
  // -------------------------------------------------------------------------

  /**
   * Registra una nueva semana de mensajería.
   *
   * @param semana información de la semana que será registrada.
   * @returns Observable con la respuesta de la API y la semana creada.
   */
  public registrarSemanaMensajeria(
    semana: SemanasMensajeria,
  ): Observable<ApiResponse<SemanasMensajeria>> {
    return this.httpClient.post<ApiResponse<SemanasMensajeria>>(
      `${this.baseUrl}/registrar`,
      semana,
    );
  }

  // -------------------------------------------------------------------------
  // ACTUALIZAR ESTADO
  // -------------------------------------------------------------------------

  /**
   * Actualiza el estado de una semana de mensajería.
   *
   * <p>
   * El identificador y el nuevo estado se envían en el cuerpo
   * de la petición mediante un objeto JSON.
   * </p>
   *
   * @param id identificador de la semana.
   * @param estado nuevo estado de la semana.
   * @returns Observable con la respuesta de la API.
   */
  public actualizarEstadoSemana(
    id: number,
    estado: 'ABIERTA' | 'CERRADA',
  ): Observable<ApiResponse<string>> {
    return this.httpClient.patch<ApiResponse<string>>(`${this.baseUrl}/actualizar-estado`, {
      id,
      estado,
    });
  }
}
