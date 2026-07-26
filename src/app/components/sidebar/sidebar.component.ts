import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private portfolioService = inject(PortfolioDataService);

  readonly isOpen = signal(false);

  readonly profile = computed(() => this.portfolioService.profile());

  get contacts() {
    return this.profile().contacts;
  }

  get socials() {
    return this.profile().socials;
  }

  get resumeLink() {
    return this.profile().resumeLink;
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
