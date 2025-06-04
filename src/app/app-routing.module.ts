import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { DirecteurRegisterComponent } from './auth/directeur-register/directeur-register.component';
import { RecruteurRegisterComponent } from './auth/recruteur-register/recruteur-register.component';
import {ProfileComponent} from './features/profile/profile.component';
import {CertificationsComponent} from './features/certifications/certifications.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {ProfileWizardComponent} from './features/profile-wizard/profile-wizard.component';
import {ProjectsComponent} from './features/projects/projects.component';
import {ProjectMediaComponent} from './features/project-media/project-media.component';
import {UserMediaService} from './_services/user-media.service';
import {UserMediaComponent} from './features/user-media/user-media.component';
import {
  ProjectMediaUploadComponentComponent
} from './features/project-media-upload-component/project-media-upload-component.component';
import {PortfolioComponent} from './features/portfolio/portfolio.component';
import { ResponsableListComponent } from './features/directeur/responsable-list/responsable-list.component';
import { ResponsableFormComponent } from './features/directeur/responsable-form/responsable-form.component';
import { ResponsableViewComponent } from './features/directeur/responsable-view/responsable-view.component';
import { AuthGuard } from './_guards/auth.guard';
import {LandingPageComponent} from './core/layout/landing-page/landing-page.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import {PortfolioSharedComponent} from './features/portfolio-shared/portfolio-shared.component';

const routes: Routes = [

  { path: '', component: LandingPageComponent },
  { path: 'landing-page', component: LandingPageComponent },



  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-register', component: UserRegisterComponent },

  { path: 'register/directeur', component: DirecteurRegisterComponent },
  { path: 'register/recruteur', component: RecruteurRegisterComponent },


  // Laureat || Apprenant routes
  { path: 'profile-wizard', component: ProfileWizardComponent, canActivate: [AuthGuard] },
  //route Test projects
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:projectId/media', component: ProjectMediaComponent },
  { path: 'projects/media', component: ProjectMediaComponent },
  //route Test Media
  { path: 'media', component: UserMediaComponent },
  { path: 'media/upload', component: ProjectMediaUploadComponentComponent },
  { path: 'media/:id', component: ProfileComponent },
  //route Portfolio
  { path: 'portfolio', component: PortfolioComponent , canActivate: [AuthGuard] },
  { path: 'portfolio-shared', component: PortfolioSharedComponent, canActivate: [AuthGuard] },



  //Responsable
  { path: 'dashboard', component: DashboardComponent },
  { path: 'certifications', component: CertificationsComponent },



  // Directeur routes
  { path: 'directeur/responsables', component: ResponsableListComponent },
  { path: 'directeur/responsables/create', component: ResponsableFormComponent },
  { path: 'directeur/responsables/edit/:id', component: ResponsableFormComponent },
  { path: 'directeur/responsables/view/:id', component: ResponsableViewComponent },




  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'userMedia', component: UserMediaComponent },


  // {
  //   path: 'profile-wizard',
  //   component: ProfileWizardComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'portfolio',
  //   component: PortfolioComponent,
  //   canActivate: [AuthGuard, ProfileCompletionGuard]
  // },

  // { path: '', redirectTo: 'portfolio', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
