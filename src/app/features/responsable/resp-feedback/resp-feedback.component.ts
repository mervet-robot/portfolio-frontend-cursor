import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RespFeedbackService } from '../../../_services/resp-feedback.service';
import { RespFeedbackRequest, RespFeedbackResponse } from '../../../_models/resp-feedback';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-resp-feedback',
  standalone: false,
  templateUrl: './resp-feedback.component.html',
  styleUrls: ['./resp-feedback.component.scss']
})
export class RespFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  feedbacks: RespFeedbackResponse[] = [];
  projectId: number;
  isEditing = false;
  currentFeedbackId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<RespFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private fb: FormBuilder,
    private feedbackService: RespFeedbackService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.projectId = data.projectId;
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required],
      technicalScore: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      attitudeScore: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbackByProjectId(this.projectId).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
      },
      error: (err) => {
        this.showError('Failed to load feedbacks', err);
      }
    });
  }

  submitFeedback(): void {
    if (!this.feedbackForm.valid) return;

    const reviewerId = 1; // Replace with actual logged-in user ID
    const request: RespFeedbackRequest = {
      respProjectId: this.projectId,
      reviewerId: reviewerId,
      ...this.feedbackForm.value
    };

    if (this.isEditing && this.currentFeedbackId) {
      // Update existing feedback
      this.feedbackService.updateFeedback(this.currentFeedbackId, request).subscribe({
        next: (updatedFeedback) => {
          const index = this.feedbacks.findIndex(f => f.id === this.currentFeedbackId);
          if (index > -1) {
            this.feedbacks[index] = updatedFeedback;
          }
          this.resetForm();
          this.showSuccess('Feedback updated successfully');
        },
        error: (err) => this.showError('Failed to update feedback', err)
      });
    } else {
      // Create new feedback
      this.feedbackService.createFeedback(request).subscribe({
        next: (newFeedback) => {
          this.feedbacks.push(newFeedback);
          this.resetForm();
          this.showSuccess('Feedback submitted successfully');
        },
        error: (err) => this.showError('Failed to submit feedback', err)
      });
    }
  }

  startEdit(feedback: RespFeedbackResponse): void {
    this.isEditing = true;
    this.currentFeedbackId = feedback.id;
    this.feedbackForm.patchValue({
      comment: feedback.comment,
      technicalScore: feedback.technicalScore,
      attitudeScore: feedback.attitudeScore
    });
  }

  deleteFeedback(feedbackId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Media',
        message: 'Are you sure you want to delete this media?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
    // Optionally, add a confirmation dialog here
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
        this.showSuccess('Feedback deleted successfully');
      },
      error: (err) => this.showError('Failed to delete feedback', err)
    });
      }
    });
  }




  onCancel(): void {
    if (this.isEditing) {
      this.resetForm();
    } else {
      this.dialogRef.close();
    }
  }

  private resetForm(): void {
    this.feedbackForm.reset();
    this.isEditing = false;
    this.currentFeedbackId = null;
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
