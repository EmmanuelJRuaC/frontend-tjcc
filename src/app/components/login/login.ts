import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/usuarios/auth';
import { ToastService } from '../../hooks/toastservice';
import { Toast } from '../../hooks/toast/toast';

/**
 * Componente encargado de gestionar el inicio de sesión
 * de los usuarios de la aplicación.
 *
 * <p>
 * Permite ingresar las credenciales del usuario, mostrar u ocultar
 * la contraseña y controlar el estado de carga durante la autenticación.
 *
 * <p>
 * Los resultados de la autenticación se comunican al usuario
 * mediante mensajes Toast.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // ---------------------------------------------------------------------------
  // SERVICIOS
  // ---------------------------------------------------------------------------

  /**
   * Servicio encargado de realizar la autenticación
   * y administrar la sesión del usuario.
   */
  private readonly authService = inject(Auth);

  /**
   * Servicio encargado de realizar la navegación entre rutas.
   */
  private readonly router = inject(Router);

  /**
   * Servicio encargado de mostrar mensajes Toast.
   */
  private readonly toast = inject(ToastService);

  // ---------------------------------------------------------------------------
  // VARIABLES
  // ---------------------------------------------------------------------------

  /**
   * Credenciales ingresadas por el usuario.
   */
  public credenciales = {
    usuario: '',
    contrasena: '',
  };

  /**
   * Indica si actualmente se está procesando el inicio de sesión.
   *
   * <p>
   * Se utiliza para evitar que el usuario envíe varias solicitudes
   * simultáneamente.
   */
  public cargando = false;

  /**
   * Controla si la contraseña se muestra como texto o como contraseña.
   */
  public mostrarContrasena = false;

  // ---------------------------------------------------------------------------
  // AUTENTICACIÓN
  // ---------------------------------------------------------------------------

  /**
   * Inicia sesión utilizando las credenciales ingresadas.
   *
   * <p>
   * Antes de realizar la solicitud se valida que el usuario y la
   * contraseña hayan sido ingresados.
   *
   * <p>
   * Si la autenticación es exitosa, se muestra un mensaje de confirmación
   * y el usuario es redirigido a la página principal.
   *
   * <p>
   * Si la autenticación falla, se muestra el mensaje correspondiente
   * y se permite nuevamente el envío del formulario.
   */
  public iniciarSesion(): void {
    /**
     * Evita enviar múltiples solicitudes mientras existe
     * una solicitud de autenticación en curso.
     */
    if (this.cargando) {
      return;
    }

    // -------------------------------------------------------------------------
    // VALIDACIÓN
    // -------------------------------------------------------------------------

    if (!this.credenciales.usuario.trim() || !this.credenciales.contrasena) {
      this.toast.warning('Ingrese el usuario y la contraseña.', 3500);

      return;
    }

    // -------------------------------------------------------------------------
    // INICIO DE SOLICITUD
    // -------------------------------------------------------------------------

    this.cargando = true;

    this.authService.iniciarSesion(this.credenciales).subscribe({
      // -----------------------------------------------------------------------
      // RESPUESTA EXITOSA DEL SERVIDOR
      // -----------------------------------------------------------------------

      next: (respuesta) => {
        if (!respuesta.success || !respuesta.data) {
          this.toast.error(respuesta.message || 'No fue posible iniciar sesión.', 3500);

          this.cargando = false;

          return;
        }

        // ---------------------------------------------------------------------
        // AUTENTICACIÓN EXITOSA
        // ---------------------------------------------------------------------

        this.toast.success(respuesta.message || 'Inicio de sesión exitoso.', 2200);

        setTimeout(() => {
          this.router.navigate(['/tabla']);
        }, 1000);
      },

      // -----------------------------------------------------------------------
      // ERROR DE COMUNICACIÓN
      // -----------------------------------------------------------------------

      error: (error) => {
        console.error('Error al iniciar sesión:', error);

        this.toast.error(error.error?.message || 'Usuario o contraseña incorrectos.', 3500);

        this.cargando = false;
      },
    });
  }

  // ---------------------------------------------------------------------------
  // CONTRASEÑA
  // ---------------------------------------------------------------------------

  /**
   * Alterna entre mostrar y ocultar la contraseña.
   *
   * <p>
   * Cambia el valor de {@link mostrarContrasena}, permitiendo que
   * el campo de contraseña alterne entre los tipos {@code text}
   * y {@code password} desde la plantilla HTML.
   */
  public alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
