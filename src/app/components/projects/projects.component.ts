import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  @Input() isActive = false;

  private portfolioService = inject(PortfolioDataService);

  readonly projectsData = computed(() => this.portfolioService.projects());

  readonly activeFilter = signal('All Projects');

  get filters() {
    return this.projectsData().filters || ['All Projects', 'Web Development', 'Full Stack', 'Other'];
  }

  get projects() {
    return this.projectsData().projects;
  }

  get highlights() {
    return this.projectsData().highlights;
  }

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const list = this.projects;
    if (filter === 'All Projects') return list;
    return list.filter((p) => p.category === filter);
  });

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
