import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this._authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${user._accessToken}` },
        });
        return next.handle(modifiedReq);
      }),
      catchError((err) => {
        if ([401, 403].includes(err.status) && this._authService.user) {
          // auto logout if 401 or 403 response returned from api
          this._authService.signOut();
        }
        // const error = (err && err.error && err.error.detail) || err.statusText;
        return throwError(err);
      })
    );
  }
}
