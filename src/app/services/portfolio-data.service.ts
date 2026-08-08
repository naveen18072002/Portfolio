import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactItem {
  title: string;
  icon: string;
  value: string;
  type: 'link' | 'time' | 'address';
  href?: string;
  datetime?: string;
}

export interface SocialItem {
  name: string;
  icon: string;
  url: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  text: string;
}

export interface ServiceItem {
  title: string;
  icon: string;
  text: string;
  tags: string[];
}

export interface TechItem {
  name: string;
  iconClass: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  tags: string[];
  image: string;
  demoLink?: string;
  githubLink?: string;
}

export interface HighlightItem {
  icon: string;
  title: string;
  subtitle?: string;
  text: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  detail: string;
  period: string;
}

export interface AcademicProjectCard {
  title: string;
  badge: string;
  icon: string;
  description: string;
  tags: string[];
  features: string[];
}

export interface TimelineItem {
  title: string;
  role: string;
  period: string;
  text: string;
}

export interface SkillItem {
  name: string;
  value: number;
  icon: string;
}

export function getSkillIconByName(skillName: string): string {
  if (!skillName) return 'code-outline';
  const name = skillName.toLowerCase().trim();

  if (name.includes('html')) return 'logo-html5';
  if (name.includes('css')) return 'logo-css3';
  if (name.includes('javascript') || name === 'js' || name.includes('js ')) return 'logo-javascript';
  if (name.includes('react')) return 'logo-react';
  if (name.includes('angular')) return 'logo-angular';
  if (name.includes('node')) return 'logo-nodejs';
  if (name.includes('python')) return 'logo-python';
  if (name.includes('java')) return 'cafe-outline';
  if (name.includes('spring')) return 'leaf-outline';
  if (name.includes('sql') || name.includes('db') || name.includes('database') || name.includes('oracle') || name.includes('mongo') || name.includes('mysql')) return 'server-outline';
  if (name.includes('git')) return 'logo-github';
  if (name.includes('docker')) return 'logo-docker';
  if (name.includes('figma')) return 'logo-figma';
  if (name.includes('sass') || name.includes('scss')) return 'logo-sass';
  if (name.includes('android')) return 'logo-android';
  if (name.includes('apple') || name.includes('ios') || name.includes('swift')) return 'logo-apple';
  if (name.includes('linux')) return 'logo-tux';
  if (name.includes('npm')) return 'logo-npm';
  if (name.includes('vue')) return 'logo-vue';
  if (name.includes('typescript') || name === 'ts') return 'code-slash-outline';
  if (name.includes('c++') || name.includes('c#') || name === 'c') return 'hardware-chip-outline';
  if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) return 'cloud-outline';

  return 'code-outline';
}

export interface ProfileData {
  name: string;
  title: string;
  avatarUrl: string;
  contacts: ContactItem[];
  socials: SocialItem[];
  resumeLink: string;
}

export interface AboutData {
  bioParagraphs: string[];
  stats: StatItem[];
  services: ServiceItem[];
  techStack: TechItem[];
}

export interface ProjectsData {
  filters: string[];
  projects: ProjectItem[];
  highlights: HighlightItem[];
}

export interface ResumeData {
  education: EducationItem[];
  experiences: TimelineItem[];
  internships: TimelineItem[];
  academicProjects: AcademicProjectCard[];
  skills: SkillItem[];
}

const CACHE_KEYS = {
  PROFILE: 'cached_portfolio_profile',
  ABOUT: 'cached_portfolio_about',
  PROJECTS: 'cached_portfolio_projects',
  RESUME: 'cached_portfolio_resume'
};

const EMPTY_ABOUT: AboutData = {
  bioParagraphs: [],
  stats: [],
  services: [],
  techStack: []
};

const EMPTY_PROJECTS: ProjectsData = {
  filters: ['All Projects', 'Web Development', 'Full Stack', 'Other'],
  projects: [],
  highlights: []
};

