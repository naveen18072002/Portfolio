import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioDataService);
  private readonly router = inject(Router);

  readonly profile = computed(() => this.portfolioService.profile());
  readonly socials = computed(() => this.profile().socials || []);

  readonly countdown = signal<number>(10);
  readonly isPaused = signal<boolean>(false);

  private timerInterval?: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startCountdown(): void {
    if (typeof window === 'undefined') return;
    this.timerInterval = setInterval(() => {
      if (!this.isPaused()) {
        const current = this.countdown();
        if (current <= 1) {
          clearInterval(this.timerInterval);
          this.router.navigate(['/']);
        } else {
          this.countdown.set(current - 1);
        }
      }
    }, 1000);
  }

  togglePause(): void {
    this.isPaused.update((v) => !v);
  }
}

