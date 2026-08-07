import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { PortfolioDataService } from './services/portfolio-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreenComponent],
  template: `
    <app-loading-screen [visible]="portfolioService.isLoading()"></app-loading-screen>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  readonly portfolioService = inject(PortfolioDataService);
}
