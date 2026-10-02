import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import {
  Taller_Gastos,
  Taller_Costos,
} from '../../../models/gastos_costos/taller/Taller-Gastos_Costos';

import { ToastService } from '../../../hooks/toastservice';
import { Toast } from '../../../hooks/toast/toast';
import { Formatear } from '../../../hooks/utils';

import { ApiTallerGastos } from '../../../services/gastos_costos/taller/api/api-taller-gastos/api-taller-gastos';
import { ApiTallerCostos } from '../../../services/gastos_costos/taller/api/api-taller-costos/api-taller-costos';

/**
 * Componente encargado de gestionar los gastos y costos del taller.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar gastos y costos
 * asociados al taller.
 * </p>
 *
 * <p>
 * La autenticación y asociación del usuario se gestionan en el backend
 * mediante el JWT y el contexto de seguridad.
 * </p>
 */
@Component({
  selector: 'app-gastos-costos',
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './gastos-costos.html',
  styleUrl: './gastos-costos.css',
})
export class GastosCostos implements OnInit {

  // =========================================================================
  // DATOS
  // =========================================================================

  /**
   * Lista de gastos registrados del taller.
   */
  gastos = signal<Taller_Gastos[]>([]);

  /**
   * Lista de costos registrados del taller.
   */
  costos = signal<Taller_Costos[]>([]);

  // =========================================================================
  // MODALES
  // =========================================================================

  /**
   * Indica si el modal para registrar un nuevo gasto está abierto.
   */
  modalNuevoGasto = false;

  /**
   * Indica si el modal para registrar un nuevo costo está abierto.
   */
  modalNuevoCosto = false;

  // =========================================================================
  // EDICIÓN DE GASTOS
  // =========================================================================

  /**
   * Identificador del gasto que se está editando.
   */
  gastoEditando: number | null = null;

  /**
   * Información temporal del gasto que se está editando.
   */
  gastoEditado: Taller_Gastos | null = null;

  // =========================================================================
  // EDICIÓN DE COSTOS
  // =========================================================================

  /**
   * Identificador del costo que se está editando.
   */
  costoEditando: number | null = null;

  /**
   * Información temporal del costo que se está editando.
   */
  costoEditado: Taller_Costos | null = null;

  // =========================================================================
  // ELIMINACIÓN
  // =========================================================================

  /**
   * Identificador del gasto cuya eliminación está pendiente de confirmación.
   */
  gastoEliminando: number | null = null;

  /**
   * Identificador del costo cuya eliminación está pendiente de confirmación.
   */
  costoEliminando: number | null = null;

  // =========================================================================
  // FORMULARIOS
  // =========================================================================

  /**
   * Modelo utilizado para registrar un nuevo gasto.
   */
  nuevoGasto: Taller_Gastos = {
    fecha: '',
    articulo: '',
    valor: null,
    tipoPago: 'EFECTIVO',
  };

  /**
   * Modelo utilizado para registrar un nuevo costo.
   */
  nuevoCosto: Taller_Costos = {
    fecha: '',
    articulo: '',
    valor: null,
    tipoPago: 'EFECTIVO',
    pagadoA: '',
    detalles: '',
  };

  /**
   * Tipos de pago disponibles para gastos y costos.
   */
  tiposPago: string[] = [
    'EFECTIVO',
    'T_CC',
    'T_BS',
    'T_MM',
    'T_HH',
    'DATAFONO',
  ];

  // =========================================================================
  // UTILIDADES
  // =========================================================================

  /**
   * Instancia utilizada para formatear valores y fechas.
   */
  public formatear = new Formatear();

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  /**
   * Inicializa el componente.
   *
   * @param apiTallerGastos servicio para gestionar los gastos del taller.
   * @param apiTallerCostos servicio para gestionar los costos del taller.
   * @param toast           servicio utilizado para mostrar notificaciones.
   */
  constructor(
    private readonly apiTallerGastos: ApiTallerGastos,
    private readonly apiTallerCostos: ApiTallerCostos,
    public toast: ToastService,
  ) {}

  // =========================================================================
  // CICLO DE VIDA
  // =========================================================================

  /**
   * Inicializa el componente y obtiene los gastos y costos registrados.
   */
  ngOnInit(): void {
    this.obtenerTallerGastos();
    this.obtenerTallerCostos();
  }

  // =========================================================================
  // GASTOS - CONSULTA
  // =========================================================================

  /**
   * Obtiene los gastos registrados del taller.
   */
  private obtenerTallerGastos(): void {

    this.apiTallerGastos.obtenerTallerGastos().subscribe({

      next: (respuesta) => {

        this.gastos.set(respuesta.data ?? []);

      },

      error: (error) => {

        console.error(
          'Error al obtener los gastos del taller:',
          error,
        );

        this.toast.error(
          error?.error?.message ??
          'No fue posible obtener los gastos del taller.',
          3500,
        );
      },
    });
  }

