import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Toast } from '../../../hooks/toast/toast';
import { ToastService } from '../../../hooks/toastservice';
import { Formatear } from '../../../hooks/utils';

import {
  GC_Mensajeria,
  FechaMensajeriaForm,
  Mensajeros,
  SemanasMensajeria,
} from '../../../models/gastos_costos/mensajeria/Mensajeria';

import { ApiMensajeros } from '../../../services/gastos_costos/mensajeria/api/api-mensajeros/api-mensajeros';
import { ApiMensajeria } from '../../../services/gastos_costos/mensajeria/api/api-mensajeria/api-mensajeria';
import { ApiSemanasMensajeria } from '../../../services/gastos_costos/mensajeria/api/api-semanas_mensajeria/api-semanas-mensajeria';

/**
 * Componente principal encargado de gestionar el módulo
 * de mensajería de Gastos y Costos.
 *
 * <p>
 * Permite administrar:
 * </p>
 *
 * <ul>
 *   <li>Mensajeros.</li>
 *   <li>Semanas de mensajería.</li>
 *   <li>Servicios de mensajería.</li>
 *   <li>Creación, edición y eliminación de mensajerías.</li>
 *   <li>Cierre de semanas.</li>
 *   <li>Cálculo de totales.</li>
 * </ul>
 *
 * <p>
 * Las operaciones de creación, edición y eliminación de mensajerías
 * solamente están disponibles mientras la semana seleccionada
 * permanezca abierta.
 * </p>
 */
@Component({
  selector: 'app-mensajeria',
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './mensajeria.html',
  styleUrl: './mensajeria.css',
})
export class Mensajeria implements OnInit {
  // =========================================================================
  // ESTADO PRINCIPAL
  // =========================================================================

  /**
   * Lista de mensajeros registrados.
   */
  mensajeros = signal<Mensajeros[]>([]);

  /**
   * Lista de semanas de mensajería registradas.
   */
  semanasMensajeria = signal<SemanasMensajeria[]>([]);

  /**
   * Lista completa de mensajerías registradas.
   */
  mensajerias = signal<GC_Mensajeria[]>([]);

  // =========================================================================
  // ESTADO DE MODALES
  // =========================================================================

  /**
   * Indica si el modal para registrar mensajeros está abierto.
   */
  modalMensajeros = false;

  /**
   * Indica si el modal para registrar mensajerías está abierto.
   */
  modalMensajeria = false;

  /**
   * Indica si el modal para crear una nueva semana está abierto.
   */
  modalNuevaSemana = false;

  /**
   * Indica si el modal para cerrar una semana está abierto.
   */
  modalCerrarSemana = false;

  // =========================================================================
  // ESTADO DE MENSAJERÍA
  // =========================================================================

  /**
   * Mensajero seleccionado para registrar una nueva mensajería.
   */
  mensajeroSeleccionado: Mensajeros | null = null;

  /**
   * Lista temporal de fechas y servicios que serán registrados
   * para un mensajero.
   */
  fechasMensajeria: FechaMensajeriaForm[] = [];

  /**
   * Identificador de la mensajería que se encuentra en edición.
   */
  mensajeriaEditando: number | null = null;

  /**
   * Copia temporal de la mensajería que se está editando.
   */
  mensajeriaEditada: GC_Mensajeria | null = null;

  /**
   * Identificador de la mensajería pendiente de eliminación.
   */
  mensajeriaEliminando: number | null = null;

  // =========================================================================
  // FORMULARIOS
  // =========================================================================

  /**
   * Información temporal utilizada para registrar un nuevo mensajero.
   */
  nuevoMensajero = {
    nombre: '',
    apellido: '',
  };

  /**
   * Información temporal utilizada para registrar una nueva semana.
   */
  nuevaSemana = {
    fecha_inicio: '',
    fecha_fin: '',
  };

  // =========================================================================
  // SEMANA SELECCIONADA
  // =========================================================================

  /**
   * Identificador de la semana actualmente seleccionada.
   */
  semanaSeleccionadaId = signal<number>(
    this.semanasMensajeria().find((semana) => semana.estado === 'ABIERTA')?.id ?? 0,
  );

  /**
   * Semana actualmente seleccionada.
   */
  semanaActual = computed(() => {
    const id = this.semanaSeleccionadaId();

    return this.semanasMensajeria().find((semana) => semana.id === id) ?? null;
  });

  // =========================================================================
  // UTILIDADES
  // =========================================================================

