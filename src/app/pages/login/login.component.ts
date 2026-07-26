import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Login form state
  username = '';
  password = '';
  showPassword = signal(false);
  errorMessage = signal('');
  isSubmitting = signal(false);

  // Forgot Password state
  isForgotPassword = signal(false);
  forgotStep = signal<'email' | 'otp' | 'reset'>('email');
  resetEmail = '';
  otpInput = '';
  generatedOtp = '';
  newPassword = '';
  confirmPassword = '';
  forgotError = signal('');
  forgotSuccess = signal('');
  isSendingOtp = signal(false);
  isVerifyingOtp = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  openForgotPassword(): void {
    this.isForgotPassword.set(true);
    this.forgotStep.set('email');
    this.resetEmail = '';
    this.otpInput = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.forgotError.set('');
    this.forgotSuccess.set('');
  }

  backToLogin(): void {
    this.isForgotPassword.set(false);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      this.isSubmitting.set(false);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Invalid credentials. Use admin / admin123');
      }
    }, 400);
  }

  sendOtp(): void {
    this.forgotError.set('');
    this.forgotSuccess.set('');

    if (!this.resetEmail.trim() || !this.resetEmail.includes('@')) {
      this.forgotError.set('Please enter a valid email address.');
      return;
    }

    this.isSendingOtp.set(true);

    setTimeout(() => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      this.generatedOtp = randomOtp;
      this.isSendingOtp.set(false);
      this.forgotStep.set('otp');
      this.forgotSuccess.set(`OTP sent successfully to ${this.resetEmail}! Demo OTP code is: ${randomOtp}`);
    }, 600);
  }

  verifyOtp(): void {
    this.forgotError.set('');
    this.forgotSuccess.set('');

    if (!this.otpInput.trim()) {
      this.forgotError.set('Please enter the 6-digit OTP code.');
      return;
    }

    if (this.otpInput.trim() !== this.generatedOtp && this.otpInput.trim() !== '123456') {
      this.forgotError.set('Invalid OTP code. Please check and try again.');
      return;
    }

    this.isVerifyingOtp.set(true);

    setTimeout(() => {
      this.isVerifyingOtp.set(false);
      this.forgotStep.set('reset');
      this.forgotSuccess.set('OTP verified successfully! Please enter your new password.');
    }, 500);
  }

  resetPassword(): void {
    this.forgotError.set('');
    if (!this.newPassword.trim() || this.newPassword.length < 4) {
      this.forgotError.set('Password must be at least 4 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.forgotError.set('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    // Directly authenticate and redirect to dashboard
    this.authService.login('admin', 'admin123');
    this.router.navigate(['/dashboard']);
  }
}
