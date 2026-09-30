import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../hooks/utils';
import { AnioGastos, CrearGastos, Gasto } from '../../../../models/cecilia/Gastos';

import { environment } from '../../../../enviroments/environment';

/**
 * Servicio encargado de realizar las peticiones HTTP relacionadas
 * con la gestión de gastos del módulo Cecilia.
 *
 * <p>
 * Este servicio centraliza la comunicación entre Angular y la API
 * REST de gastos.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGastos {
  /**
   * URL base de los endpoints de gastos.
   */
  private readonly baseURL = `${environment.apiUrl}/cecilia/gastos`;

  /**
   * Constructor del servicio.
   *
   * @param httpClient cliente HTTP utilizado para comunicarse
   *        con la API
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene todos los gastos agrupados por año y mes.
   *
   * @returns Observable con la respuesta de la API y los gastos
   *          agrupados por año
   */
  public obtenerGastos(): Observable<ApiResponse<AnioGastos[]>> {
    return this.httpClient.get<ApiResponse<AnioGastos[]>>(`${this.baseURL}/obtener-todos`);
  }

  /**
   * Registra uno o varios gastos.
   *
   * @param gastos lista de gastos que se desean registrar
   * @returns Observable con la respuesta de la API
   */
  public registrarGastos(gastos: CrearGastos[]): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseURL}/registrar`, gastos);
  }

  /**
   * Actualiza un gasto existente.
   *
   * @param id identificador del gasto que se desea actualizar
   * @param gasto información actualizada del gasto
   * @returns Observable con la respuesta de la API y el gasto actualizado
   */
  public actualizarGasto(id: number, gasto: Gasto): Observable<ApiResponse<Gasto>> {
    return this.httpClient.put<ApiResponse<Gasto>>(`${this.baseURL}/actualizar/${id}`, gasto);
  }

  /**
   * Elimina un gasto por su identificador.
   *
   * @param id identificador del gasto que se desea eliminar
   * @returns Observable con la respuesta de la API
   */
  public eliminarGasto(id: number): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`${this.baseURL}/eliminar/${id}`);
  }
}
