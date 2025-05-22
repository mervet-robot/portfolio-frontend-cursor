import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserMediaService} from '../../_services/user-media.service';
import {TokenService} from '../../_services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-media-upload-component',
  standalone: false,
  templateUrl: './project-media-upload-component.component.html',
  styleUrl: './project-media-upload-component.component.scss'
})
export class ProjectMediaUploadComponentComponent  {
  // uploadForm: FormGroup;
  // currentUserId: number;
  // selectedFile: File | null = null;
  // uploadProgress: number | null = null;
  //
  // constructor(
  //   private fb: FormBuilder,
  //   private mediaService: UserMediaService,
  //   private tokenService: TokenService,
  //   private router: Router
  // ) {
  //   this.currentUserId = this.tokenService.getUser().id;
  //   this.uploadForm = this.fb.group({
  //     title: ['', Validators.required],
  //     description: [''],
  //     mediaType: ['PHOTO', Validators.required],
  //     isPublic: [false]
  //   });
  // }
  //
  // ngOnInit(): void {}
  //
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  // }
  //
  // onSubmit(): void {
  //   if (this.uploadForm.invalid || !this.selectedFile) {
  //     return;
  //   }
  //
  //   // In a real app, you would upload the file first and get the file path
  //   // For this example, we'll simulate it
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  //
  //   // Simulate file upload
  //   // In a real app, you would call your file upload service here
  //   setTimeout(() => {
  //     const mediaRequest = {
  //       fileName: this.selectedFile?.name || '',
  //       fileType: this.selectedFile?.type || '',
  //       filePath: `/uploads/${this.selectedFile?.name}`,
  //       title: this.uploadForm.value.title,
  //       description: this.uploadForm.value.description,
  //       mediaType: this.uploadForm.value.mediaType,
  //       isPublic: this.uploadForm.value.isPublic
  //     };
  //
  //     this.mediaService.uploadMedia(this.currentUserId, mediaRequest).subscribe({
  //       next: () => {
  //         this.router.navigate(['/media']);
  //       },
  //       error: (err) => {
  //         console.error('Error uploading media:', err);
  //       }
  //     });
  //   }, 1000);
  // }
}
