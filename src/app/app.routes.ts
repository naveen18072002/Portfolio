import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'thank-you', component: ThankYouComponent },
  { path: '**', redirectTo: '' }
];
