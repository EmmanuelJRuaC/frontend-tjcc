import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiGastos } from '../../../services/cecilia/gastos/api/api-gastos';
import { AnioGastos, MesGastos, Gasto } from '../../../models/cecilia/Gastos';

import { Formatear, Validaciones } from '../../../hooks/utils';
import { ToastService } from '../../../hooks/toastservice';
import { Toast } from '../../../hooks/toast/toast';

/**
 * Componente encargado de gestionar los gastos de Cecilia.
 *
 * Permite consultar, visualizar, registrar, actualizar y eliminar gastos.
 * Los gastos se muestran agrupados por año y mes mediante un acordeón.
 *
 * También administra los indicadores generales de gastos y proporciona
 * retroalimentación al usuario mediante mensajes Toast.
 */
@Component({
  selector: 'app-gastos',
  imports: [FormsModule, Toast],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css',
})
export class Gastos implements OnInit {
  // ---------------------------------------------------------------------------
  // VARIABLES
  // ---------------------------------------------------------------------------

  /**
   * Información de gastos agrupada por año y mes.
   */
  public planillaGastos = signal<AnioGastos[]>([]);

  /**
   * Instancia utilizada para formatear fechas y valores monetarios.
   */
  public formatear = new Formatear();

  /**
   * Instancia utilizada para realizar validaciones de campos.
   */
  public validaciones = new Validaciones();

  /**
   * Controla la visibilidad del modal de creación de gastos.
   */
  public modalAbierto = false;

  /**
   * Lista temporal de gastos que se están registrando.
   *
   * Permite registrar varios gastos desde el mismo formulario.
   */
  public gastos: Gasto[] = [
    {
      fecha: '',
      nombre_servicio: '',
      valor: null,
    },
  ];

  // ---------------------------------------------------------------------------
  // ACORDEÓN
  // ---------------------------------------------------------------------------

  /**
   * Contiene los años que actualmente se encuentran abiertos
   * en el acordeón.
   */
  private aniosAbiertos = new Set<number>();

  /**
   * Contiene los meses que actualmente se encuentran abiertos
   * en el acordeón.
   *
   * <p>
   * La clave utilizada tiene el formato:
   * {@code año-mes}.
   */
  private mesesAbiertos = new Set<string>();

  // ---------------------------------------------------------------------------
  // EDICIÓN
  // ---------------------------------------------------------------------------

  /**
   * Identificador del gasto que actualmente se está editando.
   *
   * <p>
   * Si su valor es {@code null}, no existe ningún gasto en edición.
   */
  public gastoEditandoId: number | null = null;

  /**
   * Copia temporal del gasto que está siendo editado.
   */
  public gastoEditando: Gasto | null = null;

  // ---------------------------------------------------------------------------
  // CONSTRUCTOR
  // ---------------------------------------------------------------------------

  /**
   * Inicializa las dependencias necesarias para gestionar los gastos.
   *
   * @param apiGastos servicio encargado de comunicarse con la API de gastos
   * @param toast servicio encargado de mostrar mensajes al usuario
   */
  constructor(
    private apiGastos: ApiGastos,
    public toast: ToastService,
  ) {}

  // ---------------------------------------------------------------------------
  // CICLO DE VIDA
  // ---------------------------------------------------------------------------

  /**
   * Inicializa el componente y obtiene los gastos registrados.
   */
  ngOnInit(): void {
    this.obtenerGastos();
  }

  // ---------------------------------------------------------------------------
  // GASTOS
  // ---------------------------------------------------------------------------

  /**
   * Obtiene los gastos registrados desde la API.
   *
   * <p>
   * En caso de éxito, la información recibida se almacena en
   * {@link planillaGastos}.
   *
   * <p>
   * Si ocurre un error de comunicación con el servidor, se muestra
   * un mensaje de error al usuario.
   */
  private obtenerGastos(): void {
    this.apiGastos.obtenerGastos().subscribe({
      next: (res) => {
        if (!res.success) {
          this.toast.error(res.message, 3500);
          return;
        }

        this.planillaGastos.set(res.data);
      },

      error: (error) => {
        console.error('Error obteniendo gastos:', error);

        this.toast.error('No fue posible cargar los gastos. Intenta nuevamente.', 3500);
      },
    });
  }

