import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = this.auth.getToken();
    // debug: log token presence (will appear in browser console)
    console.debug('AuthInterceptor token (raw):', token);
    if (token) {
      // sanitize token: remove surrounding quotes and any leading 'Bearer ' prefix
      token = String(token)
        .replace(/^\"|\"$/g, '')
        .replace(/^Bearer\s+/i, '')
        .trim();
      console.debug('AuthInterceptor token (sanitized):', token);
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
