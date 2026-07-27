import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  PortfolioDataService,
  ProfileData,
  AboutData,
  ProjectsData,
  ResumeData,
  ProjectItem,
  StatItem,
  ServiceItem,
  TechItem,
  EducationItem,
  TimelineItem,
  SkillItem,
  AcademicProjectCard
} from '../../services/portfolio-data.service';
import { AuthService } from '../../services/auth.service';

export type DashboardTab = 'profile' | 'about' | 'projects' | 'resume';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  activeTab = signal<DashboardTab>('profile');
  toastMessage = signal<string>('');
  // Form Models initialized from service
  profileForm!: ProfileData;
  aboutForm!: AboutData;
  projectsForm!: ProjectsData;
  resumeForm!: ResumeData;

  // New items temp models
  newService: ServiceItem = { title: '', icon: 'code-slash-outline', text: '', tags: [] };
  newServiceTagInput = '';

  newTech: TechItem = { name: '', iconClass: 'devicon-javascript-plain colored' };

  newProject: ProjectItem = {
    title: '',
    category: 'Web Development',
    icon: 'desktop-outline',
    description: '',
    tags: [],
    image: 'assets/images/project-1.png',
    demoLink: '',
    githubLink: ''
  };
  newProjectTagsInput = '';

  newEdu: EducationItem = { degree: '', institution: '', detail: '', period: '' };
  newExp: TimelineItem = { title: '', role: '', period: '', text: '' };
  newSkill: SkillItem = { name: '', value: 75, icon: 'code-outline' };

  constructor(
    private portfolioService: PortfolioDataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentData();
  }

  loadCurrentData(): void {
    this.profileForm = JSON.parse(JSON.stringify(this.portfolioService.profile()));
    this.aboutForm = JSON.parse(JSON.stringify(this.portfolioService.about()));
    this.projectsForm = JSON.parse(JSON.stringify(this.portfolioService.projects()));
    this.resumeForm = JSON.parse(JSON.stringify(this.portfolioService.resume()));
  }

  setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set('');
    }, 3500);
  }

  // --- Profile Actions ---
  saveProfile(): void {
    this.portfolioService.updateProfile(this.profileForm);
    this.showToast('Profile information saved successfully!');
  }

  // --- About Actions ---
  addBioParagraph(): void {
    this.aboutForm.bioParagraphs.push('');
  }

  removeBioParagraph(index: number): void {
    this.aboutForm.bioParagraphs.splice(index, 1);
  }

  addStat(): void {
    this.aboutForm.stats.push({
      icon: 'star-outline',
      value: '10+',
      label: 'New Stat',
      text: 'Description here'
    });
  }

  removeStat(index: number): void {
    this.aboutForm.stats.splice(index, 1);
  }

  addService(): void {
    if (!this.newService.title.trim()) return;
    const tags = this.newServiceTagInput
      ? this.newServiceTagInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Web'];
    
    this.aboutForm.services.push({
      ...this.newService,
      tags
    });

    this.newService = { title: '', icon: 'code-slash-outline', text: '', tags: [] };
    this.newServiceTagInput = '';
  }

  removeService(index: number): void {
    this.aboutForm.services.splice(index, 1);
  }

  addTechStack(): void {
    if (!this.newTech.name.trim()) return;
    this.aboutForm.techStack.push({ ...this.newTech });
    this.newTech = { name: '', iconClass: 'devicon-javascript-plain colored' };
  }

  removeTechStack(index: number): void {
    this.aboutForm.techStack.splice(index, 1);
  }

  saveAbout(): void {
    this.portfolioService.updateAbout(this.aboutForm);
    this.showToast('About & Services section saved successfully!');
  }

  // --- Projects Actions ---
  addProject(): void {
    if (!this.newProject.title.trim()) return;
    const tags = this.newProjectTagsInput
      ? this.newProjectTagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Web'];

    const newProj: ProjectItem = {
      ...this.newProject,
      id: Date.now().toString(),
      tags
    };

    this.projectsForm.projects.unshift(newProj);
    this.newProject = {
      title: '',
      category: 'Web Development',
      icon: 'desktop-outline',
      description: '',
      tags: [],
      image: 'assets/images/project-1.png',
      demoLink: '',
      githubLink: ''
    };
    this.newProjectTagsInput = '';
  }

  removeProject(index: number): void {
    this.projectsForm.projects.splice(index, 1);
  }

  saveProjects(): void {
    this.portfolioService.updateProjects(this.projectsForm);
    this.showToast('Projects saved successfully!');
  }

  // --- Resume Actions ---
  addEducation(): void {
    if (!this.newEdu.degree.trim()) return;
    this.resumeForm.education.push({ ...this.newEdu });
    this.newEdu = { degree: '', institution: '', detail: '', period: '' };
  }

  removeEducation(index: number): void {
    this.resumeForm.education.splice(index, 1);
  }

  addExperience(): void {
    if (!this.newExp.title.trim()) return;
    this.resumeForm.experiences.push({ ...this.newExp });
    this.newExp = { title: '', role: '', period: '', text: '' };
  }

  removeExperience(index: number): void {
    this.resumeForm.experiences.splice(index, 1);
  }

  addSkill(): void {
    if (!this.newSkill.name.trim()) return;
    this.resumeForm.skills.push({ ...this.newSkill });
    this.newSkill = { name: '', value: 75, icon: 'code-outline' };
  }

  removeSkill(index: number): void {
    this.resumeForm.skills.splice(index, 1);
  }

  saveResume(): void {
    this.portfolioService.updateResume(this.resumeForm);
    this.showToast('Resume & Skills saved successfully!');
  }

  trackByIndex(index: number): number {
    return index;
  }

  logout(): void {
    this.authService.logout();
  }
}
