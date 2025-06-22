import { Component, OnInit } from '@angular/core';
import { ProjectSubmitService } from '../../_services/project-submit.service';
import { ProjectSubmitResponse } from '../../_models/project-submit';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectSubmitStatus } from '../../_models/project-submit-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFeedbackComponent } from '../project-feedback/project-feedback.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-validated-projects-history',
  templateUrl: './validated-projects-history.component.html',
  styleUrls: ['./validated-projects-history.component.scss'],
  standalone: false
})
export class ValidatedProjectsHistoryComponent implements OnInit {
  reviewedProjects: ProjectSubmitResponse[] = [];
  isLoading = true;

  constructor(
    private projectSubmitService: ProjectSubmitService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReviewedProjects();
  }

  openFeedbackDialog(projectId: number, feedback: string): void {
    this.dialog.open(ProjectFeedbackComponent, {
      width: '600px',
      data: { projectId, feedbackContent: feedback }
    });
  }

  loadReviewedProjects(): void {
    this.isLoading = true;
    this.projectSubmitService.getReviewedProjects().subscribe({
      next: (projects) => {
        this.reviewedProjects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load reviewed projects', err);
        this.isLoading = false;
      }
    });
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

  goBack(): void {
    this.router.navigate(['/review-projects']);
  }
}
