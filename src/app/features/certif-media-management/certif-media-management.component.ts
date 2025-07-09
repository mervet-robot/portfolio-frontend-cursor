import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {MediaType, CertifMedia} from '../../_models/certif-media';
import {CertifMediaService} from '../../_services/certif-media.service';
import {TokenService} from '../../_services/token.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-certif-media-management',
  standalone: false,
  templateUrl: './certif-media-management.component.html',
  styleUrls: ['./certif-media-management.component.scss']
})
export class CertifMediaManagementComponent implements OnInit {
  username: string = ''; // New property for username input
  mediaTypes = Object.values(MediaType);
  selectedFiles: File[] = [];
  selectedMediaType: MediaType = MediaType.IMAGE;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  certifMediaForm!: FormGroup;
  mediaList: CertifMedia[] = [];

  docCategories = [
    'Project Management',
    'Software Architecture',
    'Security',
    'Machine Learning',
    'Data Science',
    'Cloud Computing',
    'Mobile Development',
    'Testing & QA',
    'UI/UX Design',
    'Networking',
    'Blockchain',
    'Other'
  ];



  constructor(
    private fb: FormBuilder,
    private certifMediaService: CertifMediaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.initForms();
    // No initial load needed as responsable will search by username
  }


  initForms(): void {
    this.certifMediaForm = this.fb.group({
      username: ['', Validators.required],
      fileName: ['', Validators.required],
      filePath: [''],
      fileType: [''],
      fileSize: [''],
      mediaType: [''],
      uploadDate: [''],
      titre :[''],
      description : [''],
      category : [''],
      verified : false,
    });
  }

  loadMediaByUsername(): void {
    if (!this.username) {
      this.showError('Please enter a username to load media.', null);
      return;
    }
    this.certifMediaService.getCertifMedia(this.username).subscribe({
      next: (media) => this.mediaList = media,
      error: (err) => this.showError('Failed to load media for user: ' + this.username, err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  titre = '';
  description = '';
  category = '';
  verified = false;


  uploadMedia() {
    if (!this.selectedFiles.length || !this.selectedMediaType || !this.username) {
      this.showError('Please select files, media type, and enter a username.', null);
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.selectedFiles.forEach(file => {
      this.certifMediaService.uploadCertifMedia(
        this.username, file, this.selectedMediaType, this.titre, this.description, this.category, this.verified).subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
          } else if (event.type === HttpEventType.Response) {
            this.isUploading = false;
            this.loadMediaByUsername(); // Reload media after successful upload
            this.resetForm();
          }
        },
        error => {
          this.isUploading = false;
          console.error('Upload failed:', error);
          this.showError('Upload failed: ' + error.message, error);
        }
      );
    });
  }

  resetForm() {
    this.selectedFiles = [];
    this.titre = '';
    this.description = '';
    this.category = '';
    this.verified = false;
    this.uploadProgress = 0;
  }

  deleteMedia(mediaId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Certif Media',
        message: 'Are you sure you want to delete this certification media?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.certifMediaService.deleteCertifMedia(mediaId).subscribe({
          next: () => {
            this.mediaList = this.mediaList.filter(m => m.id !== mediaId);
            this.showSuccess('Certif Media deleted successfully');
          },
          error: (err) => this.showError('Failed to delete certif media', err)
        });
      }
    });
  }

  downloadMedia(media: CertifMedia): void {
    this.certifMediaService.downloadCertifMedia(media.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = media.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => this.showError('Failed to download certif media', err)
    });
  }

  getMediaIcon(mediaType: MediaType): string {
    switch (mediaType) {
      case MediaType.IMAGE: return 'image';
      case MediaType.DOCUMENT: return 'description';
      case MediaType.VIDEO: return 'videocam';
      case MediaType.PRESENTATION: return 'slideshow';
      case MediaType.CODE: return 'code';
      default: return 'insert_drive_file';
    }
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

  selectedCategory: string = '';
  searchQuery: string = '';

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchByTitle(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.username) {
      this.showError('Please enter a username to apply filters.', null);
      return;
    }

    if (this.searchQuery) {
      this.certifMediaService.searchCertifMedia(this.username, this.searchQuery).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to search certif media', err)
      });
    } else if (this.selectedMediaType && this.selectedCategory) {
      this.certifMediaService.getCertifMediaByTypeAndCategory(this.username, this.selectedMediaType, this.selectedCategory).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter certif media', err)
      });
    } else if (this.selectedCategory) {
      this.certifMediaService.getCertifMediaByCategory(this.username, this.selectedCategory).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter certif media', err)
      });
    } else if (this.selectedMediaType) {
      this.certifMediaService.getCertifMediaByType(this.username, this.selectedMediaType).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter certif media', err)
      });
    } else {
      this.loadMediaByUsername();
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.selectedMediaType = MediaType.IMAGE;
    this.loadMediaByUsername();
  }
} 