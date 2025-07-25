import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { ProfileComponent } from './features/profile/profile.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { ProfileWizardComponent } from './features/profile-wizard/profile-wizard.component';
import {MatProgressBar} from '@angular/material/progress-bar';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import {MatChip, MatChipListbox} from '@angular/material/chips';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './features/confirmation-dialog/confirmation-dialog.component';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';

import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ProjectsComponent } from './features/projects/projects.component';
import { ProjectMediaComponent } from './features/project-media/project-media.component';
import { ProjectMediaUploadComponentComponent } from './features/project-media-upload-component/project-media-upload-component.component';
import { FileSizePipe } from './shared/pipes/file-size.pipe';
import { UserMediaComponent } from './features/user-media/user-media.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { BioCorrectionDialogComponent } from './features/bio-correction-dialog/bio-correction-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ResponsableViewComponent} from './features/directeur/responsable-view/responsable-view.component';
import {ResponsableListComponent} from './features/directeur/responsable-list/responsable-list.component';
import {ResponsableFormComponent} from './features/directeur/responsable-form/responsable-form.component';
import {DirecteurRegisterComponent} from './auth/directeur-register/directeur-register.component';
import { RecruteurRegisterComponent } from './auth/recruteur-register/recruteur-register.component';
import { LandingPageComponent } from './core/layout/landing-page/landing-page.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { UserRegisterComponent } from './auth/user-register/user-register.component';
import { MatRadioModule } from '@angular/material/radio';
import { PortfolioSharedComponent } from './features/portfolio-shared/portfolio-shared.component';
import { MatPaginator } from '@angular/material/paginator';
import {DashboardComponent} from './features/responsable/dashboard/dashboard.component';
import {CertificationsComponent} from './features/responsable/certifications/certifications.component';
import {RespProjectsComponent} from "./features/responsable/resp-projects/resp-projects.component";
import {RespProjectMediaComponent} from "./features/responsable/resp-project-media/resp-project-media.component";
import {RespFeedbackComponent} from "./features/responsable/resp-feedback/resp-feedback.component";
import {UserListComponent} from './features/recruteur/user-list/user-list.component';
import { ReviewProjectsComponent } from './features/review-projects/review-projects.component';
import { ProjectFeedbackComponent } from './features/project-feedback/project-feedback.component';
import {
  ValidatedProjectsHistoryComponent
} from './features/validated-projects-history/validated-projects-history.component';
import {
  SubmittedProjectsHistoryComponent
} from './features/submitted-projects-history/submitted-projects-history.component';
import {CertifMediaManagementComponent} from './features/certif-media-management/certif-media-management.component';
import {ResponsableCertifMediaListComponent} from './features/responsable/certif-media-list/responsable-certif-media-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserRegisterComponent,

    DirecteurRegisterComponent,
    RecruteurRegisterComponent,

    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ProfileComponent,
    CertificationsComponent,
    DashboardComponent,
    ProfileWizardComponent,
    PortfolioComponent,
    ConfirmationDialogComponent,
    ProjectsComponent,
    ProjectMediaComponent,
    ProjectMediaUploadComponentComponent,
    FileSizePipe,
    UserMediaComponent,
    BioCorrectionDialogComponent,

    ResponsableViewComponent,
    ResponsableListComponent,
    ResponsableFormComponent,
    LandingPageComponent,
    PortfolioSharedComponent,
    RespProjectsComponent,
    RespProjectMediaComponent,
    RespFeedbackComponent,
    UserListComponent,
    ReviewProjectsComponent,
    ProjectFeedbackComponent,

    ValidatedProjectsHistoryComponent,
    SubmittedProjectsHistoryComponent,

    CertifMediaManagementComponent,
    ResponsableCertifMediaListComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,

    MatMenuModule,
    MatTableModule,

    MatDialogModule,

    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBar,
    MatChipListbox,
    MatChip,
    MatCheckbox,
    MatAutocompleteTrigger,
    MatAutocomplete,

    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,

    MatTooltipModule,

    MatButtonToggleModule,
    NgOptimizedImage,

    MatExpansionModule,
    MatPaginator,

  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
