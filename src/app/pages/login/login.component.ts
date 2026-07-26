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

    this.authService.loginApi(this.username, this.password).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Could not log in. Please check backend status or credentials.');
      }
    });
  }

  sendOtp(): void {
    this.forgotError.set('');
    this.forgotSuccess.set('');

    if (!this.resetEmail.trim() || !this.resetEmail.includes('@')) {
      this.forgotError.set('Please enter a valid email address.');
      return;
    }

    this.isSendingOtp.set(true);

    this.authService.sendOtp(this.resetEmail).subscribe({
      next: (res) => {
        this.isSendingOtp.set(false);
        if (res.success) {
          this.forgotStep.set('otp');
          this.forgotSuccess.set(res.message);
        } else {
          this.forgotError.set(res.message);
        }
      },
      error: () => {
        this.isSendingOtp.set(false);
        this.forgotError.set('Failed to send OTP code. Please try again.');
      }
    });
  }

  verifyOtp(): void {
    this.forgotError.set('');
    this.forgotSuccess.set('');

    if (!this.otpInput.trim()) {
      this.forgotError.set('Please enter the 6-digit OTP code.');
      return;
    }

    this.isVerifyingOtp.set(true);

    this.authService.verifyOtp(this.resetEmail, this.otpInput).subscribe({
      next: (res) => {
        this.isVerifyingOtp.set(false);
        if (res.success) {
          this.forgotStep.set('reset');
          this.forgotSuccess.set(res.message);
        } else {
          this.forgotError.set(res.message);
        }
      },
      error: () => {
        this.isVerifyingOtp.set(false);
        this.forgotError.set('OTP verification failed. Please try again.');
      }
    });
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

    this.authService.resetPassword(this.resetEmail, this.otpInput, this.newPassword, this.confirmPassword).subscribe({
      next: (res) => {
        if (res.success) {
          this.isForgotPassword.set(false);
          this.errorMessage.set('Password reset successfully! Please log in with your new password.');
        } else {
          this.forgotError.set(res.message);
        }
      },
      error: () => {
        this.forgotError.set('Could not reset password. Please try again.');
      }
    });
  }
}
