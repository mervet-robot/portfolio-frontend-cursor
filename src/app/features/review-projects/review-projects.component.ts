import { Component, OnInit } from '@angular/core';
import { ProjectSubmitService } from '../../_services/project-submit.service';
import { ProjectSubmitResponse } from '../../_models/project-submit';
import { ProjectSubmitStatus } from '../../_models/project-submit-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {FeedbackService} from '../../_services/feedback.service';
import {ProjectFeedbackComponent} from '../project-feedback/project-feedback.component';
import { ProfileService } from '../../_services/profile.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-review-projects',
  standalone: false,
  templateUrl: './review-projects.component.html',
  styleUrls: ['./review-projects.component.scss']
})
export class ReviewProjectsComponent implements OnInit {
  submittedProjects: ProjectSubmitResponse[] = [];
  isLoading = true;

  constructor(
    private projectSubmitService: ProjectSubmitService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private feedbackService: FeedbackService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadSubmittedProjects();
  }

  loadSubmittedProjects(): void {
    this.isLoading = true;
    this.projectSubmitService.getSubmittedProjects().subscribe({
      next: (projects) => {
        this.submittedProjects = projects;
        if (this.submittedProjects.length > 0) {
          const profileRequests = this.submittedProjects.map(project =>
            this.profileService.getProfile(project.profileId)
          );

          forkJoin(profileRequests).subscribe({
            next: (profiles) => {
              this.submittedProjects.forEach((project, index) => {
                const profile = profiles[index];
                if (profile) {
                  project.apprenantName = `${profile.firstName} ${profile.lastName}`.trim();
                }
              });
              this.isLoading = false;
            },
            error: (profileErr) => {
              this.showError('Failed to load apprenant profiles', profileErr);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.showError('Failed to load submitted projects', err);
        this.isLoading = false;
      }
    });
  }

  reviewProject(projectId: number, status: ProjectSubmitStatus): void {
    this.projectSubmitService.reviewProject(projectId, status).subscribe({
      next: (response) => {
        this.submittedProjects = this.submittedProjects.filter(p => p.id !== projectId);
        this.showSuccess(`Project has been ${status.toLowerCase()}`);

        // If validated, we might want to automatically open the feedback dialog
        if (status === ProjectSubmitStatus.VALIDATED && response.projectId) {
          this.openFeedbackDialog(response.projectId);
        }

      },
      error: (err) => this.showError('Failed to review project', err)
    });
  }


  openFeedbackDialog(projectId: number): void {
    const dialogRef = this.dialog.open(ProjectFeedbackComponent, {
      width: '600px',
      data: { projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('Feedback was submitted.');
      }
    });
  }


  getSubmitStatus(): typeof ProjectSubmitStatus {
    return ProjectSubmitStatus;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
