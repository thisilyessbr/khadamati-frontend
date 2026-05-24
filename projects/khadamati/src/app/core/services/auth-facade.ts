import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthControllerService } from '@api/api/authController.service';
import { LoginRequestDTO } from '@api/model/loginRequestDTO';
import { LoginResponseDTO } from '@api/model/loginResponseDTO';
import { RegisterRequestDTO } from '@api/model/registerRequestDTO';
import { RegisterResponseDTO } from '@api/model/registerResponseDTO';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  constructor(
    private authService: AuthControllerService,
    private router: Router
  ) {}

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  login(credentials: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.authService.login(credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken!);
        this.router.navigate(['/']);
      })
    );
  }

  registerClient(request: RegisterRequestDTO): Observable<RegisterResponseDTO> {
    return this.authService.registerClient(request);
  }

  registerWorker(
    data: string,
    diplomaFiles?: Array<Blob>,
    certificateFiles?: Array<Blob>
  ): Observable<RegisterResponseDTO> {
    return this.authService.registerWorker(data, diplomaFiles, certificateFiles);
  }

  logout(): Observable<void> {
    return this.authService.logout().pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      })
    );
  }

  refresh(): Observable<LoginResponseDTO> {
    return this.authService.refresh().pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken!);
      })
    );
  }
}
