import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal, computed, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService, ProjectItem } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  @Input() isActive = false;

  private portfolioService = inject(PortfolioDataService);

  readonly selectedProject = signal<ProjectItem | null>(null);
  readonly selectedProjectIndex = signal<number>(-1);

  ngOnInit(): void {
    this.portfolioService.fetchProjectsFromServer();
  }

  readonly projectsData = computed(() => this.portfolioService.projects());

  readonly activeFilter = signal('All Projects');

  get filters(): string[] {
    const list = this.projects || [];
    const dynamicCats = Array.from(new Set(list.map((p) => p.category?.trim()).filter(Boolean) as string[]));
    return ['All Projects', ...dynamicCats];
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

  openLightbox(project: ProjectItem, event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('.project-link-btn')) {
        return;
      }
    }
    const list = this.filteredProjects();
    const index = list.findIndex((p) => p.title === project.title);
    this.selectedProject.set(project);
    this.selectedProjectIndex.set(index >= 0 ? index : 0);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.selectedProject.set(null);
    this.selectedProjectIndex.set(-1);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  nextProject(event?: Event): void {
    if (event) event.stopPropagation();
    const list = this.filteredProjects();
    if (list.length === 0) return;
    const nextIdx = (this.selectedProjectIndex() + 1) % list.length;
    this.selectedProjectIndex.set(nextIdx);
    this.selectedProject.set(list[nextIdx]);
  }

  prevProject(event?: Event): void {
    if (event) event.stopPropagation();
    const list = this.filteredProjects();
    if (list.length === 0) return;
    const prevIdx = (this.selectedProjectIndex() - 1 + list.length) % list.length;
    this.selectedProjectIndex.set(prevIdx);
    this.selectedProject.set(list[prevIdx]);
  }

  @HostListener('document:keydown.escape')
  onKeydownEscape(): void {
    if (this.selectedProject()) {
      this.closeLightbox();
    }
  }

  @HostListener('document:keydown.arrowright')
  onKeydownArrowRight(): void {
    if (this.selectedProject()) {
      this.nextProject();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onKeydownArrowLeft(): void {
    if (this.selectedProject()) {
      this.prevProject();
    }
  }
}
