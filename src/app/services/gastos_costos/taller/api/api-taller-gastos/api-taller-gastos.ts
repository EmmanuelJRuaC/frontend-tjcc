import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../../hooks/utils';
import { environment } from '../../../../../enviroments/environment';
import { Taller_Gastos } from '../../../../../models/gastos_costos/taller/Taller-Gastos_Costos';

/**
 * Servicio encargado de gestionar las peticiones HTTP relacionadas
 * con los gastos del taller.
 *
 * <p>
 * Este servicio se comunica con la API REST del backend para consultar,
 * registrar, actualizar y eliminar gastos del taller.
 * </p>
 */
@Injectable({
  providedIn: 'root',
})
export class ApiTallerGastos {
  // =========================================================================
  // CONFIGURACIÓN
  // =========================================================================

  /**
   * URL base del recurso de gastos del taller.
   */
  private readonly baseUrl = `${environment.apiUrl}/gastos-costos/taller/taller-gastos`;

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
   * Obtiene todos los gastos registrados del taller.
   *
   * @returns observable con la respuesta de la API y la lista de gastos.
   */
  public obtenerTallerGastos(): Observable<ApiResponse<Taller_Gastos[]>> {
    return this.httpClient.get<ApiResponse<Taller_Gastos[]>>(`${this.baseUrl}/obtener-todos`);
  }

  // =========================================================================
  // REGISTRO
  // =========================================================================

  /**
   * Registra un nuevo gasto del taller.
   *
   * <p>
   * El usuario autenticado se determina en el backend mediante
   * el JWT y el contexto de seguridad.
   * </p>
   *
   * @param tallerGastos gasto que se desea registrar.
   * @returns observable con el gasto registrado.
   */
  public registrarTallerGasto(tallerGastos: Taller_Gastos): Observable<ApiResponse<Taller_Gastos>> {
    return this.httpClient.post<ApiResponse<Taller_Gastos>>(
      `${this.baseUrl}/registrar`,
      tallerGastos,
    );
  }

  // =========================================================================
  // ACTUALIZACIÓN
  // =========================================================================

  /**
   * Actualiza un gasto existente del taller.
   *
   * @param id identificador del gasto que se desea actualizar.
   * @param tallerGastos datos actualizados del gasto.
   * @returns observable con el gasto actualizado.
   */
  public actualizarTallerGasto(
    id: number,
    tallerGastos: Taller_Gastos,
  ): Observable<ApiResponse<Taller_Gastos>> {
    return this.httpClient.patch<ApiResponse<Taller_Gastos>>(
      `${this.baseUrl}/actualizar/${id}`,
      tallerGastos,
    );
  }

  // =========================================================================
  // ELIMINACIÓN
  // =========================================================================

  /**
   * Elimina un gasto del taller por su identificador.
   *
   * @param id identificador del gasto que se desea eliminar.
   * @returns observable con la respuesta de la API.
   */
  public eliminarTallerGasto(id: number): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`${this.baseUrl}/eliminar/${id}`);
  }
}
