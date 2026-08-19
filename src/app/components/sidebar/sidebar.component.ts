import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
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
export class SidebarComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioDataService);

  readonly isOpen = signal(false);
  readonly typedTitle = signal('');
  readonly currentRoleIcon = signal('terminal-outline');
  readonly currentRoleTheme = signal('theme-fullstack');
  readonly isWordComplete = signal(false);

  readonly profile = computed(() => this.portfolioService.profile());
  readonly about = computed(() => this.portfolioService.about());

  // Dynamic roles cycled by typewriter (purely derived from backend database)
  readonly dynamicRoles = computed(() => {
    const rawTitle = this.profile().title?.trim() || '';
    const rolesList: string[] = [];

    if (rawTitle) {
      const parts = rawTitle.split(/[,|/•]+/).map(r => r.trim()).filter(Boolean);
      rolesList.push(...parts);
    }

    // Also include services / specialties dynamically from backend if available
    const services = this.about().services || [];
    for (const s of services) {
      if (s.title && s.title.trim() && !rolesList.includes(s.title.trim())) {
        rolesList.push(s.title.trim());
      }
    }

    return rolesList;
  });

  private typingTimeout: any;
  private currentRoleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private isHoverPaused = false;

  ngOnInit(): void {
    this.portfolioService.fetchProfileFromServer();
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private getRoleIcon(roleName: string): string {
    const r = roleName.toLowerCase();
    if (r.includes('angular') || r.includes('front') || r.includes('ui') || r.includes('ux') || r.includes('web')) {
      return 'code-slash-outline';
    }
    if (r.includes('spring') || r.includes('java') || r.includes('back') || r.includes('api') || r.includes('microservice')) {
      return 'server-outline';
    }
    if (r.includes('cloud') || r.includes('aws') || r.includes('devops') || r.includes('docker')) {
      return 'cloud-outline';
    }
    if (r.includes('full') || r.includes('stack') || r.includes('architect') || r.includes('lead')) {
      return 'layers-outline';
    }
    if (r.includes('database') || r.includes('sql') || r.includes('data')) {
      return 'cube-outline';
    }
    return 'terminal-outline';
  }

  private getRoleTheme(roleName: string): string {
    const r = roleName.toLowerCase();
    if (r.includes('angular') || r.includes('front')) return 'theme-angular';
    if (r.includes('spring') || r.includes('java') || r.includes('back') || r.includes('api')) return 'theme-spring';
    if (r.includes('cloud') || r.includes('aws') || r.includes('devops') || r.includes('docker')) return 'theme-cloud';
    if (r.includes('database') || r.includes('sql') || r.includes('data')) return 'theme-db';
    if (r.includes('ui') || r.includes('ux') || r.includes('design')) return 'theme-ui';
    return 'theme-fullstack';
  }

  pauseTypewriter(): void {
    this.isHoverPaused = true;
  }

  resumeTypewriter(): void {
    if (this.isHoverPaused) {
      this.isHoverPaused = false;
      this.startTypewriter();
    }
  }

  skipToNextRole(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.isDeleting = false;
    this.charIndex = 0;
    this.isWordComplete.set(false);
    const currentRoles = this.dynamicRoles();
    if (currentRoles.length > 0) {
      this.currentRoleIndex = (this.currentRoleIndex + 1) % currentRoles.length;
      const nextRole = currentRoles[this.currentRoleIndex];
      this.currentRoleIcon.set(this.getRoleIcon(nextRole));
      this.currentRoleTheme.set(this.getRoleTheme(nextRole));
    }
    this.isHoverPaused = false;
    this.startTypewriter();
  }

  private startTypewriter(): void {
    if (typeof window === 'undefined' || this.isHoverPaused) return;

    const currentRoles = this.dynamicRoles();
    if (currentRoles.length === 0) {
      this.typedTitle.set('');
      this.typingTimeout = setTimeout(() => this.startTypewriter(), 800);
      return;
    }

    if (this.currentRoleIndex >= currentRoles.length) {
      this.currentRoleIndex = 0;
    }

    const currentRole = currentRoles[this.currentRoleIndex];
    if (!currentRole) {
      this.typingTimeout = setTimeout(() => this.startTypewriter(), 800);
      return;
    }

    this.currentRoleIcon.set(this.getRoleIcon(currentRole));
    this.currentRoleTheme.set(this.getRoleTheme(currentRole));

    if (this.isDeleting) {
      this.isWordComplete.set(false);
      this.typedTitle.set(currentRole.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.typedTitle.set(currentRole.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let speed = this.isDeleting ? (25 + Math.random() * 15) : (60 + Math.random() * 30);

    if (!this.isDeleting && this.charIndex === currentRole.length) {
      this.isWordComplete.set(true);
      speed = 2400; // Pause at full title
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % currentRoles.length;
      speed = 400; // Pause before next role
    }

    this.typingTimeout = setTimeout(() => this.startTypewriter(), speed);
  }

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