  /**
   * Instancia utilizada para formatear valores monetarios y fechas.
   */
  public formatear = new Formatear();

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  /**
   * Inicializa el componente y sus servicios.
   *
   * @param apiMensajeros servicio encargado de gestionar los mensajeros.
   * @param apiSemanasMensajeria servicio encargado de gestionar las semanas.
   * @param apiMensajeria servicio encargado de gestionar las mensajerías.
   * @param toast servicio encargado de mostrar notificaciones.
   */
  constructor(
    private readonly apiMensajeros: ApiMensajeros,
    private readonly apiSemanasMensajeria: ApiSemanasMensajeria,
    private readonly apiMensajeria: ApiMensajeria,
    public toast: ToastService,
  ) {}

  // =========================================================================
  // CICLO DE VIDA
  // =========================================================================

  /**
   * Inicializa el componente y carga la información necesaria.
   */
  ngOnInit(): void {
    this.obtenerMensajeros();
    this.obtenerSemanasMensajeria();
    this.obtenerMensajerias();
  }

  // =========================================================================
  // CARGA DE INFORMACIÓN
  // =========================================================================

  /**
   * Obtiene todos los mensajeros registrados.
   */
  private obtenerMensajeros(): void {
    this.apiMensajeros.obtenerMensajeros().subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(respuesta.message || 'No fue posible obtener los mensajeros.', 3500);

          return;
        }

