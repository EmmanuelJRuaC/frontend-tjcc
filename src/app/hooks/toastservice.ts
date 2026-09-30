import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'error' | 'success' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  visible = signal(false);
  saliendo = signal(false);
  mensaje = signal('');
  tipo = signal<ToastTipo>('error');
  duracion = signal(3500);
  id = signal(0);

  private readonly DURACION_SALIDA = 350;

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private salidaId: ReturnType<typeof setTimeout> | null = null;
  private inicio = 0;
  private restante = 0;

  mostrarToast(mensaje: string, tipo: ToastTipo = 'error', duracion: number = 3500): void {
    this.limpiarTemporizadores();

    this.mensaje.set(mensaje);
    this.tipo.set(tipo);
    this.duracion.set(duracion);
    this.saliendo.set(false);
    this.id.update((v) => v + 1);
    this.visible.set(true);

    this.programarCierre(duracion);
  }

  pausar(): void {
    if (this.timeoutId === null) return;

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.restante -= Date.now() - this.inicio;
  }

  reanudar(): void {
    if (!this.visible() || this.saliendo() || this.timeoutId !== null) return;

    this.programarCierre(Math.max(this.restante, 400));
  }

  cerrarToast(): void {
    if (!this.visible() || this.saliendo()) return;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.saliendo.set(true);

    this.salidaId = setTimeout(() => {
      this.visible.set(false);
      this.saliendo.set(false);
      this.salidaId = null;
    }, this.DURACION_SALIDA);
  }

  error(mensaje: string, duracion: number = 3500): void {
    this.mostrarToast(mensaje, 'error', duracion);
  }

  success(mensaje: string, duracion: number = 3500): void {
    this.mostrarToast(mensaje, 'success', duracion);
  }

  warning(mensaje: string, duracion: number = 3500): void {
    this.mostrarToast(mensaje, 'warning', duracion);
  }

  info(mensaje: string, duracion: number = 3500): void {
    this.mostrarToast(mensaje, 'info', duracion);
  }

  private programarCierre(ms: number): void {
    this.restante = ms;
    this.inicio = Date.now();
    this.timeoutId = setTimeout(() => this.cerrarToast(), ms);
  }

  private limpiarTemporizadores(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.salidaId !== null) {
      clearTimeout(this.salidaId);
      this.salidaId = null;
    }
  }
}
