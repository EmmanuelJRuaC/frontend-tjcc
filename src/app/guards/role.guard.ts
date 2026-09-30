import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/usuarios/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  const tieneRol = rolesPermitidos.some((role) => authService.tieneRol(role));

  if (tieneRol) {
    return true;
  }

  return router.createUrlTree(['/no-autorizado']);
};
