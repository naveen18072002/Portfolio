import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  value: number;
  icon: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  detail: string;
  period: string;
}

interface ProjectCard {
  title: string;
  badge: string;
  icon: string;
  description: string;
  tags: string[];
  features: string[];
}

interface TimelineItem {
  title: string;
  role: string;
  period: string;
  text: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './resume.component.html'
})
export class ResumeComponent {
  private _isActive = false;

  /** Skill bars stay at 0 until 60ms after the tab activates, so the fill animates in. */
  readonly skillsLoaded = signal(false);

  @Input()
  set isActive(value: boolean) {
    this._isActive = value;
    if (value) {
      setTimeout(() => this.skillsLoaded.set(true), 60);
    } else {
      this.skillsLoaded.set(false);
    }
  }
  get isActive(): boolean {
    return this._isActive;
  }

  readonly education: EducationItem[] = [
    {
      degree: 'Bachelor of Engineering in Electronics and Communication Engineering',
      institution: 'Government College of Engineering, Tirunelveli',
      detail: 'CGPA: 7.41 / 10.0',
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
  ];

  readonly projects: ProjectCard[] = [
    {
      title: 'Smart Proximity Alert System',
      badge: 'May - 2025',
      icon: 'hardware-chip-outline',
      description:
        'An IoT-based smart monitoring system that prevents falls into open drainage. Arduino with ' +
        'ultrasonic/IR sensors tracks data in real time, displays it on an LCD and alerts authorities ' +
        'over Wi-Fi, while servo motors automate pit covers.',
      tags: ['Arduino', 'IoT Sensors', 'Wi-Fi', 'Servo Motors'],
      features: ['Real-time monitoring', 'Wi-Fi alerts to authorities', 'Automated pit covers']
    }
  ];

  readonly experiences: TimelineItem[] = [
    {
      title: 'Vsolve Tech Global Solutions - Chennai',
      role: 'Full Stack Developer Trainee',
      period: 'March - July 2026',
      text:
        'Resolved bugs and optimized functionality in an ERP management portal, improving system stability and user experience.Designed and developed a full-stack HRMS portal using modern web technologies, focusing on responsive UI and efficient backend integration.'
    }
  ];
  readonly internships: TimelineItem[] = [
    {
      title: 'NSIC Technical Service Centre - Chennai',
      role: 'Embedded Trainee',
      period: 'August - 2024',
      text:
        'Worked with ESP32 microcontrollers to develop a smart monitoring system for industrial applications, focusing on real-time data acquisition and wireless communication. Gained hands-on experience in embedded systems programming, sensor integration, and IoT protocols, contributing to the development of efficient and reliable solutions for industrial automation.'
    }
  ];

  readonly skills: Skill[] = [
    { name: 'HTML', value: 80, icon: 'logo-html5' },
    { name: 'CSS', value: 75, icon: 'logo-css3' },
    { name: 'JavaScript', value: 70, icon: 'logo-javascript' },
    { name: 'React', value: 70, icon: 'logo-react' },
    { name: 'Core Java', value: 75, icon: 'cafe-outline' },
    { name: 'Spring Boot', value: 75, icon: 'leaf-outline' },
    { name: 'SQL', value: 80, icon: 'server-outline' }
  ];

}
