import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AboutComponent } from '../../components/about/about.component';
import { ResumeComponent } from '../../components/resume/resume.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { PageStateService } from '../../services/page-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    AboutComponent,
    ResumeComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly pageState = inject(PageStateService);
}
