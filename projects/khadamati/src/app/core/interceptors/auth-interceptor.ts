// @ts-ignore
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AuthFacade} from '../services/auth-facade';
import {Router} from '@angular/router';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';


@Injectable({ providedIn: 'root'})
export class RefreshStateService {
  isRefreshing = false;
  tokenSubject = new BehaviorSubject<string | null>(null);
}



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const refreshState = inject(RefreshStateService)



  const token= auth.getAccessToken();
  const authReq = token
    ? req.clone({ withCredentials: true , setHeaders: { Authorization: `Bearer ${token}`}})
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handle401(req, next, auth, router, refreshState);
      }
      return throwError(() => err);
    })
  );

};

function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  auth: AuthFacade,
  router: Router,
  refreshState: RefreshStateService
): Observable<HttpEvent<any>> {
  if (!refreshState.isRefreshing) {
    refreshState.isRefreshing = true;
    refreshState.tokenSubject.next(null);

    return auth.refresh().pipe(
      switchMap(() => {
        refreshState.isRefreshing = false;
        const newToken = auth.getAccessToken()!;
        refreshState.tokenSubject.next(newToken);
        return next(req.clone({
          withCredentials: true,
          setHeaders: { Authorization: `Bearer ${newToken}` }
        }));
      }),
      catchError(() => {
        refreshState.isRefreshing = false;
        auth.logout().subscribe();
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  return refreshState.tokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token =>
      next(req.clone({
        withCredentials: true,
        setHeaders: { Authorization: `Bearer ${token!}` }
      }))
    )
  );
}
