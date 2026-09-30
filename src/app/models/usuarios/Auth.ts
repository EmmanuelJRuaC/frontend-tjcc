/**
 * Datos requeridos para iniciar sesión en el sistema.
 *
 * Esta interfaz representa las credenciales que el frontend
 * envía al endpoint de autenticación.
 */
export interface LoginRequest {

  /**
   * Nombre de usuario utilizado para autenticarse.
   */
  usuario: string;

  /**
   * Contraseña utilizada para autenticarse.
   */
  contrasena: string;
}

/**
 * Información devuelta por el backend después de una
 * autenticación exitosa.
 *
 * Contiene el token JWT, la información básica del usuario
 * y los roles que tiene asignados.
 */
export interface LoginData {

  /**
   * Token JWT utilizado para autenticar las peticiones
   * posteriores al backend.
   */
  token: string;

  /**
   * Nombre de usuario autenticado.
   */
  usuario: string;

  /**
   * Roles asignados al usuario.
   */
  roles: string[];

  /**
   * Nombre del usuario autenticado.
   */
  nombre: string;

  /**
   * Apellido del usuario autenticado.
   */
  apellido: string;
}
