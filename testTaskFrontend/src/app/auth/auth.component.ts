import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm;
  error;
  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  formSubmit() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value)
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this._authService.signIn(email, password).subscribe(
        (res) => {
          this.router.navigate(['']);
        },
        (err) => {
          this.error = err;
        }
      );
    } else {
      this.error = 'Please Make sure password is valid';
    }
  }
}
