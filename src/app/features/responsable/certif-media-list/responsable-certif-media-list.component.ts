import { Component, OnInit } from '@angular/core';
import { CertifMediaService } from '../../../_services/certif-media.service';
import { CertifMedia, MediaType } from '../../../_models/certif-media';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CertificationService } from '../../../_services/certification.service';
import { CertificationResponse } from '../../../_models/certification';

@Component({
  selector: 'app-responsable-certif-media-list',
  standalone: false,
  templateUrl: './responsable-certif-media-list.component.html',
  styleUrls: ['./responsable-certif-media-list.component.scss']
})
export class ResponsableCertifMediaListComponent implements OnInit {
  mediaList: CertifMedia[] = [];
  mediaTypes = Object.values(MediaType);
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

  selectedMediaType: MediaType | '' = '';
  selectedCategory: string = '';
  searchQuery: string = '';

  constructor(
    private certifMediaService: CertifMediaService,
    private snackBar: MatSnackBar,
    private certificationService: CertificationService
  ) { }

  ngOnInit(): void {
    this.loadAllCertifMedia();
  }

  loadAllCertifMedia(): void {
    this.certifMediaService.getAllCertifMedia().subscribe({
      next: (media: CertifMedia[]) => this.mediaList = media,
      error: (err: any) => this.showError('Failed to load all certification media.', err)
    });
  }

  applyFilters(): void {
    let filteredList = [...this.mediaList]; // Create a copy to filter

    if (this.selectedMediaType) {
      filteredList = filteredList.filter(media => media.mediaType === this.selectedMediaType);
    }

    if (this.selectedCategory) {
      filteredList = filteredList.filter(media => media.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      filteredList = filteredList.filter(media => 
        media.titre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.mediaList = filteredList;
  }

  resetFilters(): void {
    this.selectedMediaType = '';
    this.selectedCategory = '';
    this.searchQuery = '';
    this.loadAllCertifMedia(); // Reload all media to reset filters
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

  downloadMedia(media: CertifMedia): void {
    this.certifMediaService.downloadCertifMedia(media.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = media.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err: any) => this.showError('Failed to download certif media', err)
    });
  }

  addMediaAsCertification(userId: number, certifMediaId: number): void {
    this.certificationService.createCertificationFromMedia(userId, certifMediaId).subscribe({
      next: (certification: CertificationResponse) => {
        this.snackBar.open('Certification added to user portfolio successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Optionally, you might want to refresh the media list or update UI
        // this.loadAllCertifMedia();
      },
      error: (err: any) => {
        console.error('Failed to add media as certification:', err);
        this.showError('Failed to add media as certification: ' + (err.error?.message || err.message), err);
      }
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