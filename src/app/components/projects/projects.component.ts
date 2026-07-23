import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  category: string;
  icon: string;
  description: string;
  tags: string[];
  image: string;
  demoLink?: string;
  githubLink?: string;
}

interface Highlight {
  icon: string;
  title: string;
  subtitle?: string;
  text: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  @Input() isActive = false;

  readonly filters = ['All Projects', 'Web Development', 'Full Stack', 'Other'];

  readonly activeFilter = signal('All Projects');

  readonly projects: Project[] = [
    {
      title: 'Quiz',
      category: 'Web Development',
      icon: 'desktop-outline',
      description: 'A simple quiz application that allows users to attempt quizzes, see scores, and track progress.',
      tags: ['React'],
      demoLink: 'https://naveenkumar-quiz.netlify.app/',
      image: 'assets/images/project-1.png'
    },
    {
      title: 'Restaurant',
      category: 'Web Development',
      icon: 'globe-outline',
      description: 'A responsive restaurant website with menu, about, gallery, chefs and contact sections.',
      tags: ['React'],
      demoLink: 'https://naveen-restaurant.liveserver.workers.dev/',
      githubLink: 'https://github.com/naveen18072002/Restaurant',
      image: 'assets/images/project-2.png'
    }
  ];

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All Projects') return this.projects;
    return this.projects.filter((p) => p.category === filter);
  });

  readonly highlights: Highlight[] = [
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
  ];

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