  // =========================================================================
  // GASTOS - REGISTRO
  // =========================================================================

  /**
   * Abre el modal para registrar un nuevo gasto.
   */
  abrirModalGasto(): void {

    this.nuevoGasto = {
      fecha: '',
      articulo: '',
      valor: null,
      tipoPago: 'EFECTIVO',
    };

    this.modalNuevoGasto = true;
  }

  /**
   * Cierra el modal de registro de gastos.
   */
  cerrarModalGasto(): void {
    this.modalNuevoGasto = false;
  }

  /**
   * Registra un nuevo gasto del taller.
   *
   * @param formulario formulario de registro del gasto.
   */
  crearGasto(formulario: NgForm): void {

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.apiTallerGastos
      .registrarTallerGasto(this.nuevoGasto)
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          if (respuesta.data) {

            this.gastos.update(
              (gastos) => [
                ...gastos,
                respuesta.data,
              ],
            );
          }

          formulario.resetForm({
            tipoPago: 'EFECTIVO',
          });

          this.cerrarModalGasto();
        },

        error: (error) => {

          console.error(
            'Error al registrar el gasto del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible registrar el gasto del taller.',
            3500,
          );
        },
      });
  }

  // =========================================================================
  // GASTOS - EDICIÓN
  // =========================================================================

  /**
   * Inicia la edición de un gasto.
   *
   * @param gasto gasto que se desea editar.
   */
  editarGasto(gasto: Taller_Gastos): void {

    if (!gasto.id) {
      this.toast.error(
        'El gasto seleccionado no tiene un identificador válido.',
        3500,
      );
      return;
    }

    this.gastoEditando = gasto.id;

    this.gastoEditado = {
      id: gasto.id,
      fecha: gasto.fecha,
      articulo: gasto.articulo,
      valor: gasto.valor,
      tipoPago: gasto.tipoPago,
    };
  }

  /**
   * Cancela la edición del gasto actual.
   */
  cancelarEdicionGasto(): void {

    this.gastoEditando = null;
    this.gastoEditado = null;
  }

  /**
   * Actualiza un gasto existente del taller.
   *
   * @param formulario formulario de edición del gasto.
   */
  actualizarGasto(formulario: NgForm): void {

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    if (!this.gastoEditando || !this.gastoEditado) {
      this.toast.error(
        'No hay un gasto seleccionado para actualizar.',
        3500,
      );
      return;
    }

    const idGasto = this.gastoEditando;

    this.apiTallerGastos
      .actualizarTallerGasto(
        idGasto,
        this.gastoEditado,
      )
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          this.gastos.update(
            (gastos) =>
              gastos.map(
                (gasto) =>
                  gasto.id === idGasto
                    ? {
                        ...gasto,
                        ...this.gastoEditado,
                      }
                    : gasto,
              ),
          );

          formulario.resetForm();

          this.cancelarEdicionGasto();
        },

        error: (error) => {

          console.error(
            'Error al actualizar el gasto del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible actualizar el gasto del taller.',
            3500,
          );
        },
      });
  }

  // =========================================================================
  // GASTOS - ELIMINACIÓN
  // =========================================================================

  /**
   * Solicita confirmación para eliminar un gasto.
   *
   * @param id identificador del gasto.
   */
  confirmarEliminarGasto(id: number): void {
    this.gastoEliminando = id;
  }

  /**
   * Cancela la eliminación del gasto.
   */
  cancelarEliminarGasto(): void {
    this.gastoEliminando = null;
  }

  /**
   * Elimina un gasto del taller.
   *
   * @param id identificador del gasto que se desea eliminar.
   */
  eliminarGasto(id: number): void {

    this.apiTallerGastos
      .eliminarTallerGasto(id)
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          this.gastos.update(
            (gastos) =>
              gastos.filter(
                (gasto) => gasto.id !== id,
              ),
          );

          if (this.gastoEditando === id) {
            this.cancelarEdicionGasto();
          }

          this.gastoEliminando = null;
        },

        error: (error) => {

          console.error(
            'Error al eliminar el gasto del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible eliminar el gasto del taller.',
            3500,
          );

          this.gastoEliminando = null;
        },
      });
  }

  // =========================================================================
  // COSTOS - CONSULTA
  // =========================================================================

  /**
   * Obtiene los costos registrados del taller.
   */
  private obtenerTallerCostos(): void {

    this.apiTallerCostos.obtenerTallerCostos().subscribe({

      next: (respuesta) => {

        this.costos.set(respuesta.data ?? []);

      },

      error: (error) => {

        console.error(
          'Error al obtener los costos del taller:',
          error,
        );

        this.toast.error(
          error?.error?.message ??
          'No fue posible obtener los costos del taller.',
          3500,
        );
      },
    });
  }

  // =========================================================================
  // COSTOS - REGISTRO
  // =========================================================================

  /**
   * Abre el modal para registrar un nuevo costo.
   */
  abrirModalCosto(): void {

    this.nuevoCosto = {
      fecha: '',
      articulo: '',
      valor: null,
      tipoPago: 'EFECTIVO',
      pagadoA: '',
      detalles: '',
    };

    this.modalNuevoCosto = true;
  }

  /**
   * Cierra el modal de registro de costos.
   */
  cerrarModalCosto(): void {
    this.modalNuevoCosto = false;
  }

  /**
   * Registra un nuevo costo del taller.
   *
   * @param formulario formulario de registro del costo.
   */
  crearCosto(formulario: NgForm): void {

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.apiTallerCostos
      .registrarTallerCosto(this.nuevoCosto)
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          if (respuesta.data) {

            this.costos.update(
              (costos) => [
                ...costos,
                respuesta.data,
              ],
            );
          }

          formulario.resetForm({
            tipoPago: 'EFECTIVO',
          });

          this.cerrarModalCosto();
        },

        error: (error) => {

          console.error(
            'Error al registrar el costo del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible registrar el costo del taller.',
            3500,
          );
        },
      });
  }

  // =========================================================================
  // COSTOS - EDICIÓN
  // =========================================================================

  /**
   * Inicia la edición de un costo.
   *
   * @param costo costo que se desea editar.
   */
  editarCosto(costo: Taller_Costos): void {

    if (!costo.id) {
      this.toast.error(
        'El costo seleccionado no tiene un identificador válido.',
        3500,
      );
      return;
    }

    this.costoEditando = costo.id;

    this.costoEditado = {
      id: costo.id,
      fecha: costo.fecha,
      articulo: costo.articulo,
      valor: costo.valor,
      tipoPago: costo.tipoPago,
      pagadoA: costo.pagadoA,
      detalles: costo.detalles,
    };
  }

  /**
   * Cancela la edición del costo actual.
   */
  cancelarEdicionCosto(): void {

    this.costoEditando = null;
    this.costoEditado = null;
  }

  /**
   * Actualiza un costo existente del taller.
   *
   * @param formulario formulario de edición del costo.
   */
  actualizarCosto(formulario: NgForm): void {

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    if (!this.costoEditando || !this.costoEditado) {
      this.toast.error(
        'No hay un costo seleccionado para actualizar.',
        3500,
      );
      return;
    }

    const idCosto = this.costoEditando;

    this.apiTallerCostos
      .actualizarTallerCosto(
        idCosto,
        this.costoEditado,
      )
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          this.costos.update(
            (costos) =>
              costos.map(
                (costo) =>
                  costo.id === idCosto
                    ? {
                        ...costo,
                        ...this.costoEditado,
                      }
                    : costo,
              ),
          );

          formulario.resetForm();

          this.cancelarEdicionCosto();
        },

        error: (error) => {

          console.error(
            'Error al actualizar el costo del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible actualizar el costo del taller.',
            3500,
          );
        },
      });
  }

  // =========================================================================
  // COSTOS - ELIMINACIÓN
  // =========================================================================

  /**
   * Solicita confirmación para eliminar un costo.
   *
   * @param id identificador del costo.
   */
  confirmarEliminarCosto(id: number): void {
    this.costoEliminando = id;
  }

  /**
   * Cancela la eliminación del costo.
   */
  cancelarEliminarCosto(): void {
    this.costoEliminando = null;
  }

  /**
   * Elimina un costo del taller.
   *
   * @param id identificador del costo que se desea eliminar.
   */
  eliminarCosto(id: number): void {

    this.apiTallerCostos
      .eliminarTallerCosto(id)
      .subscribe({

        next: (respuesta) => {

          this.toast.success(
            respuesta.message,
            3500,
          );

          this.costos.update(
            (costos) =>
              costos.filter(
                (costo) => costo.id !== id,
              ),
          );

          if (this.costoEditando === id) {
            this.cancelarEdicionCosto();
          }

          this.costoEliminando = null;
        },

        error: (error) => {

          console.error(
            'Error al eliminar el costo del taller:',
            error,
          );

          this.toast.error(
            error?.error?.message ??
            'No fue posible eliminar el costo del taller.',
            3500,
          );

          this.costoEliminando = null;
        },
      });
  }
}
