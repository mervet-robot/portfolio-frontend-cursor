import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { DirecteurRegisterComponent } from './auth/directeur-register/directeur-register.component';
import { RecruteurRegisterComponent } from './auth/recruteur-register/recruteur-register.component';
import {ProfileComponent} from './features/profile/profile.component';
import {ProfileWizardComponent} from './features/profile-wizard/profile-wizard.component';
import {ProjectsComponent} from './features/projects/projects.component';
import {ProjectMediaComponent} from './features/project-media/project-media.component';
import {UserMediaComponent} from './features/user-media/user-media.component';

import {PortfolioComponent} from './features/portfolio/portfolio.component';
import { ResponsableListComponent } from './features/directeur/responsable-list/responsable-list.component';
import { ResponsableFormComponent } from './features/directeur/responsable-form/responsable-form.component';
import { ResponsableViewComponent } from './features/directeur/responsable-view/responsable-view.component';
import { AuthGuard } from './_guards/auth.guard';
import {LandingPageComponent} from './core/layout/landing-page/landing-page.component';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import {PortfolioSharedComponent} from './features/portfolio-shared/portfolio-shared.component';
import {DashboardComponent} from './features/responsable/dashboard/dashboard.component';
import {CertificationsComponent} from './features/responsable/certifications/certifications.component';
import {RespProjectsComponent} from './features/responsable/resp-projects/resp-projects.component';
import {RespProjectMediaComponent} from './features/responsable/resp-project-media/resp-project-media.component';
import {UserListComponent} from './features/recruteur/user-list/user-list.component';
import {ReviewProjectsComponent} from './features/review-projects/review-projects.component';
import {
  ValidatedProjectsHistoryComponent
} from './features/validated-projects-history/validated-projects-history.component';
import {
  SubmittedProjectsHistoryComponent
} from './features/submitted-projects-history/submitted-projects-history.component';
import {CertifMediaManagementComponent} from "./features/certif-media-management/certif-media-management.component";

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

  { path: 'apprenant/submitted-projects', component: SubmittedProjectsHistoryComponent },


  //route Test Media
  { path: 'media', component: UserMediaComponent },
  { path: 'media/:id', component: ProfileComponent },

  //route Portfolio
  { path: 'portfolio', component: PortfolioComponent , canActivate: [AuthGuard] },
  { path: 'portfolio-shared', component: PortfolioSharedComponent, canActivate: [AuthGuard] },
  { path: 'portfolio-shared/:id', component: PortfolioSharedComponent, canActivate: [AuthGuard] },



  //Responsable
  { path: 'dashboard', component: DashboardComponent },
  { path: 'certifications', component: CertificationsComponent },
  { path: 'responsable/certif-media', component: CertifMediaManagementComponent , canActivate: [AuthGuard] },


  { path: 'responsable/projects', component: RespProjectsComponent },
  { path: 'responsable/projects/:projectId/media', component: RespProjectMediaComponent },

  { path: 'review-projects', component: ReviewProjectsComponent },
  { path: 'responsable/validated', component: ValidatedProjectsHistoryComponent },


//Recruteur
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-list', component: UserListComponent },



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
