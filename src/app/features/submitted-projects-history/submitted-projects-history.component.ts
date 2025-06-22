import { Component, OnInit } from '@angular/core';
import { ProjectSubmitService } from '../../_services/project-submit.service';
import { ProjectSubmitResponse } from '../../_models/project-submit';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-submitted-projects-history',
  templateUrl: './submitted-projects-history.component.html',
  styleUrls: ['./submitted-projects-history.component.scss'],
  standalone: false
})
export class SubmittedProjectsHistoryComponent implements OnInit {
  submittedProjects: ProjectSubmitResponse[] = [];
  isLoading = true;
  apprenantId: number = 1; // This should ideally come from an authentication service

  constructor(
    private projectSubmitService: ProjectSubmitService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadSubmittedProjects();
  }

  loadSubmittedProjects(): void {
    this.isLoading = true;
    this.projectSubmitService.getSubmittedProjectsByProfileId(this.apprenantId).subscribe({
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
    this.router.navigate(['/projects']);
  }
}
