import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../../hooks/utils';
import { environment } from '../../../../../enviroments/environment';
import { Taller_Costos } from '../../../../../models/gastos_costos/taller/Taller-Gastos_Costos';

/**
 * Servicio encargado de gestionar las peticiones HTTP relacionadas
 * con los costos del taller.
 *
 * <p>
 * Este servicio se comunica con la API REST del backend para consultar,
 * registrar, actualizar y eliminar costos del taller.
 * </p>
 */
@Injectable({
  providedIn: 'root',
})
export class ApiTallerCostos {
  // =========================================================================
  // CONFIGURACIÓN
  // =========================================================================

  /**
   * URL base del recurso de costos del taller.
   */
  private readonly baseUrl = `${environment.apiUrl}/gastos-costos/taller/taller-costos`;

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  /**
   * Inicializa el servicio.
   *
   * @param httpClient cliente HTTP utilizado para comunicarse con el backend.
   */
  constructor(private readonly httpClient: HttpClient) {}

  // =========================================================================
  // CONSULTAS
  // =========================================================================

  /**
   * Obtiene todos los costos registrados del taller.
   *
   * @returns observable con la respuesta de la API y la lista de costos.
   */
  public obtenerTallerCostos(): Observable<ApiResponse<Taller_Costos[]>> {
    return this.httpClient.get<ApiResponse<Taller_Costos[]>>(`${this.baseUrl}/obtener-todos`);
  }

  // =========================================================================
  // REGISTRO
  // =========================================================================

  /**
   * Registra un nuevo costo del taller.
   *
   * <p>
   * El usuario autenticado se determina en el backend mediante
   * el JWT y el contexto de seguridad.
   * </p>
   *
   * @param tallerCostos costo que se desea registrar.
   * @returns observable con el costo registrado.
   */
  public registrarTallerCosto(tallerCostos: Taller_Costos): Observable<ApiResponse<Taller_Costos>> {
    return this.httpClient.post<ApiResponse<Taller_Costos>>(
      `${this.baseUrl}/registrar`,
      tallerCostos,
    );
  }

  // =========================================================================
  // ACTUALIZACIÓN
  // =========================================================================

  /**
   * Actualiza un costo existente del taller.
   *
   * @param id identificador del costo que se desea actualizar.
   * @param tallerCostos datos actualizados del costo.
   * @returns observable con el costo actualizado.
   */
  public actualizarTallerCosto(
    id: number,
    tallerCostos: Taller_Costos,
  ): Observable<ApiResponse<Taller_Costos>> {
    return this.httpClient.patch<ApiResponse<Taller_Costos>>(
      `${this.baseUrl}/actualizar/${id}`,
      tallerCostos,
    );
  }

  // =========================================================================
  // ELIMINACIÓN
  // =========================================================================

  /**
   * Elimina un costo del taller por su identificador.
   *
   * @param id identificador del costo que se desea eliminar.
   * @returns observable con la respuesta de la API.
   */
  public eliminarTallerCosto(id: number): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`${this.baseUrl}/eliminar/${id}`);
  }
}