  // ---------------------------------------------------------------------------
  // ACORDEÓN
  // ---------------------------------------------------------------------------

  /**
   * Abre o cierra un año dentro del acordeón.
   *
   * @param anio año que se desea abrir o cerrar
   */
  public toggleAnio(anio: number): void {
    if (this.aniosAbiertos.has(anio)) {
      this.aniosAbiertos.delete(anio);
    } else {
      this.aniosAbiertos.add(anio);
    }
  }

  /**
   * Abre o cierra un mes dentro del acordeón.
   *
   * @param anio año al que pertenece el mes
   * @param mes nombre del mes
   */
  public toggleMes(anio: number, mes: string): void {
    const key = `${anio}-${mes}`;

    if (this.mesesAbiertos.has(key)) {
      this.mesesAbiertos.delete(key);
    } else {
      this.mesesAbiertos.add(key);
    }
  }

  /**
   * Determina si un año se encuentra abierto.
   *
   * @param anio año que se desea consultar
   * @returns {@code true} si el año está abierto; {@code false} en caso contrario
   */
  public anioAbierto(anio: number): boolean {
    return this.aniosAbiertos.has(anio);
  }

  /**
   * Determina si un mes se encuentra abierto.
   *
   * @param anio año al que pertenece el mes
   * @param mes nombre del mes
   * @returns {@code true} si el mes está abierto; {@code false} en caso contrario
   */
  public mesAbierto(anio: number, mes: string): boolean {
    return this.mesesAbiertos.has(`${anio}-${mes}`);
  }

  // ---------------------------------------------------------------------------
  // INDICADORES
  // ---------------------------------------------------------------------------

  /**
   * Calcula el total de gastos correspondientes a un mes.
   *
   * @param mes información del mes cuyos gastos se desean sumar
   * @returns valor total de los gastos del mes
   */
  public totalMes(mes: MesGastos): number {
    return mes.gastos.reduce((total, gasto) => total + (gasto.valor ?? 0), 0);
  }

  /**
   * Calcula el total de gastos correspondientes a un año.
   *
   * @param anio información del año cuyos gastos se desean sumar
   * @returns valor total de los gastos del año
   */
  public totalAnio(anio: AnioGastos): number {
    return anio.meses.reduce((total, mes) => total + this.totalMes(mes), 0);
  }

  /**
   * Calcula el total general de todos los gastos registrados.
   *
   * @returns valor total de todos los gastos
   */
  public totalGeneral(): number {
    return this.planillaGastos().reduce((total, anio) => total + this.totalAnio(anio), 0);
  }

  /**
   * Calcula el promedio mensual de gastos.
   *
   * <p>
   * El cálculo considera únicamente los meses que existen
   * dentro de la información obtenida.
   *
   * @returns promedio mensual de gastos
   */
  public promedioMensual(): number {
    const datos = this.planillaGastos();

    let total = 0;
    let cantidadMeses = 0;

    for (const anio of datos) {
      for (const mes of anio.meses) {
        total += this.totalMes(mes);
        cantidadMeses++;
      }
    }

    return cantidadMeses > 0 ? total / cantidadMeses : 0;
  }

  /**
   * Obtiene el último año disponible en la información de gastos.
   *
   * @returns último año registrado o {@code undefined} si no existen datos
   */
  public ultimoAnio(): AnioGastos | undefined {
    const datos = this.planillaGastos();

    return datos.length > 0 ? datos[datos.length - 1] : undefined;
  }

  // ---------------------------------------------------------------------------
  // MODAL DE CREACIÓN
  // ---------------------------------------------------------------------------

  /**
   * Cierra el modal de creación de gastos.
   *
   * <p>
   * También restablece el formulario para que pueda utilizarse
   * nuevamente desde cero.
   */
  public cerrarModal(): void {
    this.modalAbierto = false;

    this.gastos = [
      {
        fecha: '',
        nombre_servicio: '',
        valor: null,
      },
    ];
  }

