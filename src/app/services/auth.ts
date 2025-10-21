import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  public isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          const raw =
            (res as any)?.access_token ??
            (res as any)?.token ??
            (res as any)?.accessToken ??
            (res as any)?.data?.access_token;
          if (raw) {          
            const token = String(raw)
              .replace(/^\"|\"$/g, '')
              .replace(/^Bearer\s+/i, '')
              .trim();
            localStorage.setItem('token', token);
            this.isLoggedIn.set(true);
          } else {
            console.error('AuthService.login: no token found in response', res);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isLogged(): boolean {
    return this.isLoggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }
}
