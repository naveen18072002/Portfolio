import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  category: string;
  link: string;
  image: string;
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

  readonly projects: Project[] = [
    {
      title: 'Quiz',
      category: 'Web development',
      link: 'https://naveenkumar-quiz.netlify.app/',
      image: 'assets/images/project-2.png'
    },
    {
      title: 'Restaurant',
      category: 'Web development',
      link: 'https://naveen18072002.github.io/Restaurant/',
      image: 'assets/images/project-1.png'
    },
    {
      title: 'HR Management and Payroll System',
      category: 'Web development',
      link: 'https://github.com/naveen18072002/Hr_Management_and_Payroll_System',
      image: 'assets/images/project-3.png'
    }
  ];
}
