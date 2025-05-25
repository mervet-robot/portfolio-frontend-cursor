import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SocialLink, SocialLinkRequest } from '../../../_models/social-link';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface SocialLinkDialogData {
  link?: SocialLink;
  availablePlatforms: string[];
  userId?: number; // Optional: pass userId if needed by dialog, though service calls use component's userId
}

@Component({
  selector: 'app-social-link-dialog',
  templateUrl: './social-link-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  // styleUrls: ['./social-link-dialog.component.scss'] // Add SCSS file if you create one
})
export class SocialLinkDialogComponent implements OnInit {
  socialLinkForm!: FormGroup;
  availablePlatforms: string[];
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SocialLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SocialLinkDialogData
  ) {
    this.availablePlatforms = data.availablePlatforms;
    this.isEditMode = !!data.link;
  }

  ngOnInit(): void {
    this.socialLinkForm = this.fb.group({
      platform: [this.data.link?.platform || '', Validators.required],
      url: [this.data.link?.url || '', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.socialLinkForm.valid) {
      const formValue = this.socialLinkForm.value;
      const result: SocialLinkRequest = {
        platform: formValue.platform,
        url: formValue.url
      };
      this.dialogRef.close(result);
    }
  }
} 