import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../_services/token.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Experience} from '../../_models/experience';
import {Formation} from '../../_models/formation';
import {SoftSkillRequest, SoftSkillResponse} from '../../_models/soft-skill';
import {SkillLevel, TechSkillRequest, TechSkillResponse} from '../../_models/tech-skill';
import {CertificationRequest, CertificationResponse} from '../../_models/certification';
import {ProjectRequest, ProjectResponse, ProjectStatus} from '../../_models/project';
import {ProfileService} from '../../_services/profile.service';
import {ExperienceService} from '../../_services/experience.service';
import {FormationService} from '../../_services/formation.service';
import {SoftSkillService} from '../../_services/soft-skill.service';
import {LanguageService} from '../../_services/language.service';
import {TechSkillService} from '../../_services/tech-skill.service';
import {CertificationService} from '../../_services/certification.service';
import {ProjectService} from '../../_services/project.service';
import { Router } from '@angular/router';
import {ProfileUpdateRequest} from '../../_models/profile';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {CertificationType, LanguageRequest, LanguageResponse, ProficiencyLevel} from '../../_models/language';
import {BioCorrectionDialogComponent} from '../bio-correction-dialog/bio-correction-dialog.component';
import { Centre } from '../../_models/centre.enum';
import { SocialLink, SocialLinkRequest } from '../../_models/social-link';

@Component({
  selector: 'app-profile-wizard',
  standalone: false,
  templateUrl: './profile-wizard.component.html',
  styleUrls: ['./profile-wizard.component.scss']
})
export class ProfileWizardComponent  implements OnInit {
  currentStep = 1;
  totalSteps = 9;
  userId: number;

// Add these to your component class
  previewUrl: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;

// Add to component class --SELECTED
  skillLevels = Object.values(SkillLevel);
  proficiencyLevels = Object.values(ProficiencyLevel);
  certificationTypes = Object.values(CertificationType);
  centres = Object.values(Centre);

// Social Links properties
  socialLinks: SocialLink[] = [];
  editingSocialLinkId: number | null = null;
  availablePlatforms: string[] = ['LinkedIn', 'GitHub', 'Twitter', 'Facebook', 'Instagram', 'Portfolio', 'Personal Website', 'Other'];

  // Add to your component class --Suggestion
  skillCategories = [
    'Programming',
    'Database',
    'DevOps',
    'Cloud',
    'Frontend',
    'Backend',
    'Mobile',
    'Other'
  ];
  softSkillExamples = [
    'Communication',
    'Teamwork',
    'Problem Solving',
    'Leadership',
    'Time Management',
    'Adaptability',
    'Creativity',
    'Critical Thinking'
  ];
  languageExamples = [
    'Arabe',
    'Français',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Italien',
    'Chinois',
    'Japonais',
    'Portugais',
    'Russe',
    'Néerlandais',
    'Turc',
    'Coréen',
    'Hindi',
    'Bengali',
    'Suédois',
    'Polonais',
    'Vietnamien',
    'Grec',
    'Thaïlandais'
  ];



  // Forms
  profileForm!: FormGroup;
  experienceForm!: FormGroup;
  formationForm!: FormGroup;
  languageForm!: FormGroup;
  softSkillForm!: FormGroup;
  techSkillForm!: FormGroup;
  certificationForm!: FormGroup;
  projectForm!: FormGroup;
  socialLinkForm!: FormGroup;

  // Data lists
  experiences: Experience[] = [];
  formations: Formation[] = [];
  languages: LanguageResponse[] = [];
  softSkills: SoftSkillResponse[] = [];
  techSkills: TechSkillResponse[] = [];
  certifications: CertificationResponse[] = [];
  projects: ProjectResponse[] = [];

