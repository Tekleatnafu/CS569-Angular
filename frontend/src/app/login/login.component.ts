import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <div class="row mt-3">
              <div class="col-12">
                <h3>Authorize yourself</h3>
              </div>
              <div class="col-12 mt-3">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="mb-3 row">
                    <label for="email" class="col-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                      <input id="email" type="email" class="form-control" formControlName="email" />
                      <div *ngIf="email.invalid && (email.dirty || email.touched)">
                        <div id="reqEmail" *ngIf="email.errors?.['required']">
                          Email is required
                        </div>
                        <div *ngIf="email.errors?.['email']">Invalid Email Format</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="password" class="col-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                      <input id="password" type="password" class="form-control" formControlName="password" />
                      <div *ngIf="password.invalid && (password.dirty || password.touched)">
                        <div id="reqPw" *ngIf="password.errors?.['required']">
                          Password is required
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="btn btn-primary mt-3" type="submit">Login</button> &nbsp;
                </form>
              </div>
          </div>
          </div>
          <div class="col-6">
            <img src="/assets/goal-tracker.png" alt="Goal tracker" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      #reqEmail {
        color: red;
      }

      #reqPw {
        color: red;
      }

      img {
        width: 100%;
      }
    `
  ]
})
export class LoginComponent {
  form = inject(FormBuilder).nonNullable.group({
    email: ['user1@tracker.com', [Validators.required, Validators.email]],
    password: ['User@123456', [Validators.required]]
  });

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: LoginService,
    private authService: AuthService) {
  }

  onSubmit() {
    this.userService
      .login(this.form.value as { email: string; password: string })
      .subscribe((response) => {
        if (response.success) {
          this.authService.setToken(response.data);
        }
      });
  }
}
