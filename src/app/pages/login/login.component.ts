import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, signal, computed } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  // Login form state
  username = '';
  password = '';
  showPassword = signal(false);
  rememberMe = signal(false);
  errorMessage = signal('');
  isSubmitting = signal(false);
  isCapsLockOn = signal(false);

  // Forgot Password state
  isForgotPassword = signal(false);
  forgotStep = signal<'email' | 'otp' | 'reset'>('email');
  resetEmail = '';
  otpInput = '';
  newPassword = '';
  confirmPassword = '';
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  forgotError = signal('');
  forgotSuccess = signal('');
  isSendingOtp = signal(false);
  isVerifyingOtp = signal(false);
  isResettingPassword = signal(false);
  resendCountdown = signal(0);

  private resendTimerInterval?: any;

  readonly isPasswordMatch = computed(() => {
    if (!this.newPassword || !this.confirmPassword) return null;
    return this.newPassword === this.confirmPassword;
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('portfolio_remembered_username');
      if (savedUser) {
        this.username = savedUser;
        this.rememberMe.set(true);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.resendTimerInterval) {
      clearInterval(this.resendTimerInterval);
    }
  }

  checkCapsLock(event: KeyboardEvent): void {
    if (event.getModifierState) {
      this.isCapsLockOn.set(event.getModifierState('CapsLock'));
    }
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  openForgotPassword(): void {
    this.isForgotPassword.set(true);
    this.forgotStep.set('email');
    this.resetEmail = this.username && this.username.includes('@') ? this.username : '';
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

  startResendTimer(): void {
    this.resendCountdown.set(30);
    if (this.resendTimerInterval) {
      clearInterval(this.resendTimerInterval);
    }
    this.resendTimerInterval = setInterval(() => {
      const current = this.resendCountdown();
      if (current <= 1) {
        clearInterval(this.resendTimerInterval);
        this.resendCountdown.set(0);
      } else {
        this.resendCountdown.set(current - 1);
      }
    }, 1000);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    if (typeof window !== 'undefined') {
      if (this.rememberMe()) {
        localStorage.setItem('portfolio_remembered_username', this.username.trim());
      } else {
        localStorage.removeItem('portfolio_remembered_username');
      }
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
        this.errorMessage.set('Could not log in. Please check your credentials.');
      }
    });
  }

  sendOtp(): void {
    if (this.resendCountdown() > 0 && this.isSendingOtp()) return;

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
          this.startResendTimer();
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

    if (!this.otpInput.trim() || this.otpInput.trim().length !== 6) {
      this.forgotError.set('Please enter the complete 6-digit OTP code.');
      return;
    }

    this.isVerifyingOtp.set(true);

    this.authService.verifyOtp(this.resetEmail, this.otpInput.trim()).subscribe({
      next: (res) => {
        this.isVerifyingOtp.set(false);
        if (res.success) {
          this.forgotStep.set('reset');
          this.forgotSuccess.set('OTP verified successfully. Enter your new password below.');
        } else {
          this.forgotError.set(res.message);
        }
      },
      error: () => {
        this.isVerifyingOtp.set(false);
        this.forgotError.set('OTP verification failed. Please check the code.');
      }
    });
  }

  resetPassword(): void {
    this.forgotError.set('');

    if (!this.newPassword.trim() || this.newPassword.length < 6) {
      this.forgotError.set('Password must be at least 6 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.forgotError.set('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    this.isResettingPassword.set(true);

    this.authService.resetPassword(this.resetEmail, this.otpInput.trim(), this.newPassword, this.confirmPassword).subscribe({
      next: (res) => {
        this.isResettingPassword.set(false);
        if (res.success) {
          this.isForgotPassword.set(false);
          this.errorMessage.set('Password reset successfully! Please log in with your new password.');
        } else {
          this.forgotError.set(res.message);
        }
      },
      error: () => {
        this.isResettingPassword.set(false);
        this.forgotError.set('Could not reset password. Please try again.');
      }
    });
  }
}