  /**
   * Agrega una nueva fila al formulario de creación de gastos.
   */
  public agregarGastos(): void {
    this.gastos.push({
      fecha: '',
      nombre_servicio: '',
      valor: 0,
    });
  }

  /**
   * Elimina una fila del formulario de creación.
   *
   * <p>
   * Siempre se conserva como mínimo una fila disponible.
   *
   * @param index posición de la fila que se desea eliminar
   */
  public quitarGastos(index: number): void {
    if (this.gastos.length > 1) {
      this.gastos.splice(index, 1);
    }
  }

  /**
   * Registra los gastos ingresados en el formulario.
   *
   * <p>
   * Antes de enviarlos a la API se verifica que el formulario
   * sea válido y se normalizan los valores nulos a {@code 0}.
   *
   * @param form formulario utilizado para registrar los gastos
   */
  public registrarGastos(form: any): void {
    if (form.invalid) {
      this.toast.warning('Completa correctamente los campos obligatorios.', 3500);
      return;
    }

    const gastosParaGuardar = this.gastos.map((gasto) => ({
      ...gasto,
      valor: gasto.valor ?? 0,
    }));

    this.apiGastos.registrarGastos(gastosParaGuardar).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toast.error(res.message, 3500);
          return;
        }

        this.toast.success(res.message, 3500);

        this.cerrarModal();
        this.obtenerGastos();
      },

      error: (error) => {
        console.error('Error registrando gastos:', error);

        this.toast.error('No fue posible registrar los gastos. Intenta nuevamente.', 3500);
      },
    });
  }

  // ---------------------------------------------------------------------------
  // EDICIÓN
  // ---------------------------------------------------------------------------

  /**
   * Activa el modo de edición para un gasto.
   *
   * <p>
   * Se crea una copia del gasto para evitar modificar directamente
   * la información mostrada mientras el usuario está editando.
   *
   * @param gasto gasto que se desea editar
   */
  public editarGastos(gasto: Gasto): void {
    if (gasto.id === undefined) {
      this.toast.error('No se puede editar un gasto que no tiene identificador.', 3500);
      return;
    }

    this.gastoEditandoId = gasto.id;

    this.gastoEditando = {
      ...gasto,
    };
  }

  /**
   * Actualiza el gasto actualmente seleccionado.
   *
   * <p>
   * Si la operación es exitosa, se muestra un mensaje de confirmación
   * y se actualiza la información mostrada.
   */
  public actualizarGasto(): void {
    if (!this.gastoEditando?.id) {
      this.toast.warning('No hay ningún gasto seleccionado para actualizar.', 3500);
      return;
    }

    const id = this.gastoEditando.id;

    this.apiGastos.actualizarGasto(id, this.gastoEditando).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toast.error(res.message, 3500);
          return;
        }

        this.toast.success(res.message, 3500);

        this.cancelarEdicion();
        this.obtenerGastos();
      },

      error: (error) => {
        console.error('Error actualizando gasto:', error);

        this.toast.error('No fue posible actualizar el gasto. Intenta nuevamente.', 3500);
      },
    });
  }

  /**
   * Cancela el modo de edición del gasto actual.
   *
   * <p>
   * Limpia tanto el identificador como la copia temporal
   * del gasto que se estaba modificando.
   */
  public cancelarEdicion(): void {
    this.gastoEditandoId = null;
    this.gastoEditando = null;
  }

  // ---------------------------------------------------------------------------
  // ELIMINACIÓN
  // ---------------------------------------------------------------------------

  /**
   * Elimina un gasto mediante su identificador.
   *
   * @param id identificador del gasto que se desea eliminar
   */
  public eliminarGasto(id: number): void {
    if (!id) {
      this.toast.error('No se pudo identificar el gasto que deseas eliminar.', 3500);
      return;
    }

    this.apiGastos.eliminarGasto(id).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toast.error(res.message, 3500);
          return;
        }

        this.toast.success(res.message, 3500);

        this.obtenerGastos();
      },

      error: (error) => {
        console.error('Error eliminando gasto:', error);

        this.toast.error('No fue posible eliminar el gasto. Intenta nuevamente.', 3500);
      },
    });
  }
}
