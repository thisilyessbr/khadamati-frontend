import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthFacade} from '@core/services/auth-facade';

import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle,
    MatFormField, MatLabel, MatError, MatPrefix, MatSuffix,
    MatInput,
    MatButton, MatIconButton,
    MatIcon,
    MatProgressSpinner,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  loading      = false;
  errorMsg     = '';
  hidePassword = true;

  constructor(private auth: AuthFacade, private router: Router) {}

  get username() { return this.form.get('username')!; }
  get password() { return this.form.get('password')!; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';
    const { username, password } = this.form.getRawValue();
    this.auth.login({ username: username!, password: password! }).subscribe({
      next:  ()  => this.router.navigate(['/services']),
      error: err => {
        this.errorMsg = err.error?.message ?? 'Invalid credentials';
        this.loading  = false;
      }
    });
  }
}
