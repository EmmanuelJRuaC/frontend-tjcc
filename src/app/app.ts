import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';

import { PefilUsuario } from './components/perfil-usuario/perfil-usuario';
import { Opciones } from './components/opciones/opciones';
import { ApiFactura } from './services/factura/api/api-factura';
import { Auth } from './services/usuarios/auth';
import { Formatear } from './hooks/utils';

/**
 * Componente raíz de la aplicación.
 *
 * <p>
 * Se encarga de gestionar la estructura principal de la aplicación,
 * incluyendo:
 * <ul>
 * <li>La navegación mediante el router.</li>
 * <li>El estado del menú lateral.</li>
 * <li>La información del usuario autenticado.</li>
 * <li>La cantidad de facturas pendientes.</li>
 * <li>El cierre de sesión del usuario.</li>
 * </ul>
 */
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkWithHref, RouterLinkActive, RouterOutlet, PefilUsuario, Opciones],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App implements OnInit {
  /**
   * Indica si el menú lateral tipo drawer se encuentra abierto.
   */
  drawerOpen = false;

  /**
   * Indica si la barra lateral se encuentra contraída.
   */
  sidebarCollapsed = false;

  /**
   * Cantidad de facturas pendientes del usuario.
   */
  facturasPendientes = signal(0);

  /**
   * Identificador del usuario actualmente autenticado.
   *
   * <p>
   * Su valor es {@code null} cuando no existe un usuario autenticado.
   */
  usuarioActual: string | null = null;

  /**
   * Rol o Roles del usuario actualmente autenticado.
   *
   * <p>
   * Su valor es {@code null} cuando no existe un usuario autenticado.
   */
  rolesActual: string[] | null = null;

  /**
   * Nombre del usuario actualmente autenticado.
   *
   * <p>
   * Su valor es {@code null} cuando no existe un usuario autenticado.
   */
  nombreActual: string | null = null;

  /**
   * Apellido del usuario actualmente autenticado.
   *
   * <p>
   * Su valor es {@code null} cuando no existe un usuario autenticado.
   */
  apellidoActual: string | null = null;

  /**
   * Instancia utilizada para formatear fechas y valores monetarios.
   */
  public formatear = new Formatear();

  /**
   * Constructor del componente principal.
   *
   * @param router servicio utilizado para realizar la navegación
   * @param apiFactura servicio encargado de consultar la información
   *        relacionada con las facturas
   * @param authService servicio encargado de gestionar la autenticación
   *        y la sesión del usuario
   */
  constructor(
    public router: Router,
    private apiFactura: ApiFactura,
    public authService: Auth,
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
    this.rolesActual = this.authService.obtenerRoles();
    this.nombreActual = this.authService.obtenerNombre();
    this.apellidoActual = this.authService.obtenerApellido();
  }

  /**
   * Indica si existe actualmente una sesión autenticada.
   *
   * @returns {@code true} si el usuario está autenticado;
   *          {@code false} en caso contrario
   */
  get isAuthenticated(): boolean {
    return this.authService.estaAutenticado();
  }

  /**
   * Inicializa el componente.
   *
   * <p>
   * Si existe un usuario autenticado, obtiene nuevamente su información
   * y consulta la cantidad de facturas pendientes.
   */
  ngOnInit(): void {
    if (!this.isAuthenticated) {
      return;
    }

    this.usuarioActual = this.authService.obtenerUsuario();
    this.rolesActual = this.authService.obtenerRoles();
    this.nombreActual = this.authService.obtenerNombre();
    this.apellidoActual = this.authService.obtenerApellido();

    this.obtenerFacturasPendientes();
  }

  /**
   * Obtiene la cantidad de facturas pendientes mediante el servicio
   * de facturas y actualiza el signal correspondiente.
   *
   * <p>
   * Si ocurre un error durante la consulta, se registra la información
   * en la consola del navegador.
   */
  private obtenerFacturasPendientes(): void {
    this.apiFactura.getFacturasPendientes().subscribe({
      next: (res) => {
        this.facturasPendientes.set(res.data);
      },

      error: (error) => {
        console.error('Error obteniendo facturas pendientes:', error);
      },
    });
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * <p>
   * Elimina la información de autenticación, limpia el usuario actual
   * y redirige al usuario hacia la pantalla de inicio de sesión.
   */
  cerrarSesion(): void {
    this.authService.cerrarSesion();

    this.usuarioActual = null;

    this.router.navigate(['/login']);
  }

  /**
   * Actualiza la posición vertical del tooltip utilizando
   * el centro vertical del elemento que lo activa.
   *
   * <p>
   * La posición calculada se almacena en la variable CSS
   * {@code --tt-y}, permitiendo que el tooltip se posicione
   * dinámicamente respecto al elemento correspondiente.
   * </p>
   *
   * @param event evento del mouse generado sobre el elemento.
   */
  actualizarPosicionTooltip(event: MouseEvent): void {
    const elemento = event.currentTarget as HTMLElement;

    if (!elemento) {
      return;
    }

    const rect = elemento.getBoundingClientRect();

    const centroVertical = rect.top + rect.height / 2;

    elemento.style.setProperty('--tt-y', `${centroVertical}px`);
  }
}
