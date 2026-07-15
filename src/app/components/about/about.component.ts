import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceItem {
  title: string;
  icon: string;
  text: string;
  tags: string[];
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface TechItem {
  name: string;
  iconClass: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.component.html'
})
export class AboutComponent {
  @Input() isActive = false;

  readonly stats: StatItem[] = [
    { label: 'Experience', value: '6 Months', icon: 'time-outline' },
    { label: 'Projects', value: '3+ Completed', icon: 'folder-open-outline' },
    { label: 'Availability', value: 'Open to Work', icon: 'checkmark-circle-outline' },
    { label: 'Relocation', value: 'Open to Relocate', icon: 'earth-outline' }
  ];

  readonly services: ServiceItem[] = [
    {
      title: 'Web development',
      icon: 'code-slash-outline',
      text: 'Building fast, scalable and dynamic web applications with clean code.',
      tags: ['React', 'Angular', 'Spring Boot']
    },
    {
      title: 'Travel',
      icon: 'bicycle-outline',
      text: 'I love exploring new places at my own pace. Bike travel connects me more closely with nature and local communities — every journey becomes an adventure.',
      tags: ['Adventure', 'Explore', 'Culture']
    },
    {
      title: 'Photography',
      icon: 'camera-outline',
      text: 'Capturing moments and turning them into memories through my lens.',
      tags: ['Nature', 'Portrait', 'Street']
    }
  ];

  readonly techStack: TechItem[] = [
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
  ];
}