const EMPTY_RESUME: ResumeData = {
  education: [],
  experiences: [],
  internships: [],
  academicProjects: [],
  skills: []
};

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private http = inject(HttpClient);
  private profileApiUrl = `${environment.apiUrl}/profile`;
  private aboutApiUrl = `${environment.apiUrl}/about`;
  private projectsApiUrl = `${environment.apiUrl}/projects`;
  private resumeApiUrl = `${environment.apiUrl}/resume`;

  readonly profile = signal<ProfileData>({ name: '', title: '', avatarUrl: '', contacts: [], socials: [], resumeLink: '' });
  readonly about = signal<AboutData>(EMPTY_ABOUT);
  readonly projects = signal<ProjectsData>(EMPTY_PROJECTS);
  readonly resume = signal<ResumeData>(EMPTY_RESUME);
  readonly isLoading = signal<boolean>(true);

  constructor() {
    const hasCache = this.loadDataFromCache();
    if (hasCache) {
      this.isLoading.set(false);
    }
    this.refreshAllData();
  }

  private loadDataFromCache(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      let loaded = false;
      const p = localStorage.getItem(CACHE_KEYS.PROFILE);
      if (p) {
        this.profile.set(JSON.parse(p));
        loaded = true;
      }
      const a = localStorage.getItem(CACHE_KEYS.ABOUT);
      if (a) {
        this.about.set(JSON.parse(a));
        loaded = true;
      }
      const pr = localStorage.getItem(CACHE_KEYS.PROJECTS);
      if (pr) {
        this.projects.set(JSON.parse(pr));
        loaded = true;
      }
      const r = localStorage.getItem(CACHE_KEYS.RESUME);
      if (r) {
        this.resume.set(JSON.parse(r));
        loaded = true;
      }
      return loaded;
    } catch (e) {
      return false;
    }
  }

  private saveToCache(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  refreshAllData(): void {
    if (typeof window === 'undefined') {
      this.isLoading.set(false);
      return;
    }
    
    // Only set loading if no cached profile exists
    if (!this.profile().name) {
      this.isLoading.set(true);
    }
    const startTime = Date.now();

    forkJoin({
      profile: this.http.get<ProfileData>(this.profileApiUrl).pipe(
        timeout(12000),
        catchError((err) => {
          console.warn('Profile fetch failed or timed out:', err);
          return of(null);
        })
      ),
      about: this.http.get<AboutData>(this.aboutApiUrl).pipe(
        timeout(12000),
        catchError((err) => {
          console.warn('About fetch failed or timed out:', err);
          return of(null);
        })
      ),
      projects: this.http.get<ProjectItem[]>(this.projectsApiUrl).pipe(
        timeout(12000),
        catchError((err) => {
          console.warn('Projects fetch failed or timed out:', err);
          return of([]);
        })
      ),
      resume: this.http.get<ResumeData>(this.resumeApiUrl).pipe(
        timeout(12000),
        catchError((err) => {
          console.warn('Resume fetch failed or timed out:', err);
          return of(null);
        })
      )
    }).subscribe({
      next: (res) => {
        if (res.profile && res.profile.name) {
          this.profile.set(res.profile);
          this.saveToCache(CACHE_KEYS.PROFILE, res.profile);
        }
        if (res.about) {
          const aboutVal = {
            bioParagraphs: res.about.bioParagraphs || [],
            stats: res.about.stats || [],
            services: res.about.services || [],
            techStack: res.about.techStack || []
          };
          this.about.set(aboutVal);
          this.saveToCache(CACHE_KEYS.ABOUT, aboutVal);
        }
        if (res.projects && Array.isArray(res.projects) && res.projects.length > 0) {
          const current = this.projects();
          const projectsVal = {
            ...current,
            projects: res.projects
          };
          this.projects.set(projectsVal);
          this.saveToCache(CACHE_KEYS.PROJECTS, projectsVal);
        }
        if (res.resume) {
          const current = this.resume();
          const skillsList = (res.resume.skills || []).map((s) => ({
            ...s,
            value: s.value != null ? Number(s.value) : 75,
            icon: s.icon && s.icon.trim() ? s.icon : getSkillIconByName(s.name)
          }));
          const formatted: ResumeData = {
            education: res.resume.education || [],
            experiences: res.resume.experiences || [],
            internships: res.resume.internships || [],
            academicProjects: res.resume.academicProjects || current.academicProjects || [],
            skills: skillsList
          };
          this.resume.set(formatted);
          this.saveToCache(CACHE_KEYS.RESUME, formatted);
        }

        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 300 - elapsed);
        setTimeout(() => {
          this.isLoading.set(false);
        }, delay);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private clearLegacyLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('portfolio_profile');
      localStorage.removeItem('portfolio_about');
      localStorage.removeItem('portfolio_projects');
      localStorage.removeItem('portfolio_resume');
    } catch (e) {
      console.warn('Could not clear local storage keys', e);
    }
  }

  fetchProfileFromServer(): void {
    if (typeof window === 'undefined') return;
    this.http.get<ProfileData>(this.profileApiUrl).subscribe({
      next: (data) => {
        if (data && data.name) {
          this.profile.set(data);
        }
      },
      error: (err) => {
        console.warn('Could not fetch profile from backend server:', err);
      }
    });
  }

  fetchAboutFromServer(): void {
    if (typeof window === 'undefined') return;
    this.http.get<AboutData>(this.aboutApiUrl).subscribe({
      next: (data) => {
        if (data) {
          this.about.set({
            bioParagraphs: data.bioParagraphs || [],
            stats: data.stats || [],
            services: data.services || [],
            techStack: data.techStack || []
          });
        }
      },
      error: (err) => {
        console.warn('Could not fetch about data from backend server:', err);
      }
    });
  }

  fetchProjectsFromServer(): void {
    if (typeof window === 'undefined') return;
    this.http.get<ProjectItem[]>(this.projectsApiUrl).subscribe({
      next: (list) => {
        if (list && Array.isArray(list) && list.length > 0) {
          const current = this.projects();
          this.projects.set({
            ...current,
            projects: list
          });
        }
      },
      error: (err) => {
        console.warn('Could not fetch projects from backend server:', err);
      }
    });
  }

  fetchResumeFromServer(): void {
    if (typeof window === 'undefined') return;
    this.http.get<ResumeData>(this.resumeApiUrl).subscribe({
      next: (data) => {
        if (data) {
          const current = this.resume();
          const skillsList = (data.skills || []).map((s) => ({
            ...s,
            value: s.value != null ? Number(s.value) : 75,
            icon: s.icon && s.icon.trim() ? s.icon : getSkillIconByName(s.name)
          }));
          const formatted: ResumeData = {
            education: data.education || [],
            experiences: data.experiences || [],
            internships: data.internships || [],
            academicProjects: data.academicProjects || current.academicProjects || [],
            skills: skillsList
          };
          this.resume.set(formatted);
        }
      },
      error: (err) => {
        console.warn('Could not fetch resume from backend server:', err);
      }
    });
  }

  updateProfile(data: ProfileData): void {
    this.profile.set({ ...data });

    this.http.post<ProfileData>(this.profileApiUrl, data).subscribe({
      next: (res) => {
        if (res && res.name) {
          this.profile.set(res);
        }
      },
      error: (err) => {
        console.error('Error saving profile to backend server:', err);
      }
    });
  }

  updateAbout(data: AboutData): void {
    this.about.set({ ...data });

    this.http.post<AboutData>(this.aboutApiUrl, data).subscribe({
      next: (res) => {
        if (res) {
          this.about.set({
            bioParagraphs: res.bioParagraphs || [],
            stats: res.stats || [],
            services: res.services || [],
            techStack: res.techStack || []
          });
        }
      },
      error: (err) => {
        console.error('Error saving about data to backend server:', err);
      }
    });
  }

  updateProjects(data: ProjectsData): void {
    this.projects.set({ ...data });

    this.http.post<ProjectItem[]>(`${this.projectsApiUrl}/batch`, data.projects).subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.projects.set({
            ...data,
            projects: res
          });
        }
      },
      error: (err) => {
        console.error('Error saving projects to backend server:', err);
      }
    });
  }

  updateResume(data: ResumeData): void {
    this.resume.set({ ...data });

    this.http.post<ResumeData>(this.resumeApiUrl, data).subscribe({
      next: (res) => {
        if (res) {
          const current = this.resume();
          const formatted: ResumeData = {
            education: res.education || [],
            experiences: res.experiences || [],
            internships: res.internships || [],
            academicProjects: res.academicProjects || current.academicProjects || [],
            skills: res.skills || []
          };
          this.resume.set(formatted);
        }
      },
      error: (err) => {
        console.error('Error saving resume to backend server:', err);
      }
    });
  }

}
