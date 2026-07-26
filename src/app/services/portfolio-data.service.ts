import { Injectable, signal } from '@angular/core';

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

const DEFAULT_PROFILE: ProfileData = {
  name: 'Naveenkumar R',
  title: 'Fullstack Developer',
  avatarUrl: 'assets/images/my-avatar.png',
  contacts: [
    {
      title: 'Email',
      icon: 'mail-outline',
      value: 'naveenkumarrnk6677@gmail.com',
      type: 'link',
      href: 'mailto:naveenkumarrnk6677@gmail.com'
    },
    {
      title: 'Phone',
      icon: 'phone-portrait-outline',
      value: '+91 7397114035',
      type: 'link',
      href: 'tel:+917397114035'
    },
    {
      title: 'Birthday',
      icon: 'calendar-outline',
      value: 'July 18, 2002',
      type: 'time',
      datetime: '2002-07-18'
    },
    {
      title: 'Location',
      icon: 'location-outline',
      value: 'Cuddalore',
      type: 'address'
    }
  ],
  socials: [
    {
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/in/naveenkumar-r-7072a7277'
    },
    {
      name: 'GitHub',
      icon: 'logo-github',
      url: 'https://github.com/naveen18072002'
    },
    {
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/_naveen_390'
    }
  ],
  resumeLink: 'https://drive.google.com/file/d/1O1Zx_zJOVfq_p60hUzZI5R9Lv_eAhiQc/view?usp=drive_link'
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
  projects: [
    {
      id: '1',
      title: 'Quiz App',
      category: 'Web Development',
      icon: 'desktop-outline',
      description: 'A simple quiz application that allows users to attempt quizzes, see scores, and track progress.',
      tags: ['React', 'CSS'],
      demoLink: 'https://naveenkumar-quiz.netlify.app/',
      image: 'assets/images/project-1.png'
    },
    {
      id: '2',
      title: 'Restaurant Website',
      category: 'Web Development',
      icon: 'globe-outline',
      description: 'A responsive restaurant website with menu, about, gallery, chefs and contact sections.',
      tags: ['React', 'CSS'],
      demoLink: 'https://naveen-restaurant.liveserver.workers.dev/',
      githubLink: 'https://github.com/naveen18072002/Restaurant',
      image: 'assets/images/project-2.png'
    }
  ],
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
  education: [
    {
      degree: 'Bachelor of Engineering in Electronics and Communication Engineering (ECE)',
      institution: 'Government College of Engineering, Tirunelveli',
      detail: 'CGPA: 7.37 / 10.0',
      period: '2021 — 2025'
    },
    {
      degree: 'Higher Secondary Education (HSC)',
      institution: 'Vallalar Matriculation Higher Secondary School',
      detail: 'Percentage: 91.8%',
      period: '2019 — 2021'
    },
    {
      degree: 'Secondary Education (SSLC)',
      institution: 'Kannan Matriculation School',
      detail: 'Percentage: 90.6%',
      period: '2009 — 2019'
    }
  ],
  experiences: [
    {
      title: 'Vsolve Tech Global Solutions - Chennai',
      role: 'Full Stack Developer Trainee',
      period: 'March - July 2026',
      text: 'Resolved bugs and optimized functionality in an ERP management portal, improving system stability and user experience. Designed and developed a full-stack HRMS portal using modern web technologies, focusing on responsive UI and efficient backend integration.'
    }
  ],
  internships: [
    {
      title: 'NSIC Technical Service Centre - Chennai',
      role: 'Embedded Trainee',
      period: 'August - 2024',
      text: 'Worked with ESP32 microcontrollers to develop a smart monitoring system for industrial applications, focusing on real-time data acquisition and wireless communication.'
    },
    {
      title: 'Qspiders, Vadapalani - Chennai',
      role: 'Fullstack Developer Trainee',
      period: 'June - November 2025',
      text: 'Learned and applied full-stack development skills, including front-end and back-end technologies, to build web applications.'
    }
  ],
  academicProjects: [
    {
      title: 'Smart Proximity Alert System To Prevent Falls into Open Drainage Pits',
      badge: 'May - 2025',
      icon: 'hardware-chip-outline',
      description: 'An IoT-based smart monitoring system that prevents falls into open drainage. Arduino with ultrasonic/IR sensors tracks data in real time, displays it on an LCD and alerts authorities over Wi-Fi, while servo motors automate pit covers.',
      tags: ['Arduino', 'IoT Sensors', 'Wi-Fi', 'Servo Motors'],
      features: ['Real-time monitoring', 'Wi-Fi alerts to authorities', 'Automated pit covers']
    }
  ],
  skills: [
    { name: 'HTML', value: 80, icon: 'logo-html5' },
    { name: 'CSS', value: 75, icon: 'logo-css3' },
    { name: 'JavaScript', value: 70, icon: 'logo-javascript' },
    { name: 'React', value: 70, icon: 'logo-react' },
    { name: 'Core Java', value: 75, icon: 'cafe-outline' },
    { name: 'Spring Boot', value: 75, icon: 'leaf-outline' },
    { name: 'SQL', value: 80, icon: 'server-outline' }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  readonly profile = signal<ProfileData>(this.loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
  readonly about = signal<AboutData>(this.loadFromStorage(STORAGE_KEYS.ABOUT, DEFAULT_ABOUT));
  readonly projects = signal<ProjectsData>(this.loadFromStorage(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS));
  readonly resume = signal<ResumeData>(this.loadFromStorage(STORAGE_KEYS.RESUME, DEFAULT_RESUME));

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }

  updateProfile(data: ProfileData): void {
    this.profile.set({ ...data });
    this.saveToStorage(STORAGE_KEYS.PROFILE, data);
  }

  updateAbout(data: AboutData): void {
    this.about.set({ ...data });
    this.saveToStorage(STORAGE_KEYS.ABOUT, data);
  }

  updateProjects(data: ProjectsData): void {
    this.projects.set({ ...data });
    this.saveToStorage(STORAGE_KEYS.PROJECTS, data);
  }

  updateResume(data: ResumeData): void {
    this.resume.set({ ...data });
    this.saveToStorage(STORAGE_KEYS.RESUME, data);
  }

  resetAllToDefault(): void {
    this.updateProfile(DEFAULT_PROFILE);
    this.updateAbout(DEFAULT_ABOUT);
    this.updateProjects(DEFAULT_PROJECTS);
    this.updateResume(DEFAULT_RESUME);
  }
}
