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
  AcademicProjectCard,
  ContactItem,
  SocialItem,
  getSkillIconByName
} from '../../services/portfolio-data.service';
import { AuthService } from '../../services/auth.service';
import { ContactService, ContactMessageItem } from '../../services/contact.service';

export type DashboardTab = 'profile' | 'about' | 'projects' | 'resume' | 'messages';

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
  contactMessages = signal<ContactMessageItem[]>([]);
  // Form Models initialized from service
  profileForm!: ProfileData;
  aboutForm!: AboutData;
  projectsForm!: ProjectsData;
  resumeForm!: ResumeData;

  // New items temp models
  newContact: ContactItem = { title: '', icon: 'mail-outline', value: '', type: 'link', href: '', datetime: '' };
  newSocial: SocialItem = { name: '', icon: 'logo-github', url: '' };

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
  newInternship: TimelineItem = { title: '', role: '', period: '', text: '' };
  newSkill: SkillItem = { name: '', value: 75, icon: 'code-outline' };

  newAcademicProject: AcademicProjectCard = {
    title: '',
    badge: '',
    icon: 'hardware-chip-outline',
    description: '',
    tags: [],
    features: []
  };
  newAcademicProjectTagsInput = '';
  newAcademicProjectFeaturesInput = '';

  constructor(
    private portfolioService: PortfolioDataService,
    private authService: AuthService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentData();
    this.fetchContactMessages();
  }

  loadCurrentData(): void {
    const p = this.portfolioService.profile();
    this.profileForm = JSON.parse(JSON.stringify(p));
    if (!this.profileForm.contacts) {
      this.profileForm.contacts = [];
    }
    if (!this.profileForm.socials) {
      this.profileForm.socials = [];
    }
    this.aboutForm = JSON.parse(JSON.stringify(this.portfolioService.about()));
    this.projectsForm = JSON.parse(JSON.stringify(this.portfolioService.projects()));
    this.resumeForm = JSON.parse(JSON.stringify(this.portfolioService.resume()));
    if (!this.resumeForm.education) this.resumeForm.education = [];
    if (!this.resumeForm.experiences) this.resumeForm.experiences = [];
    if (!this.resumeForm.internships) this.resumeForm.internships = [];
    if (!this.resumeForm.academicProjects) this.resumeForm.academicProjects = [];
    if (!this.resumeForm.skills) this.resumeForm.skills = [];
  }

  fetchContactMessages(): void {
    this.contactService.getMessages().subscribe({
      next: (list) => {
        if (list && Array.isArray(list)) {
          this.contactMessages.set(list);
        }
      },
      error: (err) => {
        console.warn('Could not fetch contact messages:', err);
      }
    });
  }

  setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
    if (tab === 'messages') {
      this.fetchContactMessages();
    }
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set('');
    }, 3500);
  }

  // --- Profile Actions ---
  onAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.profileForm) {
          this.profileForm.avatarUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    if (this.profileForm) {
      this.profileForm.avatarUrl = '';
    }
  }

  addContact(): void {
    if (!this.profileForm.contacts) {
      this.profileForm.contacts = [];
    }
    const title = (this.newContact.title || '').trim();
    const value = (this.newContact.value || '').trim();
    const icon = (this.newContact.icon || '').trim() || 'mail-outline';
    const type = this.newContact.type || 'link';
    const href = (this.newContact.href || '').trim();
    const datetime = (this.newContact.datetime || '').trim();

    this.profileForm.contacts.push({
      title: title || 'NEW CONTACT',
      icon: icon,
      value: value || 'info@example.com',
      type: type,
      href: href,
      datetime: datetime
    });

    this.newContact = { title: '', icon: 'mail-outline', value: '', type: 'link', href: '', datetime: '' };
  }

  removeContact(index: number): void {
    if (this.profileForm?.contacts) {
      this.profileForm.contacts.splice(index, 1);
    }
  }

  addSocial(): void {
    if (!this.profileForm.socials) {
      this.profileForm.socials = [];
    }
    const name = (this.newSocial.name || '').trim();
    const icon = (this.newSocial.icon || '').trim() || 'logo-github';
    const url = (this.newSocial.url || '').trim();

    this.profileForm.socials.push({
      name: name || 'New Platform',
      icon: icon,
      url: url || 'https://'
    });

    this.newSocial = { name: '', icon: 'logo-github', url: '' };
  }

  removeSocial(index: number): void {
    if (this.profileForm?.socials) {
      this.profileForm.socials.splice(index, 1);
    }
  }

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
  onNewProjectFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newProject.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onExistingProjectFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.projectsForm?.projects[index]) {
          this.projectsForm.projects[index].image = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

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

  addInternship(): void {
    if (!this.newInternship.title.trim()) return;
    this.resumeForm.internships.push({ ...this.newInternship });
    this.newInternship = { title: '', role: '', period: '', text: '' };
  }

  removeInternship(index: number): void {
    this.resumeForm.internships.splice(index, 1);
  }

  addAcademicProject(): void {
    if (!this.newAcademicProject.title.trim()) return;
    const tags = this.newAcademicProjectTagsInput
      ? this.newAcademicProjectTagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const features = this.newAcademicProjectFeaturesInput
      ? this.newAcademicProjectFeaturesInput.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    this.resumeForm.academicProjects.push({
      ...this.newAcademicProject,
      tags,
      features
    });

    this.newAcademicProject = {
      title: '',
      badge: '',
      icon: 'hardware-chip-outline',
      description: '',
      tags: [],
      features: []
    };
    this.newAcademicProjectTagsInput = '';
    this.newAcademicProjectFeaturesInput = '';
  }

  removeAcademicProject(index: number): void {
    this.resumeForm.academicProjects.splice(index, 1);
  }

  addSkill(): void {
    if (!this.newSkill.name.trim()) return;
    const name = this.newSkill.name.trim();
    const icon = (this.newSkill.icon || '').trim() || getSkillIconByName(name);

    this.resumeForm.skills.push({
      name,
      value: this.newSkill.value || 75,
      icon
    });
    this.newSkill = { name: '', value: 75, icon: '' };
  }

  onSkillNameChange(skill: SkillItem): void {
    if (skill.name && !skill.icon) {
      skill.icon = getSkillIconByName(skill.name);
    }
  }

  onNewSkillNameChange(): void {
    if (this.newSkill.name) {
      this.newSkill.icon = getSkillIconByName(this.newSkill.name);
    }
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
