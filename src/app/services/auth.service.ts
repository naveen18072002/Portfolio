import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'admin_portfolio_auth';
  private readonly TOKEN_KEY = 'admin_jwt_token';
  private readonly API_URL = `${environment.apiUrl}/auth`;

  readonly isLoggedIn = signal<boolean>(this.checkInitialAuth());
  readonly jwtToken = signal<string | null>(this.getStoredToken());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  private checkInitialAuth(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(this.AUTH_KEY) === 'true' || !!localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      return false;
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Authenticates against Spring Boot Backend JWT API
   */
  loginApi(username: string, password: string): Observable<ApiResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { username, password }).pipe(
      map(res => {
        if (res && res.token) {
          this.saveSession(res.token);
          return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid server response' };
      }),
      catchError(err => {
        const errorMsg = err.error?.message || 'Authentication failed. Please check credentials.';
        return of({ success: false, message: errorMsg });
      })
    );
  }

  sendOtp(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/send-otp`, { email }).pipe(
      catchError(err => {
        const errorMsg = err.error?.message || 'Could not send OTP code. Please try again.';
        return of({ success: false, message: errorMsg });
      })
    );
  }

  verifyOtp(email: string, otpCode: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/verify-otp`, { email, otpCode }).pipe(
      catchError(err => {
        const errorMsg = err.error?.message || 'Invalid OTP verification code.';
        return of({ success: false, message: errorMsg });
      })
    );
  }

  resetPassword(email: string, otpCode: string, newPassword: string, confirmPassword: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/reset-password`, { email, otpCode, newPassword, confirmPassword }).pipe(
      catchError(err => {
        const errorMsg = err.error?.message || 'Password reset failed.';
        return of({ success: false, message: errorMsg });
      })
    );
  }

  private saveSession(token: string): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(this.AUTH_KEY, 'true');
        localStorage.setItem(this.TOKEN_KEY, token);
      } catch (e) {}
    }
    this.jwtToken.set(token);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(this.AUTH_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      } catch (e) {}
    }
    this.jwtToken.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    return this.jwtToken();
  }
}