        this.mensajeros.set(respuesta.data ?? []);
      },

      error: (error) => {
        console.error('Error al obtener los mensajeros:', error);

        this.toast.error(error.error?.message || 'No fue posible obtener los mensajeros.', 3500);
      },
    });
  }

  /**
   * Obtiene todas las semanas de mensajería registradas.
   */
  private obtenerSemanasMensajeria(): void {
    this.apiSemanasMensajeria.obtenerSemanasMensajeria().subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(
            respuesta.message || 'No fue posible obtener las semanas de mensajería.',
            3500,
          );

          return;
        }

        const semanas = respuesta.data ?? [];

        this.semanasMensajeria.set(semanas);

        const semanaAbierta = semanas.find((semana) => semana.estado === 'ABIERTA');

        if (semanaAbierta?.id) {
          this.semanaSeleccionadaId.set(semanaAbierta.id);
        }
      },

      error: (error) => {
        console.error('Error al obtener las semanas de mensajería:', error);

        this.toast.error(
          error.error?.message || 'No fue posible obtener las semanas de mensajería.',
          3500,
        );
      },
    });
  }

  /**
   * Obtiene todas las mensajerías registradas.
   */
  private obtenerMensajerias(): void {
    this.apiMensajeria.obtenerMensajerias().subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(respuesta.message || 'No fue posible obtener las mensajerías.', 3500);

          return;
        }

        this.mensajerias.set(respuesta.data ?? []);
      },

      error: (error) => {
        console.error('Error al obtener las mensajerías:', error);

        this.toast.error(error.error?.message || 'No fue posible obtener las mensajerías.', 3500);
      },
    });
  }

  // =========================================================================
  // MENSAJEROS
  // =========================================================================

  /**
   * Abre el modal para registrar un nuevo mensajero.
   */
  abrirModalMensajeros(): void {
    this.nuevoMensajero = {
      nombre: '',
      apellido: '',
    };

    this.modalMensajeros = true;
  }

  /**
   * Cierra el modal de registro de mensajeros.
   */
  cerrarModalMensajeros(): void {
    this.modalMensajeros = false;
  }

  /**
   * Registra un nuevo mensajero.
   *
   * @param formulario formulario utilizado para validar los datos.
   */
  registrarMensajero(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }

    const nombre = this.nuevoMensajero.nombre.trim();
    const apellido = this.nuevoMensajero.apellido.trim();

    if (!nombre) {
      this.toast.warning('El nombre del mensajero es obligatorio.', 3500);

      return;
    }

    const mensajero: Mensajeros = {
      nombre,
      apellido,
    };

    this.apiMensajeros.registrarMensajero(mensajero).subscribe({
      next: (respuesta) => {
        if (!respuesta.success || !respuesta.data) {
          this.toast.error(respuesta.message || 'No fue posible registrar el mensajero.', 3500);

          return;
        }

        this.mensajeros.update((mensajeros) => [...mensajeros, respuesta.data!]);

        this.toast.success('Mensajero registrado correctamente.', 3500);

        this.nuevoMensajero = {
          nombre: '',
          apellido: '',
        };

        formulario.resetForm();

        this.cerrarModalMensajeros();
      },

      error: (error) => {
        console.error('Error al registrar el mensajero:', error);

        this.toast.error(error.error?.message || 'No fue posible registrar el mensajero.', 3500);
      },
    });
  }

  /**
   * Obtiene los mensajeros disponibles.
   *
   * @returns lista de mensajeros.
   */
  get mensajerosSemana(): Mensajeros[] {
    return this.mensajeros();
  }

  // =========================================================================
  // SEMANAS DE MENSAJERÍA
  // =========================================================================

  /**
   * Abre el modal para registrar una nueva semana.
   */
  abrirModalNuevaSemana(): void {
    this.nuevaSemana = {
      fecha_inicio: '',
      fecha_fin: '',
    };

    this.modalNuevaSemana = true;
  }

  /**
   * Cierra el modal de registro de semanas.
   */
  cerrarModalNuevaSemana(): void {
    this.modalNuevaSemana = false;
  }

  /**
   * Registra una nueva semana de mensajería.
   *
   * @param formulario formulario utilizado para registrar la semana.
   */
  registrarSemanaMensajeria(formulario: NgForm): void {
    const fechaInicio = this.nuevaSemana.fecha_inicio;
    const fechaFin = this.nuevaSemana.fecha_fin;

    if (!fechaInicio || !fechaFin) {
      this.toast.error('Debes seleccionar las dos fechas.', 3500);

      return;
    }

    if (fechaInicio > fechaFin) {
      this.toast.error('La fecha inicial no puede ser mayor que la fecha final.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // VALIDAR CRUCE DE FECHAS
    // -----------------------------------------------------------------------

    const existeSemanaSolapada = this.semanasMensajeria().some((semana) => {
      return fechaInicio <= semana.fecha_fin && fechaFin >= semana.fecha_inicio;
    });

    if (existeSemanaSolapada) {
      this.toast.warning('El rango seleccionado se cruza con una semana existente.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // REGISTRAR SEMANA
    // -----------------------------------------------------------------------

    const nuevaSemana: SemanasMensajeria = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: 'ABIERTA',
    };

    this.apiSemanasMensajeria.registrarSemanaMensajeria(nuevaSemana).subscribe({
      next: (respuesta) => {
        if (!respuesta.success || !respuesta.data) {
          this.toast.error(respuesta.message || 'No fue posible registrar la semana.', 3500);

          return;
        }

        this.semanasMensajeria.update((semanas) => [...semanas, respuesta.data!]);

        if (respuesta.data.id) {
          this.semanaSeleccionadaId.set(respuesta.data.id);
        }

        this.toast.success('Semana de mensajería registrada correctamente.', 3500);

        this.nuevaSemana = {
          fecha_inicio: '',
          fecha_fin: '',
        };

        formulario.resetForm();

        this.cerrarModalNuevaSemana();
      },

      error: (error) => {
        console.error('Error al registrar la semana:', error);

        this.toast.error(error.error?.message || 'No fue posible registrar la semana.', 3500);
      },
    });
  }

  /**
   * Cambia la semana actualmente seleccionada.
   *
   * @param event evento generado por el elemento select.
   */
  cambiarSemana(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);

    const semana = this.semanasMensajeria().find((item) => item.id === id);

    if (!semana) {
      return;
    }

    this.semanaSeleccionadaId.set(id);

    this.cancelarEdicion();
    this.cancelarEliminar();
  }

  /**
   * Abre el modal para confirmar el cierre de la semana.
   */
  abrirModalCerrarSemana(): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    this.modalCerrarSemana = true;
  }

  /**
   * Cierra el modal de confirmación.
   */
  cerrarModalCerrarSemana(): void {
    this.modalCerrarSemana = false;
  }

  /**
   * Cierra la semana actualmente seleccionada.
   */
  cerrarSemana(): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    if (!semana.id) {
      return;
    }

    this.apiSemanasMensajeria.actualizarEstadoSemana(semana.id, 'CERRADA').subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(respuesta.message || 'No fue posible cerrar la semana.', 3500);

          return;
        }

        this.semanasMensajeria.update((semanas) =>
          semanas.map((item) =>
            item.id === semana.id
              ? {
                  ...item,
                  estado: 'CERRADA',
                }
              : item,
          ),
        );

        // ---------------------------------------------------------------
        // BUSCAR SIGUIENTE SEMANA ABIERTA
        // ---------------------------------------------------------------

        const siguienteSemana = this.semanasMensajeria()
          .filter((item) => item.id !== semana.id)
          .filter((item) => item.estado === 'ABIERTA')
          .filter((item) => item.fecha_inicio > semana.fecha_inicio)
          .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))[0];

        if (siguienteSemana?.id) {
          this.semanaSeleccionadaId.set(siguienteSemana.id);
        } else {
          this.semanaSeleccionadaId.set(semana.id!);
        }

        this.cancelarEdicion();
        this.cancelarEliminar();

        this.modalCerrarSemana = false;

        this.toast.success('Semana cerrada correctamente.', 3500);
      },

      error: (error) => {
        console.error('Error al cerrar la semana:', error);

        this.toast.error(error.error?.message || 'No fue posible cerrar la semana.', 3500);
      },
    });
  }

  // =========================================================================
  // MENSAJERÍAS
  // =========================================================================

  /**
   * Obtiene las mensajerías correspondientes
   * a la semana seleccionada.
   */
  get mensajeriasSemana(): GC_Mensajeria[] {
    const semana = this.semanaActual();

    if (!semana) {
      return [];
    }

    return this.mensajerias().filter(
      (mensajeria) =>
        mensajeria.fecha >= semana.fecha_inicio && mensajeria.fecha <= semana.fecha_fin,
    );
  }

  /**
   * Abre el modal para registrar mensajerías.
   *
   * @param mensajero mensajero seleccionado.
   */
  abrirModalMensajeria(mensajero: Mensajeros): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    this.mensajeroSeleccionado = mensajero;

    this.fechasMensajeria = [
      {
        fecha: '',
        servicios: [
          {
            destino_servicio: '',
            valor: null,
          },
        ],
      },
    ];

    this.modalMensajeria = true;
  }

  /**
   * Cierra el modal de registro de mensajerías.
   */
  cerrarModalMensajeria(): void {
    this.modalMensajeria = false;

    this.mensajeroSeleccionado = null;

    this.fechasMensajeria = [];
  }

  /**
   * Agrega una nueva fecha al formulario.
   */
  agregarFecha(): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    this.fechasMensajeria.push({
      fecha: '',
      servicios: [
        {
          destino_servicio: '',
          valor: null,
        },
      ],
    });
  }

  /**
   * Elimina una fecha del formulario.
   *
   * @param indice índice de la fecha.
   */
  quitarFecha(indice: number): void {
    if (this.fechasMensajeria.length <= 1) {
      return;
    }

    this.fechasMensajeria.splice(indice, 1);
  }

  /**
   * Agrega un nuevo servicio a una fecha.
   *
   * @param indiceFecha índice del grupo de fecha.
   */
  agregarServicio(indiceFecha: number): void {
    const grupoFecha = this.fechasMensajeria[indiceFecha];

    if (!grupoFecha) {
      return;
    }

    grupoFecha.servicios.push({
      destino_servicio: '',
      valor: null,
    });
  }

  /**
   * Elimina un servicio de una fecha.
   *
   * @param indiceFecha índice del grupo de fecha.
   * @param indiceServicio índice del servicio.
   */
  quitarServicio(indiceFecha: number, indiceServicio: number): void {
    const grupoFecha = this.fechasMensajeria[indiceFecha];

    if (!grupoFecha) {
      return;
    }

    if (grupoFecha.servicios.length <= 1) {
      return;
    }

    grupoFecha.servicios.splice(indiceServicio, 1);
  }

  /**
   * Registra todas las mensajerías introducidas
   * en el formulario.
   *
   * @param formulario formulario utilizado para validar
   *                   la información.
   */
  guardarMensajerias(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }

    const mensajero = this.mensajeroSeleccionado;

    const semana = this.semanaActual();

    if (!mensajero || !semana) {
      this.toast.error('Debes seleccionar un mensajero y una semana.', 3500);

      return;
    }

    if (!mensajero.id || !semana.id) {
      this.toast.error('No fue posible identificar el mensajero o la semana.', 3500);

      return;
    }

    const mensajerias: GC_Mensajeria[] = [];

    // -----------------------------------------------------------------------
    // CONSTRUIR MENSAJERÍAS
    // -----------------------------------------------------------------------

    for (const grupo of this.fechasMensajeria) {
      if (!grupo.fecha || grupo.fecha < semana.fecha_inicio || grupo.fecha > semana.fecha_fin) {
        this.toast.warning('Todas las fechas deben estar dentro de la semana seleccionada.', 3500);

        return;
      }

      if (grupo.servicios.length === 0) {
        this.toast.warning('Cada fecha debe tener al menos un servicio.', 3500);

        return;
      }

      for (const servicio of grupo.servicios) {
        const destino = servicio.destino_servicio.trim();

        if (!destino) {
          this.toast.warning('El destino del servicio no puede estar vacío.', 3500);

          return;
        }

        const valor =
          servicio.valor === null || servicio.valor === undefined || servicio.valor === 0
            ? null
            : Number(servicio.valor);

        if (valor !== null && (Number.isNaN(valor) || valor < 0)) {
          this.toast.warning('El valor del servicio debe ser válido.', 3500);

          return;
        }

        mensajerias.push({
          fecha: grupo.fecha,
          destino_servicio: destino,
          valor,
          mensajeros_id: mensajero.id,
          semanas_mensajeria_id: semana.id,
        });
      }
    }

    if (mensajerias.length === 0) {
      this.toast.warning('Debes registrar al menos una mensajería.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // REGISTRAR MENSAJERÍAS
    // -----------------------------------------------------------------------

    this.apiMensajeria.registrarMensajerias(mensajerias).subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(respuesta.message || 'No fue posible registrar las mensajerías.', 3500);

          return;
        }

        this.mensajerias.update((mensajeriasActuales) => [
          ...mensajeriasActuales,
          ...(respuesta.data ?? []),
        ]);

        this.toast.success('Mensajerías registradas correctamente.', 3500);

        formulario.resetForm();

        this.cerrarModalMensajeria();
      },

      error: (error) => {
        console.error('Error al registrar las mensajerías:', error);

        this.toast.error(error.error?.message || 'No fue posible registrar las mensajerías.', 3500);
      },
    });
  }

  // =========================================================================
  // EDITAR MENSAJERÍA
  // =========================================================================

  /**
   * Inicia la edición de una mensajería.
   *
   * @param mensajeria mensajería que será editada.
   */
  editarMensajeria(mensajeria: GC_Mensajeria): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    if (!mensajeria.id) {
      return;
    }

    this.mensajeriaEditando = mensajeria.id;

    this.mensajeriaEditada = {
      ...mensajeria,
    };
  }

  /**
   * Actualiza la mensajería actualmente seleccionada.
   *
   * @param formulario formulario utilizado para validar
   *                   los datos de edición.
   */
  actualizarMensajeria(formulario: NgForm): void {
    if (formulario.invalid) {
      return;
    }

    if (!this.mensajeriaEditada || this.mensajeriaEditando === null) {
      return;
    }

    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    // -----------------------------------------------------------------------
    // VALIDAR DESTINO
    // -----------------------------------------------------------------------

    const destino = this.mensajeriaEditada.destino_servicio.trim();

    if (!destino) {
      this.toast.warning('El destino del servicio no puede estar vacío.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // VALIDAR FECHA
    // -----------------------------------------------------------------------

    if (
      !this.mensajeriaEditada.fecha ||
      this.mensajeriaEditada.fecha < semana.fecha_inicio ||
      this.mensajeriaEditada.fecha > semana.fecha_fin
    ) {
      this.toast.warning('La fecha debe estar dentro de la semana seleccionada.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // VALIDAR VALOR
    // -----------------------------------------------------------------------

    const valor =
      this.mensajeriaEditada.valor === null ||
      this.mensajeriaEditada.valor === undefined ||
      this.mensajeriaEditada.valor === 0
        ? null
        : Number(this.mensajeriaEditada.valor);

    if (valor !== null && (Number.isNaN(valor) || valor < 0)) {
      this.toast.warning('El valor de la mensajería debe ser válido.', 3500);

      return;
    }

    // -----------------------------------------------------------------------
    // ACTUALIZAR
    // -----------------------------------------------------------------------

    this.apiMensajeria
      .actualizarMensajeria(this.mensajeriaEditando, this.mensajeriaEditada.fecha, destino, valor)
      .subscribe({
        next: (respuesta) => {
          if (!respuesta.success || !respuesta.data) {
            this.toast.error(respuesta.message || 'No fue posible actualizar la mensajería.', 3500);

            return;
          }

          this.mensajerias.update((mensajerias) =>
            mensajerias.map((mensajeria) => {
              if (mensajeria.id !== this.mensajeriaEditando) {
                return mensajeria;
              }

              return {
                ...mensajeria,
                fecha: respuesta.data!.fecha,
                destino_servicio: respuesta.data!.destino_servicio,
                valor: respuesta.data!.valor,
              };
            }),
          );

          this.toast.success('Mensajería actualizada correctamente.', 3500);

          formulario.resetForm();

          this.cancelarEdicion();
        },

        error: (error) => {
          console.error('Error al actualizar la mensajería:', error);

          this.toast.error(
            error.error?.message || 'No fue posible actualizar la mensajería.',
            3500,
          );
        },
      });
  }

  /**
   * Cancela la edición de una mensajería.
   */
  cancelarEdicion(): void {
    this.mensajeriaEditando = null;
    this.mensajeriaEditada = null;
  }

  // =========================================================================
  // ELIMINAR MENSAJERÍA
  // =========================================================================

  /**
   * Solicita confirmación para eliminar una mensajería.
   *
   * @param mensajeria mensajería que se desea eliminar.
   */
  confirmarEliminar(mensajeria: GC_Mensajeria): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    if (!mensajeria.id) {
      return;
    }

    this.mensajeriaEliminando = mensajeria.id;
  }

  /**
   * Cancela la eliminación pendiente.
   */
  cancelarEliminar(): void {
    this.mensajeriaEliminando = null;
  }

  /**
   * Elimina una mensajería.
   *
   * @param mensajeria mensajería que será eliminada.
   */
  eliminarMensajeria(mensajeria: GC_Mensajeria): void {
    const semana = this.semanaActual();

    if (!semana || semana.estado === 'CERRADA') {
      return;
    }

    if (!mensajeria.id) {
      return;
    }

    this.apiMensajeria.eliminarMensajeria(mensajeria.id).subscribe({
      next: (respuesta) => {
        if (!respuesta.success) {
          this.toast.error(respuesta.message || 'No fue posible eliminar la mensajería.', 3500);

          return;
        }

        this.mensajerias.set(this.mensajerias().filter((item) => item.id !== mensajeria.id));

        this.toast.success(respuesta.message || 'Mensajería eliminada correctamente.', 3500);

        this.cancelarEliminar();
      },

      error: (error) => {
        console.error('Error al eliminar la mensajería:', error);

        this.toast.error(error.error?.message || 'No fue posible eliminar la mensajería.', 3500);

        this.cancelarEliminar();
      },
    });
  }

  // =========================================================================
  // AGRUPACIÓN Y TOTALES
  // =========================================================================

  /**
   * Agrupa las mensajerías de un mensajero por fecha.
   *
   * @param mensajero mensajero cuyas mensajerías serán agrupadas.
   * @returns lista de grupos ordenados por fecha.
   */
  agruparPorFecha(mensajero: Mensajeros): {
    fecha: string;
    servicios: GC_Mensajeria[];
  }[] {
    const servicios = this.mensajeriasSemana.filter(
      (mensajeria) => mensajeria.mensajeros_id === mensajero.id,
    );

    const grupos = new Map<string, GC_Mensajeria[]>();

    for (const servicio of servicios) {
      if (!grupos.has(servicio.fecha)) {
        grupos.set(servicio.fecha, []);
      }

      grupos.get(servicio.fecha)!.push(servicio);
    }

    return Array.from(grupos.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fecha, servicios]) => ({
        fecha,
        servicios,
      }));
  }

  /**
   * Obtiene la cantidad total de servicios
   * de la semana seleccionada.
   *
   * @returns cantidad total de servicios.
   */
  totalServicios(): number {
    return this.mensajeriasSemana.length;
  }

  /**
   * Calcula el valor total de las mensajerías
   * de la semana seleccionada.
   *
   * @returns valor total de la semana.
   */
  totalSemana(): number {
    return this.mensajeriasSemana.reduce((total, mensajeria) => total + (mensajeria.valor ?? 0), 0);
  }

  /**
   * Calcula el valor total de las mensajerías
   * realizadas por un mensajero.
   *
   * @param mensajero mensajero cuyo total será calculado.
   * @returns valor total correspondiente al mensajero.
   */
  totalMensajeros(mensajero: Mensajeros): number {
    return this.mensajeriasSemana
      .filter((mensajeria) => mensajeria.mensajeros_id === mensajero.id)
      .reduce((total, mensajeria) => total + (mensajeria.valor ?? 0), 0);
  }
}
