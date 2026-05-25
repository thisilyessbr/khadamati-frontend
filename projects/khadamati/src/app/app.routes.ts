import { Routes } from '@angular/router';
import {Login} from '@features/auth/pages/login/login';
import {ServiceBrowse} from './shared/components/service-browse/service-browse';
import {authGuard} from '@core/guards/auth-guard';


export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'services',
    component: ServiceBrowse ,
    canActivate: [authGuard]
  },
  { path: '',      redirectTo: 'login', pathMatch: 'full' },
  { path: '**',    redirectTo: 'login' }
];
