import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {MediaType, UserMedia} from '../../_models/user-media';
import {UserMediaService} from '../../_services/user-media.service';
import {TokenService} from '../../_services/token.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-user-media',
  standalone: false,
  templateUrl: './user-media.component.html',
  styleUrls: ['./user-media.component.scss'] // <-- Fixed here (styleUrls)
})
export class UserMediaComponent implements OnInit {
  profileId!: number;
  userId: number;
  mediaTypes = Object.values(MediaType);
  selectedFiles: File[] = [];
  selectedMediaType: MediaType = MediaType.IMAGE;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  userMediaForm!: FormGroup;
  mediaList: UserMedia[] = [];

  // Add to your component class --Suggestion
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
    private route: ActivatedRoute,
    private userMediaService: UserMediaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tokenService: TokenService,
  ) { this.userId = this.tokenService.getUser().id;}

  ngOnInit(): void {
    this.initForms();
    this.loadMedia();

  }


  initForms(): void {
    this.userMediaForm = this.fb.group({
      fileName: ['', Validators.required],
      filePath: ['',],
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

  loadMedia(): void {
    this.userMediaService.getProjectMediaP(this.userId).subscribe({
      next: (media) => this.mediaList = media,
      error: (err) => this.showError('Failed to load media', err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  // New properties for form fields
  titre = '';
  description = '';
  category = '';
  verified = false;


  uploadMedia() {
    if (!this.selectedFiles.length || !this.selectedMediaType) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Upload each file
    this.selectedFiles.forEach(file => {
      this.userMediaService.uploadMediaP(
        this.userId, file, this.selectedMediaType, this.titre, this.description, this.category, this.verified).subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
          } else if (event.type === HttpEventType.Response) {
            this.isUploading = false;
            this.loadMedia();
            this.resetForm();
          }
        },
        error => {
          this.isUploading = false;
          console.error('Upload failed:', error);
        }
      );
    });
  }


  //Pour Vider les Champs
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
        title: 'Delete Media',
        message: 'Are you sure you want to delete this media?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userMediaService.deleteMediaP(mediaId).subscribe({
          next: () => {
            this.mediaList = this.mediaList.filter(m => m.id !== mediaId);
            this.showSuccess('Media deleted successfully');
          },
          error: (err) => this.showError('Failed to delete media', err)
        });
      }
    });
  }

  downloadMedia(media: UserMedia): void {
    this.userMediaService.downloadMediaP(media.id).subscribe({
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
      error: (err) => this.showError('Failed to download media', err)
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


  //-----------------ADD FILTER AND RESEARCH

  // In user-media.component.ts
// Add these new properties
  selectedCategory: string = '';
  searchQuery: string = '';

// Add these new methods
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchByTitle(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.searchQuery) {
      this.userMediaService.searchProjectMedia(this.userId, this.searchQuery).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to search media', err)
      });
    } else if (this.selectedMediaType && this.selectedCategory) {
      this.userMediaService.getProjectMediaByTypeAndCategory(this.userId, this.selectedMediaType, this.selectedCategory).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter media', err)
      });
    } else if (this.selectedCategory) {
      this.userMediaService.getProjectMediaByCategory(this.userId, this.selectedCategory).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter media', err)
      });
    } else if (this.selectedMediaType) {
      this.userMediaService.getProjectMediaByType(this.userId, this.selectedMediaType).subscribe({
        next: (media) => this.mediaList = media,
        error: (err) => this.showError('Failed to filter media', err)
      });
    } else {
      this.loadMedia(); // Reset to all media if no filters
    }
  }

// Reset all filters
  resetFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.loadMedia();
  }


}
