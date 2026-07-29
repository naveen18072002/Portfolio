import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService, getSkillIconByName, SkillItem } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './resume.component.html'
})
export class ResumeComponent implements AfterViewInit, OnDestroy {
  private portfolioService = inject(PortfolioDataService);

  private _isActive = false;
  private observer: IntersectionObserver | null = null;

  @ViewChild('skillSection') skillSection!: ElementRef;

  readonly skillsLoaded = signal(true);

  readonly resumeData = computed(() => this.portfolioService.resume());

  get education() {
    return this.resumeData().education;
  }

  get experiences() {
    return this.resumeData().experiences;
  }

  get internships() {
    return this.resumeData().internships;
  }

  get projects() {
    return this.resumeData().academicProjects;
  }

  get skills() {
    return this.resumeData().skills;
  }

  getSkillIcon(skill: SkillItem): string {
    return skill.icon && skill.icon.trim() ? skill.icon : getSkillIconByName(skill.name);
  }

  @Input()
  set isActive(value: boolean) {
    this._isActive = value;
    if (!value) {
      this.skillsLoaded.set(false);
    }
  }
  get isActive(): boolean {
    return this._isActive;
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && this.isActive) {
            this.skillsLoaded.set(true);
          }
        });
      }, {
        threshold: 0.50
      });

      if (this.skillSection) {
        this.observer.observe(this.skillSection.nativeElement);
      }
    } else {
      this.skillsLoaded.set(true);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
