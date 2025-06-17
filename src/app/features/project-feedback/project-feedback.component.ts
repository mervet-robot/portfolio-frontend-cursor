import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FeedbackRequest, FeedbackResponse} from '../../_models/feedback';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FeedbackService} from '../../_services/feedback.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-feedback',
  standalone: false,
  templateUrl: './project-feedback.component.html',
  styleUrl: './project-feedback.component.scss'
})
export class ProjectFeedbackComponent  implements OnInit {
  feedbackForm: FormGroup;
  feedbacks: FeedbackResponse[] = [];
  projectId: number;
  isEditing = false;
  currentFeedbackId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProjectFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.projectId = data.projectId;
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required],
      technicalScore: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
      attitudeScore: [null, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    // We don't load feedbacks here because the responsable is only adding them.
    // If we wanted to show existing feedback, we would call a get method here.
  }

  submitFeedback(): void {
    if (!this.feedbackForm.valid) return;

    // Following the pattern from RespFeedbackComponent, using a hardcoded ID.
    const reviewerId = 1;
    const request: FeedbackRequest = {
      projectId: this.projectId,
      reviewerId: reviewerId,
      ...this.feedbackForm.value
    };

    // In this workflow, we are only creating, not updating.
    this.feedbackService.createFeedback(request).subscribe({
      next: (newFeedback) => {
        this.feedbacks.push(newFeedback);
        this.resetForm();
        this.showSuccess('Feedback submitted successfully');
        this.dialogRef.close(newFeedback); // Close dialog on success
      },
      error: (err) => this.showError('Failed to submit feedback', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private resetForm(): void {
    this.feedbackForm.reset();
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

