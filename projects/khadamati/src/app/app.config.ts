import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import {Configuration} from '@api/configuration';
import {authInterceptor} from '@core/interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])  // functional style only
    ),
    {
      provide: Configuration,
      useFactory: () => new Configuration({
        basePath: 'http://localhost:8080',
        withCredentials: true
      })
    }
  ]
};
