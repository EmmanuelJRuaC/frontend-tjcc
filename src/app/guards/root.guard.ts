import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/usuarios/auth';

export const rootGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return router.createUrlTree(['/tabla']);
  }

  return router.createUrlTree(['/login']);
};
