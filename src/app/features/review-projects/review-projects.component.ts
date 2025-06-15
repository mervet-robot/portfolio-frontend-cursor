import { Component, OnInit } from '@angular/core';
import { ProjectSubmitService } from '../../_services/project-submit.service';
import { ProjectSubmitResponse } from '../../_models/project-submit';
import { ProjectSubmitStatus } from '../../_models/project-submit-status.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadSubmittedProjects();
  }

  loadSubmittedProjects(): void {
    this.isLoading = true;
    this.projectSubmitService.getSubmittedProjects().subscribe({
      next: (projects) => {
        this.submittedProjects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load submitted projects', err);
        this.isLoading = false;
      }
    });
  }

  reviewProject(projectId: number, status: ProjectSubmitStatus): void {
    this.projectSubmitService.reviewProject(projectId, status).subscribe({
      next: () => {
        this.submittedProjects = this.submittedProjects.filter(p => p.id !== projectId);
        this.showSuccess(`Project has been ${status.toLowerCase()}`);
      },
      error: (err) => this.showError('Failed to review project', err)
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