  // Status options
  projectStatuses = Object.values(ProjectStatus);

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private experienceService: ExperienceService,
    private formationService: FormationService,
    private languageService: LanguageService,
    private softSkillService: SoftSkillService,
    private techSkillService: TechSkillService,
    private certificationService: CertificationService,
    private projectService: ProjectService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient,

  ) {
    this.userId = this.tokenService.getUser().id;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadExistingData();
    this.setupAutoSave();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      diploma: [''],
      bio: [''],
      profilePicture: [''],
      address: [''],
      centre: ['']
    });

    this.formationForm = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['']
    });

    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false]
    });

    this.certificationForm = this.fb.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      issueDate: [''],
      expiryDate: [''],
      certificateUrl: [''],
      validationLink: ['']
    });

    this.techSkillForm = this.fb.group({
      name: ['', Validators.required],
      level: [SkillLevel.INTERMEDIATE, Validators.required],
      category: ['', Validators.required],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      verified: [false]
    });

    this.softSkillForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      proficiency: [ProficiencyLevel.INTERMEDIATE, Validators.required],
      // certification: [''],
      certificateUrl: [''],
      nativeLanguage: [false]
    });

    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      status: [ProjectStatus.PLANNED, Validators.required],
      technologies: [[]],
      projectUrl: [''],
      repositoryUrl: ['']
    });

    this.socialLinkForm = this.fb.group({
      platform: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
    });
  }

  loadExistingData(): void {
    this.profileService.getProfile(this.userId).subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          diploma: profile.diploma,
          bio: profile.bio,
          address: profile.address,
          centre: profile.centre,
          profilePicture: profile.profilePicture
        });

        if (profile.profilePicture) {
          this.previewUrl = this.getProfilePictureUrl();
        }
      }
    });

    this.loadExperiences();
    this.loadFormations();
    this.loadLanguages();
    this.loadSoftSkills();
    this.loadTechSkills();
    this.loadCertifications();
    this.loadProjects();
    this.loadSocialLinks();
  }

  loadFormations(): void {
    this.formationService.getFormations(this.userId).subscribe({
      next: (formations) => {
        this.formations = formations;
      },
      error: (err) => {
        console.error('Failed to load formations:', err);
        this.snackBar.open('Failed to load formations', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadExperiences(): void {
    this.experienceService.getExperiences(this.userId).subscribe({
      next: (experiences: Experience[]) => {
        this.experiences = experiences.map(e => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: e.current ? undefined : (e.endDate ? new Date(e.endDate) : undefined)
        }));
      },
      error: (err) => {
        console.error('Failed to load experiences:', err);
        this.snackBar.open('Failed to load work experiences', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadCertifications(): void {
    this.certificationService.getAllCertifications(this.userId).subscribe({
      next: (certs) => this.certifications = certs,
      error: (err) => console.error('Failed to load certifications:', err)
    });
  }

  loadTechSkills(): void {
    this.techSkillService.getAllTechSkills(this.userId).subscribe({
      next: (skills) => this.techSkills = skills,
      error: (err) => {
        console.error('Failed to load tech skills:', err);
        this.snackBar.open('Failed to load technical skills', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadSoftSkills(): void {
    this.softSkillService.getAllSoftSkills(this.userId).subscribe({
      next: (skills) => this.softSkills = skills,
      error: (err) => console.error('Failed to load soft skills:', err)
    });
  }

  loadLanguages(): void {
    this.languageService.getLanguages(this.userId).subscribe({
      next: (languages) => this.languages = languages,
      error: (err) => console.error('Failed to load languages:', err)
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects(this.userId).subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => console.error('Failed to load projects:', err)
    });
  }

  loadSocialLinks(): void {
    this.profileService.getSocialLinks(this.userId).subscribe({
      next: (links) => {
        this.socialLinks = links;
      },
      error: (err) => {
        console.error('Failed to load social links:', err);
        this.snackBar.open('Failed to load social links', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // -----------------Upload Image + Save Profile

  // This method should be added to your component
  getProfilePictureUrl(): string {
    const profilePictureFromForm = this.profileForm.get('profilePicture')?.value;

    if (profilePictureFromForm) {
      // If the path already starts with http:// or https://, return it as is
      if (profilePictureFromForm.startsWith('http://') || profilePictureFromForm.startsWith('https://')) {
        return profilePictureFromForm;
      }
      // Otherwise, prepend the base URL from the profile service
      return this.profileService.getFullImageUrl(profilePictureFromForm);
    }

    if (this.previewUrl) {
      return this.previewUrl as string;
    }

    return 'assets/default-avatar.png';
  }


  // Add these properties to your component class
  verificationMessage: string = '';
  isHumanVerified: boolean = false;
  isVerifying: boolean = false;
  verifyingBio = false;
  generatingBio = false;

  //------ Add this new method for LLM verification PICTURE-----
  async verifyWithLLM(file: File): Promise<void> {
    this.verificationMessage = 'Verifying image...';

    // Convert file to base64
    const base64Image = await this.fileToBase64(file);

    // Call Hugging Face API (using a free model)
    const response: any = await this.http.post(
      'https://api-inference.huggingface.co/models/facebook/detr-resnet-50',
      { inputs: base64Image },
      {
        headers: {
          'Authorization': 'Bearer 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', // Get free key from Hugging Face
          'Content-Type': 'application/json'
        }
      }
    ).toPromise();

    // Check if human is detected
    const hasPerson = response.some((item: any) =>
      item.label.toLowerCase().includes('person') && item.score > 0.7
    );

    if (hasPerson) {
      this.verificationMessage = 'Human face verified!';
      this.isHumanVerified = true;
    } else {
      this.verificationMessage = 'No human face detected. Please upload a clear photo of yourself.';
      this.isHumanVerified = false;
    }
  }

  // Helper method to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  // ----- END LLM verification PICTURE ---------


// Update your onFileSelected method
// Update your onFileSelected method
  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      // Reset states
      this.uploadProgress = 0;
      this.verificationMessage = '';
      this.isHumanVerified = false;
      this.isVerifying = true;

      // Validate file type and size first
      if (!file.type.match(/image\/(jpeg|png|gif)/)) {
        this.snackBar.open('Only JPEG, PNG, or GIF images are allowed', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isVerifying = false;
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.snackBar.open('Image size should be less than 5MB', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isVerifying = false;
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        this.previewUrl = reader.result;

        // Perform verification
        try {
          await this.verifyWithLLM(file);

          // Only proceed with upload if human is verified
          if (this.isHumanVerified) {
            this.uploadProfilePicture(file);
          } else {
            this.snackBar.open(this.verificationMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            // Reset preview if not human
            this.previewUrl = null;
            event.target.value = ''; // Clear the file input
          }
        } catch (error) {
          console.error('Verification failed:', error);
          this.verificationMessage = 'Verification service unavailable. Please try again later.';
          this.isHumanVerified = false;
          this.snackBar.open(this.verificationMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } finally {
          this.isVerifying = false;
        }
      };
    }
  }

// Extract the upload logic to a separate method
  private uploadProfilePicture(file: File): void {
    this.profileService.uploadProfilePicture(this.userId, file).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update progress
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          // Handle successful upload
          this.uploadProgress = null;

          // Get the profile data from the response
          const profileData = event.body;

          if (profileData && profileData.profilePicture) {
            // Update form with the new image path
            this.profileForm.patchValue({ profilePicture: profileData.profilePicture });

            // Reset preview (will now use the form value)
            this.previewUrl = null;

            // Show success message
            this.snackBar.open('Profile picture updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploadProgress = null;
        this.previewUrl = null;
        this.snackBar.open('Error uploading image. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profileData: ProfileUpdateRequest = this.profileForm.value;
      this.profileService.updateProfile(this.userId, profileData).subscribe({
        next: (updatedProfile) => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
          this.profileForm.patchValue({
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            email: updatedProfile.email,
            phoneNumber: updatedProfile.phoneNumber,
            diploma: updatedProfile.diploma,
            bio: updatedProfile.bio,
            address: updatedProfile.address,
            centre: updatedProfile.centre
          });
          if (this.currentStep === 1) {
            this.steps[0].completed = true; // Mark step 1 as completed
          }
        },
        error: (err) => {
          console.error('Failed to save profile:', err);
          this.snackBar.open('Error saving profile. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  private setupAutoSave(): void {
    this.profileForm.valueChanges.pipe(
      debounceTime(120000),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      filter(() => this.profileForm.valid && this.currentStep === 1)
    ).subscribe(() => {
      this.saveProfile();
    });
  }

//-----------------------------------------



  addFormation(): void {
    if (this.formationForm.valid) {
      this.formationService.createFormation(this.userId, this.formationForm.value).subscribe({
        next: (newFormation) => {
          this.formations.push(newFormation);
          this.formationForm.reset();
          if (this.currentStep === 2) { // Assuming Formations is step 2
            this.steps[1].completed = true;
          }
        },
        error: (err) => console.error('Failed to add formation:', err)
      });
    }
  }

  addExperience(): void {
    if (this.experienceForm.valid) {
      this.experienceService.createExperience(this.userId, this.experienceForm.value).subscribe({
        next: (newExperience) => {
          this.experiences.push(newExperience);
          this.experienceForm.reset();
          if (this.currentStep === 3) { // Assuming Experience is step 3
            this.steps[2].completed = true;
          }
        },
        error: (err) => console.error('Failed to add experience:', err)
      });
    }
  }

  addCertification(): void {
    if (this.certificationForm.valid) {
      const request: CertificationRequest = this.certificationForm.value;
      this.certificationService.createCertification(this.userId, request).subscribe({
        next: (newCert) => {
          this.certifications.push(newCert);
          this.certificationForm.reset();
          if (this.currentStep === 4) { // Assuming Certifications is step 4
            this.steps[3].completed = true;
          }
        },
        error: (err) => console.error('Failed to add certification:', err)
      });
    }
  }

  addTechSkill(): void {
    if (this.techSkillForm.valid) {
      const request: TechSkillRequest = this.techSkillForm.value;
      this.techSkillService.createTechSkill(this.userId, request).subscribe({
        next: (newSkill) => {
          this.techSkills.push(newSkill);
          this.techSkillForm.reset({
            level: SkillLevel.INTERMEDIATE,
            yearsOfExperience: 0,
            verified: false
          });
          this.snackBar.open('Technical skill added successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          if (this.currentStep === 5) { // Assuming Tech Skills is step 5
            this.steps[4].completed = true;
          }
        },
        error: (err) => {
          console.error('Failed to add tech skill:', err);
          this.snackBar.open(err.error?.message || 'Failed to add technical skill', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  addSoftSkill(): void {
    if (this.softSkillForm.valid) {
      const request: SoftSkillRequest = { name: this.softSkillForm.value.name };

      const snackbarRef = this.snackBar.open('Adding soft skill...', 'Close', {
        duration: 0
      });

      this.softSkillService.createSoftSkill(this.userId, request).subscribe({
        next: (newSkill) => {
          snackbarRef.dismiss();
          this.softSkills.push(newSkill);
          this.softSkillForm.reset();
          this.snackBar.open('Soft skill added successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          if (this.currentStep === 6) { // Assuming Soft Skills is step 6
            this.steps[5].completed = true;
          }
        },
        error: (err) => {
          snackbarRef.dismiss();
          console.error('Failed to add soft skill:', err);
          this.snackBar.open(err.error?.message || 'Failed to add soft skill', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  addLanguage(): void {
    if (this.languageForm.valid) {
      const request: LanguageRequest = this.languageForm.value;

      const snackbarRef = this.snackBar.open('Adding language...', 'Close', {
        duration: 0
      });

      this.languageService.createLanguage(this.userId, request).subscribe({
        next: (newLanguage) => {
          snackbarRef.dismiss();
          this.languages.push(newLanguage);
          this.languageForm.reset({
            proficiency: ProficiencyLevel.INTERMEDIATE,
            nativeLanguage: false
          });
          this.snackBar.open('Language added successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          if (this.currentStep === 7) { // Assuming Languages is step 7
            this.steps[6].completed = true;
          }
        },
        error: (err) => {
          snackbarRef.dismiss();
          console.error('Failed to add language:', err);
          this.snackBar.open(err.error?.message || 'Failed to add language', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  addProject(): void {
    if (this.projectForm.valid) {
      const request: ProjectRequest = this.projectForm.value;
      this.projectService.createProject(this.userId, request).subscribe({
        next: (newProject) => {
          this.projects.push(newProject);
          this.projectForm.reset();
        },
        error: (err) => console.error('Failed to add project:', err)
      });
    }
  }

  addOrUpdateSocialLink(): void {
    if (this.socialLinkForm.invalid) {
      this.snackBar.open('Please select a platform and enter a valid URL.', 'Close', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }
    const socialLinkReq: SocialLinkRequest = this.socialLinkForm.value;
    if (this.editingSocialLinkId !== null) {
      this.profileService.updateSocialLink(this.userId, this.editingSocialLinkId, socialLinkReq).subscribe({
        next: (updatedLink) => {
          const index = this.socialLinks.findIndex(link => link.id === this.editingSocialLinkId);
          if (index !== -1) {
            this.socialLinks[index] = updatedLink;
          }
          this.cancelEditSocialLink();
          this.snackBar.open('Social link updated!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          if (this.currentStep === 8) { // Assuming Social Links is step 8
            this.steps[7].completed = true;
          }
        },
        error: (err) => {
          console.error('Failed to update social link:', err);
          this.snackBar.open('Error updating social link.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    } else {
      this.profileService.addSocialLink(this.userId, socialLinkReq).subscribe({
        next: (newLink) => {
          this.socialLinks.push(newLink);
          this.socialLinkForm.reset();
          this.snackBar.open('Social link added!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          if (this.currentStep === 8) { // Assuming Social Links is step 8
            this.steps[7].completed = true;
          }
        },
        error: (err) => {
          console.error('Failed to add social link:', err);
          this.snackBar.open('Error adding social link.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  editSocialLink(linkToEdit: SocialLink): void {
    if (linkToEdit.id === undefined) {
      console.error("Cannot edit a social link without an ID");
      return;
    }
    this.editingSocialLinkId = linkToEdit.id;
    this.socialLinkForm.patchValue({
      platform: linkToEdit.platform,
      url: linkToEdit.url
    });
  }

  deleteSocialLink(linkId: number | undefined): void {
    if (linkId === undefined) {
      console.error("Cannot delete social link: ID is undefined.");
      this.snackBar.open('Error: Could not delete link, ID missing.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Social Link',
        message: 'Are you sure you want to remove this social link?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.profileService.deleteSocialLink(this.userId, linkId).subscribe({
          next: () => {
            this.socialLinks = this.socialLinks.filter(link => link.id !== linkId);
            this.snackBar.open('Social link deleted.', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
            if (this.editingSocialLinkId === linkId) {
              this.cancelEditSocialLink();
            }
          },
          error: (err) => {
            console.error('Failed to delete social link:', err);
            this.snackBar.open('Error deleting social link.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

  cancelEditSocialLink(): void {
    this.editingSocialLinkId = null;
    this.socialLinkForm.reset();
  }

  deleteFormation(formationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Delete Formation',
        message: 'This will permanently remove the formation record. This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep It',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.formationService.deleteFormation(this.userId, formationId).subscribe({
          next: () => {
            this.formations = this.formations.filter(f => f.id !== formationId);
            this.snackBar.open('Formation deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete formation:', err);
            this.snackBar.open('Failed to delete formation', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteExperience(experienceId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Delete Experience',
        message: 'This will permanently remove this work experience. This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep It',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.experienceService.deleteExperience(this.userId, experienceId).subscribe({
          next: () => {
            this.experiences = this.experiences.filter(e => e.id !== experienceId);
            this.snackBar.open('Experience deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete experience:', err);
            this.snackBar.open('Failed to delete experience', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteCertification(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Delete Certification',
        message: 'This will permanently remove this certification. This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep It',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.certificationService.deleteCertification(id).subscribe({
          next: () => {
            this.certifications = this.certifications.filter(c => c.id !== id);
            this.snackBar.open('Certification deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete certification:', err);
            this.snackBar.open('Failed to delete certification', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteTechSkill(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Technical Skill',
        message: 'Are you sure you want to delete this technical skill?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.techSkillService.deleteTechSkill(this.userId, id).subscribe({
          next: () => {
            this.techSkills = this.techSkills.filter(s => s.id !== id);
            this.snackBar.open('Technical skill deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete tech skill:', err);
            this.snackBar.open('Failed to delete technical skill', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteSoftSkill(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Soft Skill',
        message: 'Are you sure you want to delete this soft skill?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.softSkillService.deleteSoftSkill(this.userId, id).subscribe({
          next: () => {
            this.softSkills = this.softSkills.filter(s => s.id !== id);
            this.snackBar.open('Soft skill deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete soft skill:', err);
            this.snackBar.open('Failed to delete soft skill', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  deleteLanguage(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Language',
        message: 'Are you sure you want to delete this language?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.languageService.deleteLanguage(this.userId, id).subscribe({
          next: () => {
            this.languages = this.languages.filter(l => l.id !== id);
            this.snackBar.open('Language deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete language:', err);
            this.snackBar.open('Failed to delete language', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }


  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.projects = this.projects.filter(p => p.id !== id),
        error: (err) => console.error('Failed to delete project:', err)
      });
    }
  }



  nextStep(): void {
    if (!this.isStepValid(this.currentStep)) {
      this.snackBar.open(`Please ensure all fields in Step ${this.currentStep} are correctly filled out.`, 'Close', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
      // Manually trigger validation visibility for the current step's form
      this.markStepFormAsTouched(this.currentStep);
      return;
    }

    // Mark current step as completed
    this.steps[this.currentStep - 1].completed = true;

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else if (this.currentStep === this.totalSteps) {
      // This is the last step, try to complete the profile
      this.completeProfile();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  skipWizard(): void {
    this.router.navigate(['/portfolio']);
  }

  completeProfile(): void {
    if (this.profileForm.valid) {
      const profileData: ProfileUpdateRequest = {
        ...this.profileForm.value,
        socialLinks: [],
        completed: true
      };

      this.profileService.updateProfile(this.userId, profileData).subscribe({
        next: () => this.router.navigate(['/portfolio']),
        error: (err) => console.error('Failed to complete profile:', err)
      });
    }
  }

  calculateProgress(): number {
    const completed = [
      this.profileForm.valid,
      this.experiences.length > 0,
      this.formations.length > 0,
      this.certifications.length > 0,
      this.languages.length > 0,
      this.socialLinks.length > 0,
      this.softSkills.length > 0,
      this.techSkills.length > 0,
      this.projects.length > 0
    ].filter(Boolean).length;

    return (completed / this.totalSteps) * 100;
  }



  //------ Add this new method for LLM verification TEXT-------------


  verifyBio(): void {
    const bioControl = this.profileForm.get('bio');
    const originalBio = bioControl?.value?.trim();

    if (!originalBio || originalBio.length < 5) {
      this.snackBar.open('Please enter a longer bio before verifying.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.verifyingBio = true;

    this.profileService.checkBioCorrection(originalBio).subscribe({
      next: (corrected: string) => {
        this.verifyingBio = false;

        const cleaned = corrected.trim();
        if (cleaned.toUpperCase() === 'INVALID BIO') {
          this.snackBar.open('Your bio seems invalid. Please rewrite it.', 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
          return;
        }

        const dialogRef = this.dialog.open(BioCorrectionDialogComponent, {
          width: '600px',
          data: { original: originalBio, corrected: cleaned, title: 'Suggested Bio Correction' }
        });

        dialogRef.afterClosed().subscribe(apply => {
          if (apply) {
            bioControl?.setValue(cleaned);
            this.snackBar.open('Bio updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      },
      error: (err) => {
        this.verifyingBio = false;
        console.error('Bio verification error:', err);
        this.snackBar.open('Could not verify bio. Try again later.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }//------ END LLM verification TEXT-------------



//------  LLM Generate-Bio TEXT-------------
  generateBioFromPortfolioData(): void {
    const bioControl = this.profileForm.get('bio');
    const currentBio = bioControl?.value || '';

    this.generatingBio = true;

    // Gather data for bio generation
    const diploma = this.profileForm.get('diploma')?.value || '';
    const recentExperience = this.experiences.length > 0 ? this.experiences[0] : null; // Assuming sorted by date or relevance
    const topTechSkills = this.techSkills.slice(0, 3).map(skill => skill.name); // Take top 3
    const recentFormation = this.formations.length > 0 ? this.formations[0] : null;

    const portfolioSummary = {
      diploma,
      experienceTitle: recentExperience?.title,
      experienceCompany: recentExperience?.company,
      skills: topTechSkills,
      degree: recentFormation?.degree,
      fieldOfStudy: recentFormation?.fieldOfStudy
    };

    // Filter out empty fields from summary to send a cleaner object
    const cleanSummary = Object.fromEntries(Object.entries(portfolioSummary).filter(([_, v]) => v != null && v !== '' && (!Array.isArray(v) || v.length > 0)));

    this.profileService.generateBio(this.userId, cleanSummary).subscribe({
      next: (generatedBio: string) => {
        this.generatingBio = false;
        if (!generatedBio || generatedBio.trim().toUpperCase() === 'COULD NOT GENERATE BIO' || generatedBio.trim().length === 0) {
          this.snackBar.open('Could not generate a bio based on the current data. Please add more details to your profile.', 'Close', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          return;
        }

        const dialogRef = this.dialog.open(BioCorrectionDialogComponent, {
          width: '600px',
          data: { original: currentBio, corrected: generatedBio.trim(), title: 'Suggested Bio (Generated)' }
        });

        dialogRef.afterClosed().subscribe(apply => {
          if (apply) {
            bioControl?.setValue(generatedBio.trim());
            this.snackBar.open('Bio updated with generated version!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });
      },
      error: (err: any) => {
        this.generatingBio = false;
        console.error('Bio generation error:', err);
        this.snackBar.open('Could not generate bio. Service might be unavailable or an error occurred.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }


  // Add this to your component class
  steps = [
    { label: 'Personal Info', completed: false },
    { label: 'Formations', completed: false },
    { label: 'Experience', completed: false },
    { label: 'Certifications', completed: false },
    { label: 'Tech Skills', completed: false },
    { label: 'Soft Skills', completed: false },
    { label: 'Languages', completed: false },
    { label: 'Social Links', completed: false },
    { label: 'Bio & Summary', completed: false }
  ];

  isStepCompleted(stepNumber: number): boolean {
    if (stepNumber > 0 && stepNumber <= this.steps.length) {
      return this.steps[stepNumber - 1].completed;
    }
    return false;
  }

  isStepValid(stepNumber: number): boolean {
    // Implement validation for each step
    if (stepNumber === 1) {
      return this.profileForm.valid;
    }
    if (stepNumber === 2) {
      // Valid if the form is valid (for adding new) or if there's already data
      return this.formationForm.valid || this.formations.length > 0;
    }
    if (stepNumber === 3) {
      return this.experienceForm.valid || this.experiences.length > 0;
    }
    if (stepNumber === 4) {
      return this.certificationForm.valid || this.certifications.length > 0;
    }
    if (stepNumber === 5) {
      return this.techSkillForm.valid || this.techSkills.length > 0;
    }
    if (stepNumber === 6) {
      return this.softSkillForm.valid || this.softSkills.length > 0;
    }
    if (stepNumber === 7) {
      return this.languageForm.valid || this.languages.length > 0;
    }
    if (stepNumber === 8) {
      return this.socialLinkForm.valid || this.socialLinks.length > 0;
    }
    if (stepNumber === 9) { // For the Bio & Summary step
      // Bio field is part of profileForm. It's valid if the bio control itself is valid.
      // The profileForm.valid check on completeProfile will be the final gate.
      return this.profileForm.get('bio')?.valid ?? false;
    }
    // Fallback for any step not explicitly defined, though all 9 should be.
    return true; // Default to true to allow navigation if not specified, review if this is too permissive.
  }

  goToStep(stepNumber: number): void {
    // Allow navigating to step 1 always
    if (stepNumber === 1) {
      this.currentStep = 1;
      return;
    }

    // Allow navigating to step N if step N-1 is completed.
    if (stepNumber > 0 && stepNumber <= this.totalSteps) {
      if (this.isStepCompleted(stepNumber - 1)) {
        this.currentStep = stepNumber;
      } else {
        // Optional: Inform user they need to complete previous steps
        this.snackBar.open('Please complete the previous steps first to navigate here.', 'Close', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
      }
    }
  }

  // Helper to mark forms as touched for validation messages
  private markStepFormAsTouched(stepNumber: number): void {
    switch (stepNumber) {
      case 1: this.profileForm.markAllAsTouched(); break;
      case 2: this.formationForm.markAllAsTouched(); break;
      case 3: this.experienceForm.markAllAsTouched(); break;
      case 4: this.certificationForm.markAllAsTouched(); break;
      case 5: this.techSkillForm.markAllAsTouched(); break;
      case 6: this.softSkillForm.markAllAsTouched(); break;
      case 7: this.languageForm.markAllAsTouched(); break;
      case 8: this.socialLinkForm.markAllAsTouched(); break;
      case 9: this.profileForm.get('bio')?.markAsTouched(); break; // Bio is part of profileForm
    }
  }

}
