import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

const STORAGE_KEYS = {
  PROFILE: 'portfolio_profile',
  ABOUT: 'portfolio_about',
  PROJECTS: 'portfolio_projects',
  RESUME: 'portfolio_resume'
};

const DEFAULT_ABOUT: AboutData = {
  bioParagraphs: [
    "I'm a Full Stack Developer Trainee passionate about building efficient web applications and solving real-world problems through clean, modern code. With experience in both front-end and back-end development, I enjoy creating intuitive user interfaces and scalable server solutions.",
    "My goal is to continuously learn and innovate, delivering impactful digital solutions while expanding my technical skills in modern web technologies."
  ],
  stats: [
    {
      icon: 'code-slash-outline',
      value: '3+',
      label: 'Projects Built',
      text: 'HRMS, Restaurant & Quiz apps'
    },
    {
      icon: 'trophy-outline',
      value: '50+',
      label: 'Problems Solved',
      text: 'On LeetCode & HackerRank'
    },
    {
      icon: 'terminal-outline',
      value: '5+',
      label: 'Tech Mastered',
      text: 'Frontend, Backend & DB'
    },
    {
      icon: 'time-outline',
      value: '100+',
      label: 'Coding Hours',
      text: 'Dedicated to full-stack dev'
    }
  ],
  services: [
    {
      title: 'Web development',
      icon: 'code-slash-outline',
      text: 'Building fast, scalable and dynamic web applications with clean code.',
      tags: ['React', 'Angular', 'Spring Boot']
    },
    {
      title: 'Travel',
      icon: 'bicycle-outline',
      text: 'I love exploring new places at my own pace. Bike travel connects me more closely with nature and local communities.',
      tags: ['Adventure', 'Explore', 'Culture']
    },
    {
      title: 'Photography',
      icon: 'camera-outline',
      text: 'Capturing moments and turning them into memories through my lens.',
      tags: ['Nature', 'Portrait', 'Street']
    }
  ],
  techStack: [
    { name: 'HTML5', iconClass: 'devicon-html5-plain colored' },
    { name: 'CSS3', iconClass: 'devicon-css3-plain colored' },
    { name: 'JavaScript', iconClass: 'devicon-javascript-plain colored' },
    { name: 'React', iconClass: 'devicon-react-original colored' },
    { name: 'Angular', iconClass: 'devicon-angularjs-plain colored' },
    { name: 'Spring Boot', iconClass: 'devicon-spring-plain colored' },
    { name: 'Java', iconClass: 'devicon-java-plain colored' },
    { name: 'MySQL', iconClass: 'devicon-mysql-plain colored' },
    { name: 'Git', iconClass: 'devicon-git-plain colored' },
    { name: 'GitHub', iconClass: 'devicon-github-original' }
  ]
};

const DEFAULT_PROJECTS: ProjectsData = {
  filters: ['All Projects', 'Web Development', 'Full Stack', 'Other'],
  projects: [],
  highlights: [
    {
      icon: 'code-slash-outline',
      title: '3+ Projects Completed',
      text: 'End-to-end projects built and deployed.'
    },
    {
      icon: 'bulb-outline',
      title: 'Problem Solver',
      text: 'I enjoy solving real-world problems with clean and efficient code.'
    },
    {
      icon: 'rocket-outline',
      title: 'Always Learning',
      text: 'Exploring new technologies and improving my skills every day.'
    },
    {
      icon: 'locate-outline',
      title: 'Quality Focused',
      text: 'I write clean, maintainable code and follow best practices.'
    }
  ]
};

const DEFAULT_RESUME: ResumeData = {
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
  private projectsApiUrl = `${environment.apiUrl}/projects`;
  private resumeApiUrl = `${environment.apiUrl}/resume`;

  readonly profile = signal<ProfileData>({ name: '', title: '', avatarUrl: '', contacts: [], socials: [], resumeLink: '' });
  readonly about = signal<AboutData>(DEFAULT_ABOUT);
  readonly projects = signal<ProjectsData>({
    filters: ['All Projects', 'Web Development', 'Full Stack', 'Other'],
    projects: [],
    highlights: DEFAULT_PROJECTS.highlights
  });
  readonly resume = signal<ResumeData>(DEFAULT_RESUME);

  constructor() {
    this.clearLegacyLocalStorage();
    this.fetchProfileFromServer();
    this.fetchProjectsFromServer();
    this.fetchResumeFromServer();
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
