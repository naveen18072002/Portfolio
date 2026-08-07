import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal, ElementRef, ViewChild, AfterViewChecked, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService, getSkillIconByName, SkillItem } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './resume.component.html'
})
export class ResumeComponent implements AfterViewChecked, OnDestroy {
  private portfolioService = inject(PortfolioDataService);

  private _isActive = false;
  private observer: IntersectionObserver | null = null;
  private observerInitialized = false;

  @ViewChild('skillSection') skillSection?: ElementRef;

  readonly animatedValues = signal<number[]>([]);
  readonly isAnimating = signal<boolean>(false);
  private animationFrameIds: number[] = [];
  private hasAnimatedOnScreen = false;

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

  getAnimatedValue(index: number, targetValue: number | string): number {
    const vals = this.animatedValues();
    if (vals && vals[index] !== undefined) {
      return vals[index];
    }
    return Number(targetValue) || 0;
  }

  @Input()
  set isActive(value: boolean) {
    this._isActive = value;
    if (value) {
      const skillList = this.skills;
      if (skillList && skillList.length) {
        this.animatedValues.set(new Array(skillList.length).fill(0));
      }
    } else {
      this.hasAnimatedOnScreen = false;
      this.isAnimating.set(false);
      this.cancelAnimations();
      this.animatedValues.set([]);
    }
  }
  get isActive(): boolean {
    return this._isActive;
  }

  private initObserver(): void {
    if (typeof window === 'undefined' || this.observerInitialized) return;
    if (!this.skillSection?.nativeElement) return;

    this.observerInitialized = true;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.isActive) {
          this.triggerCountUpAnimation();
        }
      });
    }, {
      threshold: 0.10
    });

    this.observer.observe(this.skillSection.nativeElement);
  }

  ngAfterViewChecked(): void {
    // Skills are loaded asynchronously from the API. ngAfterViewInit runs before
    // the data arrives, so the *ngIf section doesn't exist yet. Lazy-init the
    // observer on each change-detection pass until the section is rendered.
    this.initObserver();
  }

  triggerCountUpAnimation(): void {
    if (this.hasAnimatedOnScreen) return;
    const skillList = this.skills;
    if (!skillList || skillList.length === 0) return;

    this.hasAnimatedOnScreen = true;
    this.cancelAnimations();

    const initialVals = new Array(skillList.length).fill(0);
    this.animatedValues.set(initialVals);
    this.isAnimating.set(true);

    const duration = 1200;

    skillList.forEach((skill, index) => {
      const target = Number(skill.value) || 0;
      const staggerDelay = index * 80;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp + staggerDelay;
        }

        if (timestamp < startTime) {
          this.animationFrameIds[index] = requestAnimationFrame(step);
          return;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(easeOut * target);

        this.animatedValues.update((current) => {
          const updated = [...current];
          updated[index] = currentValue;
          return updated;
        });

        if (progress < 1) {
          this.animationFrameIds[index] = requestAnimationFrame(step);
        } else if (index === skillList.length - 1) {
          // Finish animation state cleanly
          setTimeout(() => this.isAnimating.set(false), 100);
        }
      };

      this.animationFrameIds[index] = requestAnimationFrame(step);
    });
  }

  private cancelAnimations(): void {
    this.animationFrameIds.forEach((id) => cancelAnimationFrame(id));
    this.animationFrameIds = [];
  }

  ngOnDestroy(): void {
    this.cancelAnimations();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
