import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../../hooks/utils';
import { Mensajeros } from '../../../../../models/gastos_costos/mensajeria/Mensajeria';
import { environment } from '../../../../../enviroments/environment';

/**
 * Servicio encargado de gestionar las peticiones HTTP relacionadas
 * con los mensajeros del módulo de Gastos y Costos.
 *
 * <p>
 * Este servicio centraliza la comunicación entre Angular y la API
 * de Spring Boot para:
 * </p>
 *
 * <ul>
 *   <li>Consultar los mensajeros registrados.</li>
 *   <li>Registrar nuevos mensajeros.</li>
 * </ul>
 */
@Injectable({
  providedIn: 'root',
})
export class ApiMensajeros {
  // -------------------------------------------------------------------------
  // CONFIGURACIÓN
  // -------------------------------------------------------------------------

  /**
   * URL base de los endpoints de mensajeros.
   */
  private readonly baseUrl = `${environment.apiUrl}/gastos-costos/mensajeria/mensajeros`;

  /**
   * Cliente HTTP utilizado para comunicarse con el backend.
   */
  constructor(private readonly httpClient: HttpClient) {}

  // -------------------------------------------------------------------------
  // OBTENER MENSAJEROS
  // -------------------------------------------------------------------------

  /**
   * Obtiene todos los mensajeros registrados.
   *
   * @returns Observable con la respuesta de la API y la lista
   *          de mensajeros.
   */
  public obtenerMensajeros(): Observable<ApiResponse<Mensajeros[]>> {
    return this.httpClient.get<ApiResponse<Mensajeros[]>>(`${this.baseUrl}/obtener-todos`);
  }

  // -------------------------------------------------------------------------
  // REGISTRAR MENSAJERO
  // -------------------------------------------------------------------------

  /**
   * Registra un nuevo mensajero.
   *
   * @param mensajero información del mensajero que será registrado.
   * @returns Observable con la respuesta de la API y el mensajero creado.
   */
  public registrarMensajero(mensajero: Mensajeros): Observable<ApiResponse<Mensajeros>> {
    return this.httpClient.post<ApiResponse<Mensajeros>>(`${this.baseUrl}/registrar`, mensajero);
  }
}
