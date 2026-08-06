import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed, OnInit } from '@angular/core';
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
  messageSearchQuery = signal<string>('');
  messageTimeFilter = signal<'all' | 'today' | 'week' | 'month'>('all');
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  selectedMessage = signal<ContactMessageItem | null>(null);

  selectedMessageIds = signal<number[]>([]);
  readMessageIds = signal<number[]>([]);

  unreadMessagesCount = computed(() => {
    const readSet = new Set(this.readMessageIds());
    return this.contactMessages().filter((m) => m.id && !readSet.has(m.id)).length;
  });

  isAllSelected = computed(() => {
    const list = this.filteredMessages();
    if (list.length === 0) return false;
    const selected = new Set(this.selectedMessageIds());
    return list.every((m) => m.id && selected.has(m.id));
  });

  totalMessagesCount = computed(() => this.contactMessages().length);

  todayMessagesCount = computed(() => {
    const todayStr = new Date().toDateString();
    return this.contactMessages().filter(
      (m) => m.createdAt && new Date(m.createdAt).toDateString() === todayStr
    ).length;
  });

  thisWeekMessagesCount = computed(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.contactMessages().filter(
      (m) => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo
    ).length;
  });

  lastMonthMessagesCount = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.contactMessages().filter(
      (m) => m.createdAt && new Date(m.createdAt) >= thirtyDaysAgo
    ).length;
  });

  filteredMessages = computed(() => {
    const query = this.messageSearchQuery().toLowerCase().trim();
    const filter = this.messageTimeFilter();
    let msgs = this.contactMessages();

    if (filter === 'today') {
      const todayStr = new Date().toDateString();
      msgs = msgs.filter((m) => m.createdAt && new Date(m.createdAt).toDateString() === todayStr);
    } else if (filter === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      msgs = msgs.filter((m) => m.createdAt && new Date(m.createdAt) >= sevenDaysAgo);
    } else if (filter === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      msgs = msgs.filter((m) => m.createdAt && new Date(m.createdAt) >= thirtyDaysAgo);
    }

    if (!query) return msgs;
    return msgs.filter(
      (m) =>
        (m.fullname && m.fullname.toLowerCase().includes(query)) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        (m.message && m.message.toLowerCase().includes(query))
    );
  });

  paginatedMessages = computed(() => {
    const list = this.filteredMessages();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  totalPages = computed(() => {
    const total = this.filteredMessages().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  pageNumbers = computed(() => {
    const pages: number[] = [];
    const total = this.totalPages();
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  });

  get paginationStartIndex(): number {
    if (this.filteredMessages().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  get paginationEndIndex(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.filteredMessages().length);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(1);
  }

  openMessageModal(msg: ContactMessageItem): void {
    this.selectedMessage.set(msg);
  }

  closeMessageModal(): void {
    this.selectedMessage.set(null);
  }

  deleteContactMessage(id?: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!id) {
      this.showToast('Unable to delete message: missing message ID.');
      return;
    }
    if (confirm('Are you sure you want to delete this contact message?')) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          this.showToast('Contact message deleted successfully!');
          if (this.selectedMessage()?.id === id) {
            this.selectedMessage.set(null);
          }
          this.fetchContactMessages();
        },
        error: (err) => {
          console.error('Failed to delete message:', err);
          this.showToast('Failed to delete message.');
        }
      });
    }
  }
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
    this.loadReadMessageIds();
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
          this.currentPage.set(1);
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

  getServiceTagsString(service: ServiceItem): string {
    return service.tags ? service.tags.join(', ') : '';
  }

  setServiceTagsString(service: ServiceItem, value: string): void {
    service.tags = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : [];
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

  exportMessagesCSV(): void {
    const list = this.filteredMessages();
    if (list.length === 0) {
      this.showToast('No messages available to export.');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Message', 'Date & Time'];
    const rows = list.map((m, idx) => [
      m.id || idx + 1,
      `"${(m.fullname || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
      `"${m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_messages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`Exported ${list.length} messages to CSV!`);
  }

  exportMessagesJSON(): void {
    const list = this.filteredMessages();
    if (list.length === 0) {
      this.showToast('No messages available to export.');
      return;
    }
    const jsonString = JSON.stringify(list, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_messages_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`Exported ${list.length} messages to JSON!`);
  }

  loadReadMessageIds(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('admin_read_message_ids');
      if (stored) {
        this.readMessageIds.set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load read message IDs', e);
    }
  }

  isRead(id?: number): boolean {
    if (!id) return false;
    return this.readMessageIds().includes(id);
  }

  toggleMessageRead(id?: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (!id) return;
    const current = this.readMessageIds();
    let updated: number[];
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    this.readMessageIds.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_read_message_ids', JSON.stringify(updated));
    }
  }

  markAllAsRead(): void {
    const allIds = this.contactMessages()
      .map((m) => m.id)
      .filter((id): id is number => id !== undefined);
    this.readMessageIds.set(allIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_read_message_ids', JSON.stringify(allIds));
    }
    this.showToast('All messages marked as read!');
  }

  isSelected(id?: number): boolean {
    if (!id) return false;
    return this.selectedMessageIds().includes(id);
  }

  toggleSelectMessage(id?: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (!id) return;
    const current = this.selectedMessageIds();
    if (current.includes(id)) {
      this.selectedMessageIds.set(current.filter((item) => item !== id));
    } else {
      this.selectedMessageIds.set([...current, id]);
    }
  }

  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      const allIds = this.filteredMessages()
        .map((m) => m.id)
        .filter((id): id is number => id !== undefined);
      this.selectedMessageIds.set(allIds);
    } else {
      this.selectedMessageIds.set([]);
    }
  }

  deleteSelectedMessages(): void {
    const ids = this.selectedMessageIds();
    if (ids.length === 0) return;
    if (confirm(`Are you sure you want to delete ${ids.length} selected message(s)?`)) {
      let count = 0;
      ids.forEach((id) => {
        this.contactService.deleteMessage(id).subscribe({
          next: () => {
            count++;
            if (count === ids.length) {
              this.showToast(`Successfully deleted ${count} message(s)!`);
              this.selectedMessageIds.set([]);
              this.fetchContactMessages();
            }
          },
          error: (err) => console.error(`Error deleting message ${id}:`, err)
        });
      });
    }
  }

  backupFullPortfolioJSON(): void {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.profileForm,
      about: this.aboutForm,
      projects: this.projectsForm,
      resume: this.resumeForm
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Complete portfolio backup JSON exported!');
  }

  triggerRestoreJSON(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  restorePortfolioJSON(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.profile) {
          this.profileForm = parsed.profile;
          this.portfolioService.updateProfile(this.profileForm);
        }
        if (parsed.about) {
          this.aboutForm = parsed.about;
          this.portfolioService.updateAbout(this.aboutForm);
        }
        if (parsed.projects) {
          this.projectsForm = parsed.projects;
          this.portfolioService.updateProjects(this.projectsForm);
        }
        if (parsed.resume) {
          this.resumeForm = parsed.resume;
          this.portfolioService.updateResume(this.resumeForm);
        }
        this.showToast('Portfolio data restored successfully from backup!');
      } catch (err) {
        console.error('Failed to restore JSON:', err);
        this.showToast('Failed to parse JSON file. Please ensure it is a valid backup.');
      }
    };
    reader.readAsText(file);
  }

  logout(): void {
    this.authService.logout();
  }
}
