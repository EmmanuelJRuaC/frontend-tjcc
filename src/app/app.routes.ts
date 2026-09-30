import { Routes } from '@angular/router';

// Componentes principales
import { Tabla } from './components/tabla/tabla';
import { Clientes } from './components/clientes/clientes';
import { Facturas } from './components/facturas/facturas';

// Componentes del módulo Cecilia
import { Gastos } from './components/cecilia/gastos/gastos';

// Componentes del módulo Gastos y Costos
import { Mensajeria } from './components/gastos_costos/mensajeria/mensajeria';
import { GastosCostos } from './components/gastos_costos/gastos-costos/gastos-costos';

// Autenticación
import { Login } from './components/login/login';

// Guards
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';
import { rootGuard } from './guards/root.guard';

/**
 * Configuración principal de las rutas de la aplicación.
 *
 * <p>
 * Las rutas se encuentran protegidas mediante diferentes guards
 * dependiendo del estado de autenticación y del rol del usuario.
 *
 * <ul>
 * <li>{@code rootGuard}: controla el acceso a la ruta raíz.</li>
 * <li>{@code guestGuard}: permite el acceso al login únicamente
 *     cuando el usuario no está autenticado.</li>
 * <li>{@code authGuard}: protege las rutas que requieren autenticación.</li>
 * <li>{@code roleGuard}: controla el acceso según el rol del usuario.</li>
 * </ul>
 */
export const routes: Routes = [
  // ============================================================
  // RUTA RAÍZ
  // ============================================================

  /**
   * Ruta inicial de la aplicación.
   *
   * <p>
   * El {@code rootGuard} determina a qué sección debe ser dirigido
   * el usuario dependiendo de su estado de autenticación y permisos.
   */
  {
    path: '',
    canActivate: [rootGuard],
    pathMatch: 'full',
    children: [],
  },

  // ============================================================
  // AUTENTICACIÓN
  // ============================================================

  /**
   * Pantalla de inicio de sesión.
   *
   * <p>
   * El {@code guestGuard} evita que un usuario autenticado
   * pueda regresar al login.
   */
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },

  // ============================================================
  // RUTAS PROTEGIDAS
  // ============================================================

  /**
   * Grupo principal de rutas protegidas.
   *
   * <p>
   * Todas las rutas definidas dentro de este bloque requieren
   * autenticación y el rol {@code USUARIO}.
   */
  {
    path: '',
    canActivate: [authGuard, roleGuard],

    data: {
      roles: ['USUARIO'],
    },

    children: [
      // ========================================================
      // CLIENTES
      // ========================================================

      /**
       * Tabla principal de información.
       *
       * URL:
       * /tabla
       */
      {
        path: 'tabla',
        component: Tabla,
      },

      /**
       * Gestión de clientes.
       *
       * URL:
       * /clientes
       */
      {
        path: 'clientes',
        component: Clientes,
      },

      /**
       * Gestión de facturas.
       *
       * URL:
       * /facturas
       */
      {
        path: 'facturas',
        component: Facturas,
      },

      // ========================================================
      // CECILIA
      // ========================================================

      /**
       * Módulo principal de Cecilia.
       */
      {
        path: 'cecilia',
        children: [
          /**
           * Gestión de gastos de Cecilia.
           *
           * URL:
           * /cecilia/gastos
           */
          {
            path: 'gastos',
            component: Gastos,
          },
        ],
      },

      // ========================================================
      // GASTOS Y COSTOS
      // ========================================================

      /**
       * Módulo de gastos y costos.
       */
      {
        path: 'gastos-costos',
        children: [
          /**
           * Gestión de mensajería.
           *
           * URL:
           * /gastos-costos/mensajeria
           */
          {
            path: 'mensajeria',
            component: Mensajeria,
          },

          /**
           * Gestión general de gastos y costos.
           *
           * URL:
           * /gastos-costos/gastos-costos
           */
          {
            path: 'gastos-costos',
            component: GastosCostos,
          },
        ],
      },
    ],
  },

  // ============================================================
  // RUTA NO ENCONTRADA
  // ============================================================

  /**
   * Cualquier ruta que no exista será redirigida a la tabla principal.
   */
  {
    path: '**',
    redirectTo: 'tabla',
  },
];
