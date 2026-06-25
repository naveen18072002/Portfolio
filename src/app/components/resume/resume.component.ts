import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  value: number;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './resume.component.html'
})
export class ResumeComponent {
  @Input() isActive = false;

  readonly skills: Skill[] = [
    { name: 'HTML', value: 80 },
    { name: 'CSS', value: 75 },
    { name: 'JavaScript', value: 70 },
    { name: 'React', value: 70 },
    { name: 'Core Java', value: 75 },
    { name: 'Spring Boot', value: 75 },
    { name: 'SQL', value: 80 }
  ];

  readonly resumeLink =
    'https://drive.google.com/file/d/1_vGkRvCD0sdz3CfMTWPlSlc01VctVjNu/view?usp=drive_link';
}
