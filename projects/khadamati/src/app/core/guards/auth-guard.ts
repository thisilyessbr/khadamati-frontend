import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {catchError, map, of} from 'rxjs';
import {AuthFacade} from '@core/services/auth-facade';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if(auth.getAccessToken()){
    return true;
  }

  return auth.refresh().pipe(
    map(() =>true),
    catchError(() => {
      router.navigate(['/auth/login'])
      return of(false);
    })
  )
};
