import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginData, LoginRequest } from '../../models/usuarios/Auth';
import { ApiResponse } from '../../hooks/utils';
import { environment } from '../../enviroments/environment';

/**
 * Servicio encargado de gestionar la autenticación de los usuarios.
 *
 * <p>
 * Este servicio se comunica con la API de autenticación para iniciar sesión
 * y administra localmente el token, usuario y roles del usuario autenticado.
 *
 * <p>
 * La información de autenticación se almacena en {@code localStorage}
 * para mantener la sesión mientras exista el token almacenado.
 */
@Injectable({
  providedIn: 'root',
})
export class Auth {
  // ---------------------------------------------------------------------------
  // CONFIGURACIÓN
  // ---------------------------------------------------------------------------

  /**
   * URL base de los endpoints relacionados con autenticación.
   */
  private readonly baseURL = `${environment.apiUrl}/auth`;

  /**
   * Clave utilizada para almacenar el token de autenticación.
   */
  private readonly TOKEN_KEY = '_token';

  /**
   * Clave utilizada para almacenar el usuario autenticado.
   */
  private readonly USER_KEY = '_usuario';

  /**
   * Clave utilizada para almacenar los roles del usuario autenticado.
   */
  private readonly ROLES_KEY = '_roles';

  /**
   * Clave utilizada para almacenar el nombre del usuario autenticado.
   */
  private readonly NOMBRE_KEY = '_nombre';

  /**
   * Clave utilizada para almacenar el apellido del usuario autenticado.
   */
  private readonly APELLIDO_KEY = '_apellido';

  // ---------------------------------------------------------------------------
  // CONSTRUCTOR
  // ---------------------------------------------------------------------------

  /**
   * Inicializa el servicio de autenticación.
   *
   * @param httpClient cliente HTTP utilizado para comunicarse con la API
   */
  constructor(private httpClient: HttpClient) {}

  // ---------------------------------------------------------------------------
  // AUTENTICACIÓN
  // ---------------------------------------------------------------------------

  /**
   * Inicia sesión utilizando las credenciales proporcionadas.
   *
   * <p>
   * Cuando la autenticación es exitosa, almacena en {@code localStorage}
   * el token, el usuario y los roles recibidos desde el backend.
   *
   * @param credenciales información utilizada para iniciar sesión
   * @returns Observable con la respuesta de autenticación de la API
   */
  public iniciarSesion(credenciales: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.httpClient.post<ApiResponse<LoginData>>(`${this.baseURL}/login`, credenciales).pipe(
      tap((respuesta) => {
        if (!respuesta.success || !respuesta.data) {
          return;
        }

        localStorage.setItem(this.TOKEN_KEY, respuesta.data.token);
        localStorage.setItem(this.USER_KEY, respuesta.data.usuario);
        localStorage.setItem(this.ROLES_KEY, JSON.stringify(respuesta.data.roles));
        localStorage.setItem(this.NOMBRE_KEY, respuesta.data.nombre);
        localStorage.setItem(this.APELLIDO_KEY, respuesta.data.apellido);
      }),
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * <p>
   * Elimina del {@code localStorage} toda la información relacionada
   * con la autenticación.
   */
  public cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLES_KEY);
    localStorage.removeItem(this.NOMBRE_KEY);
    localStorage.removeItem(this.APELLIDO_KEY);
  }

  // ---------------------------------------------------------------------------
  // INFORMACIÓN DE AUTENTICACIÓN
  // ---------------------------------------------------------------------------

  /**
   * Obtiene el token de autenticación almacenado.
   *
   * @returns token almacenado o {@code null} si no existe
   */
  public obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el usuario autenticado.
   *
   * @returns Usuario o {@code null} si no existe
   */
  public obtenerUsuario(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  /**
   * Obtiene el nombre del usuario autenticado.
   *
   * @returns nombre del usuario o {@code null} si no existe
   */
  public obtenerNombre(): string | null {
    return localStorage.getItem(this.NOMBRE_KEY);
  }

  /**
   * Obtiene el apellido del usuario autenticado.
   *
   * @returns apellido del usuario o {@code null} si no existe
   */
  public obtenerApellido(): string | null {
    return localStorage.getItem(this.APELLIDO_KEY);
  }

  /**
   * Obtiene los roles almacenados del usuario autenticado.
   *
   * <p>
   * Si no existen roles almacenados o el contenido no puede ser
   * convertido correctamente desde JSON, devuelve una lista vacía.
   *
   * @returns lista de roles del usuario autenticado
   */
  public obtenerRoles(): string[] {
    const roles = localStorage.getItem(this.ROLES_KEY);

    if (!roles) {
      return [];
    }

    try {
      return JSON.parse(roles);
    } catch (error) {
      console.error('Error leyendo los roles del usuario:', error);
      return [];
    }
  }

  /**
   * Determina si existe una sesión autenticada.
   *
   * <p>
   * Actualmente se considera que el usuario está autenticado cuando
   * existe un token almacenado.
   *
   * @returns {@code true} si existe un token; {@code false} en caso contrario
   */
  public estaAutenticado(): boolean {
    const token = this.obtenerToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const ahora = Math.floor(Date.now() / 1000);

      if (!payload.exp) {
        this.cerrarSesion();
        return false;
      }

      if (payload.exp <= ahora) {
        this.cerrarSesion();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token JWT inválido:', error);

      this.cerrarSesion();
      return false;
    }
  }

  /**
   * Verifica si el usuario autenticado posee un determinado rol.
   *
   * @param rol nombre del rol que se desea comprobar
   * @returns {@code true} si el usuario posee el rol; {@code false} en caso contrario
   */
  public tieneRol(rol: string): boolean {
    return this.obtenerRoles().includes(rol);
  }
}
