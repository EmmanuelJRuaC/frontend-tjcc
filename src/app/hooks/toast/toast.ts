import { Component, inject } from '@angular/core';
import { ToastService } from '../toastservice';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  cerrar(): void {
    this.toastService.cerrarToast();
  }
}
