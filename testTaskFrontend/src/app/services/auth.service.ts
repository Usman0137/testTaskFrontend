import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { baseUrl } from 'src/environments/environment';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../appModels/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  // private refreshTokenTimeout: any;

  constructor(private _http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  signIn(email: string, password: string) {
    return this._http.post<any>(`${baseUrl}login/`, { email, password }).pipe(
      tap((res) => {
        this.authenticatedUser(
          res.id,
          res.email,
          res.access_token,
          res.refresh_token
        );
      })
    );
  }

  autoSignIn() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const loggedInUser = new User(
        userData.id,
        userData.email,
        userData._accessToken,
        userData._refreshToken,
        userData._tokenExpirationDate
      );
      if (new Date(userData._tokenExpirationDate) < new Date()) {
        console.log('token expired');
      } else {
        this.user.next(loggedInUser);
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoSignOut(expirationDuration);
      }
    } else {
      return;
    }
  }

  signOut() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoSignOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }

  private authenticatedUser(id, email, accessToken, refreshToken) {
    const token_parts = accessToken.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    const expirationDate = new Date(token_decoded.exp * 1000);
    const user = new User(id, email, accessToken, refreshToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
    this.autoSignOut(token_decoded.exp);
  }
}
