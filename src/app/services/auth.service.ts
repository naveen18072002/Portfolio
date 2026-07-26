import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'admin_portfolio_auth';
  readonly isLoggedIn = signal<boolean>(this.checkInitialAuth());

  constructor(private router: Router) {}

  private checkInitialAuth(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(this.AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    // Default admin credentials: username: admin, password: admin or admin123
    const validUsername = 'admin';
    const validPasswords = ['Admin@123'];

    if (username.trim().toLowerCase() === validUsername && validPasswords.includes(password.trim())) {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(this.AUTH_KEY, 'true');
        } catch (e) {}
      }
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(this.AUTH_KEY);
      } catch (e) {}
    }
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
