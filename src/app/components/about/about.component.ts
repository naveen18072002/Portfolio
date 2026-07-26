import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.component.html'
})
export class AboutComponent {
  @Input() isActive = false;

  private portfolioService = inject(PortfolioDataService);

  readonly aboutData = computed(() => this.portfolioService.about());

  get bioParagraphs() {
    return this.aboutData().bioParagraphs;
  }

  get stats() {
    return this.aboutData().stats;
  }

  get services() {
    return this.aboutData().services;
  }

  get techStack() {
    return this.aboutData().techStack;
  }
}
