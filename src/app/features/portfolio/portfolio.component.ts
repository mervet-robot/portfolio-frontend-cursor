
import {Component, Input, OnInit} from '@angular/core';
import {ProfileService} from '../../_services/profile.service';
import {ExperienceService} from '../../_services/experience.service';
import {FormationService} from '../../_services/formation.service';
import {LanguageService} from '../../_services/language.service';
import {SkillService} from '../../_services/skill.service';
import {TokenService} from '../../_services/token.service';
import {Experience} from '../../_models/experience';
import {Formation} from '../../_models/formation';
import {CertificationType, LanguageRequest, LanguageResponse, ProficiencyLevel} from '../../_models/language';
import {SoftSkillRequest, SoftSkillResponse} from '../../_models/soft-skill';
import {SkillLevel, TechSkillRequest, TechSkillResponse} from '../../_models/tech-skill';
import {CertificationRequest, CertificationResponse} from '../../_models/certification';
import {ProjectRequest, ProjectResponse, ProjectStatus} from '../../_models/project';
import {SoftSkillService} from '../../_services/soft-skill.service';
import {TechSkillService} from '../../_services/tech-skill.service';
import {CertificationService} from '../../_services/certification.service';
import {ProjectService} from '../../_services/project.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, distinctUntilChanged, filter, forkJoin} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {ProfileUpdateRequest} from '../../_models/profile';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-portfolio',
  standalone: false,
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  // User ID
  userId: number;
  profileId: number;

  // Form visibility toggles
  editingProfile = false;
  showExperienceForm = false;
  showEducationForm = false;
  showTechSkillForm = false;
  showSoftSkillForm = false;
  showCertificationForm = false;
  showLanguageForm = false;
  showProjectForm = false;

  // Editing flags
  editingExperience = false;
  editingEducation = false;
  editingTechSkill = false;
  editingSoftSkill = false;
  editingCertification = false;
  editingLanguage = false;
  editingProject = false;

  // Current IDs for editing
  currentExperienceId: number | null = null;
  currentFormationId: number | null = null;
  currentTechSkillId: number | null = null;
  currentSoftSkillId: number | null = null;
  currentCertificationId: number | null = null;
  currentLanguageId: number | null = null;
  currentProjectId: number | null = null;

  // Profile Form
  profileForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;

  // Experience Form
  experienceForm!: FormGroup;
  experiences: Experience[] = [];

  // Education Form
  formationForm!: FormGroup;
  formations: Formation[] = [];

  // Technical Skills Form
  techSkillForm!: FormGroup;
  techSkills: TechSkillResponse[] = [];
  skillLevels = Object.values(SkillLevel);
  skillCategories = [
    'Programming', 'Database', 'DevOps', 'Cloud',
    'Frontend', 'Backend', 'Mobile', 'Other'
  ];

  // Soft Skills Form
  softSkillForm!: FormGroup;
  softSkills: SoftSkillResponse[] = [];
  softSkillExamples = [
    'Communication', 'Teamwork', 'Problem Solving', 'Leadership',
    'Time Management', 'Adaptability', 'Creativity', 'Critical Thinking'
  ];

  // Certification Form
  certificationForm!: FormGroup;
  certifications: CertificationResponse[] = [];

  // Language Form
  languageForm!: FormGroup;
  languages: LanguageResponse[] = [];
  proficiencyLevels = Object.values(ProficiencyLevel);
  certificationTypes = Object.values(CertificationType);
  languageExamples = [
    'English', 'French', 'Spanish', 'German', 'Arabic',
    'Chinese', 'Japanese', 'Russian', 'Portuguese', 'Italian'
  ];

  // Project Form
  projectForm!: FormGroup;
  projects: ProjectResponse[] = [];
  projectStatuses = Object.values(ProjectStatus);
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private experienceService: ExperienceService,
    private formationService: FormationService,
    private softSkillService: SoftSkillService,
    private techSkillService: TechSkillService,
    private certificationService: CertificationService,
    private languageService: LanguageService,
    private projectService: ProjectService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient,

  ) {
    this.userId = this.tokenService.getUser().id;
    this.profileId = this.tokenService.getUser().id;

  }

  ngOnInit(): void {
    this.initForms();
    this.loadProfileData();
    this.loadExperiences();
    this.loadFormations();
    this.loadTechSkills();
    this.loadSoftSkills();
    this.loadCertifications();
    this.loadLanguages();
    this.loadProjects();
  }

  initForms(): void {
    // Profile Form
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      diploma: [''],
      bio: [''],
      profilePicture: ['']
    });

    // Experience Form
    this.experienceForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false]
    });

    // Education Form
    this.formationForm = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['']
    });

    // Technical Skills Form
    this.techSkillForm = this.fb.group({
      name: ['', Validators.required],
      level: [SkillLevel.INTERMEDIATE, Validators.required],
      category: ['', Validators.required],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      verified: [false]
    });

    // Soft Skills Form
    this.softSkillForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Certification Form
    this.certificationForm = this.fb.group({
      name: ['', Validators.required],
      issuingOrganization: ['', Validators.required],
      issueDate: [''],
      expirationDate: [''],
      credentialId: [''],
      credentialUrl: ['']
    });

    // Language Form
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      proficiency: [ProficiencyLevel.INTERMEDIATE, Validators.required],
      certification: [''],
      certificateUrl: [''],
      nativeLanguage: [false]
    });

    // Project Form
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      status: [ProjectStatus.PLANNED, Validators.required],
      skills: [[]],
      projectUrl: [''],
      repositoryUrl: ['']
    });
  }

  // Load Data Methods
  loadProfileData(): void {
    this.profileService.getProfile(this.userId).subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue(profile);
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

  loadFormations(): void {
    this.formationService.getFormations(this.userId).subscribe({
      next: (formations) => {
        this.formations = formations;
      },
      error: (err) => {
        console.error('Failed to load formations:', err);
        this.snackBar.open('Failed to load education history', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
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

  loadCertifications(): void {
    this.certificationService.getAllCertifications(this.userId).subscribe({
      next: (certs) => this.certifications = certs,
      error: (err) => console.error('Failed to load certifications:', err)
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

  // Profile Methods
  editProfile(): void {
    this.editingProfile = true;
  }

  cancelEdit(): void {
    this.editingProfile = false;
    this.loadProfileData();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profileData: ProfileUpdateRequest = {
        ...this.profileForm.value,
        socialLinks: []
      };

      this.profileService.updateProfile(this.userId, profileData).subscribe({
        next: () => {
          this.editingProfile = false;
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to save profile:', err);
          this.snackBar.open('Error saving profile', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  // Experience Methods
  addExperience(): void {
    if (this.experienceForm.valid) {
      if (this.editingExperience && this.currentExperienceId) {
        this.updateExperience();
      } else {
        this.experienceService.createExperience(this.userId, this.experienceForm.value).subscribe({
          next: (newExperience) => {
            this.experiences.push(newExperience);
            this.resetExperienceForm();
            this.snackBar.open('Experience added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add experience:', err);
            this.snackBar.open('Failed to add experience', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editExperience(experience: Experience): void {
    this.editingExperience = true;
    this.showExperienceForm = true;
    this.currentExperienceId = experience.id;
    this.experienceForm.patchValue({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current
    });
  }

  updateExperience(): void {
    if (this.currentExperienceId) {
      this.experienceService.updateExperience(this.profileId,this.currentExperienceId, this.experienceForm.value).subscribe({
        next: (updatedExperience) => {
          const index = this.experiences.findIndex(e => e.id === this.currentExperienceId);
          if (index !== -1) {
            this.experiences[index] = updatedExperience;
          }
          this.resetExperienceForm();
          this.snackBar.open('Experience updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update experience:', err);
          this.snackBar.open('Failed to update experience', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteExperience(experienceId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Experience',
        message: 'Are you sure you want to delete this work experience?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
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

  resetExperienceForm(): void {
    this.experienceForm.reset();
    this.showExperienceForm = false;
    this.editingExperience = false;
    this.currentExperienceId = null;
  }

  // Education Methods
  addFormation(): void {
    if (this.formationForm.valid) {
      if (this.editingEducation && this.currentFormationId) {
        this.updateFormation();
      } else {
        this.formationService.createFormation(this.userId, this.formationForm.value).subscribe({
          next: (newFormation) => {
            this.formations.push(newFormation);
            this.resetEducationForm();
            this.snackBar.open('Education added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add education:', err);
            this.snackBar.open('Failed to add education', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editEducation(formation: Formation): void {
    this.editingEducation = true;
    this.showEducationForm = true;
    this.currentFormationId = formation.id;
    this.formationForm.patchValue({
      degree: formation.degree,
      institution: formation.institution,
      fieldOfStudy: formation.fieldOfStudy,
      startDate: formation.startDate,
      endDate: formation.endDate,
      current: formation.current,
      description: formation.description
    });
  }

  updateFormation(): void {
    if (this.currentFormationId) {
      this.formationService.updateFormation(this.profileId, this.currentFormationId, this.formationForm.value).subscribe({
        next: (updatedFormation) => {
          const index = this.formations.findIndex(f => f.id === this.currentFormationId);
          if (index !== -1) {
            this.formations[index] = updatedFormation;
          }
          this.resetEducationForm();
          this.snackBar.open('Education updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update education:', err);
          this.snackBar.open('Failed to update education', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteFormation(formationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Education',
        message: 'Are you sure you want to delete this education entry?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.formationService.deleteFormation(this.userId, formationId).subscribe({
          next: () => {
            this.formations = this.formations.filter(f => f.id !== formationId);
            this.snackBar.open('Education deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete education:', err);
            this.snackBar.open('Failed to delete education', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  resetEducationForm(): void {
    this.formationForm.reset();
    this.showEducationForm = false;
    this.editingEducation = false;
    this.currentFormationId = null;
  }

  // Technical Skills Methods
  addTechSkill(): void {
    if (this.techSkillForm.valid) {
      const request: TechSkillRequest = this.techSkillForm.value;

      if (this.editingTechSkill && this.currentTechSkillId) {
        this.updateTechSkill();
      } else {
        this.techSkillService.createTechSkill(this.userId, request).subscribe({
          next: (newSkill) => {
            this.techSkills.push(newSkill);
            this.resetTechSkillForm();
            this.snackBar.open('Technical skill added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add technical skill:', err);
            this.snackBar.open('Failed to add technical skill', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editTechSkill(skill: TechSkillResponse): void {
    this.editingTechSkill = true;
    this.showTechSkillForm = true;
    this.currentTechSkillId = skill.id;
    this.techSkillForm.patchValue({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      yearsOfExperience: skill.yearsOfExperience,
      verified: skill.verified
    });
  }

  updateTechSkill(): void {
    if (this.currentTechSkillId) {
      const request: TechSkillRequest = this.techSkillForm.value;
      this.techSkillService.updateTechSkill(this.userId, this.currentTechSkillId, request).subscribe({
        next: (updatedSkill) => {
          const index = this.techSkills.findIndex(s => s.id === this.currentTechSkillId);
          if (index !== -1) {
            this.techSkills[index] = updatedSkill;
          }
          this.resetTechSkillForm();
          this.snackBar.open('Technical skill updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update technical skill:', err);
          this.snackBar.open('Failed to update technical skill', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteTechSkill(skillId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Technical Skill',
        message: 'Are you sure you want to delete this technical skill?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.techSkillService.deleteTechSkill(this.userId, skillId).subscribe({
          next: () => {
            this.techSkills = this.techSkills.filter(s => s.id !== skillId);
            this.snackBar.open('Technical skill deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete technical skill:', err);
            this.snackBar.open('Failed to delete technical skill', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  resetTechSkillForm(): void {
    this.techSkillForm.reset({
      level: SkillLevel.INTERMEDIATE,
      yearsOfExperience: 0,
      verified: false
    });
    this.showTechSkillForm = false;
    this.editingTechSkill = false;
    this.currentTechSkillId = null;
  }

  // Soft Skills Methods
  addSoftSkill(): void {
    if (this.softSkillForm.valid) {
      const request: SoftSkillRequest = { name: this.softSkillForm.value.name };

      if (this.editingSoftSkill && this.currentSoftSkillId) {
        this.updateSoftSkill();
      } else {
        this.softSkillService.createSoftSkill(this.userId, request).subscribe({
          next: (newSkill) => {
            this.softSkills.push(newSkill);
            this.resetSoftSkillForm();
            this.snackBar.open('Soft skill added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add soft skill:', err);
            this.snackBar.open('Failed to add soft skill', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editSoftSkill(skill: SoftSkillResponse): void {
    this.editingSoftSkill = true;
    this.showSoftSkillForm = true;
    this.currentSoftSkillId = skill.id;
    this.softSkillForm.patchValue({
      name: skill.name
    });
  }

  updateSoftSkill(): void {
    if (this.currentSoftSkillId) {
      const request: SoftSkillRequest = { name: this.softSkillForm.value.name };
      this.softSkillService.updateSoftSkill(this.userId, this.currentSoftSkillId, request).subscribe({
        next: (updatedSkill) => {
          const index = this.softSkills.findIndex(s => s.id === this.currentSoftSkillId);
          if (index !== -1) {
            this.softSkills[index] = updatedSkill;
          }
          this.resetSoftSkillForm();
          this.snackBar.open('Soft skill updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update soft skill:', err);
          this.snackBar.open('Failed to update soft skill', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteSoftSkill(skillId: number): void {
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
        this.softSkillService.deleteSoftSkill(this.userId, skillId).subscribe({
          next: () => {
            this.softSkills = this.softSkills.filter(s => s.id !== skillId);
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

  resetSoftSkillForm(): void {
    this.softSkillForm.reset();
    this.showSoftSkillForm = false;
    this.editingSoftSkill = false;
    this.currentSoftSkillId = null;
  }

  // Certification Methods
  addCertification(): void {
    if (this.certificationForm.valid) {
      const request: CertificationRequest = this.certificationForm.value;

      if (this.editingCertification && this.currentCertificationId) {
        this.updateCertification();
      } else {
        this.certificationService.createCertification(this.userId, request).subscribe({
          next: (newCert) => {
            this.certifications.push(newCert);
            this.resetCertificationForm();
            this.snackBar.open('Certification added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add certification:', err);
            this.snackBar.open('Failed to add certification', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editCertification(cert: CertificationResponse): void {
    this.editingCertification = true;
    this.showCertificationForm = true;
    this.currentCertificationId = cert.id;
    this.certificationForm.patchValue({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl
    });
  }

  updateCertification(): void {
    if (this.currentCertificationId) {
      const request: CertificationRequest = this.certificationForm.value;
      this.certificationService.updateCertification(this.currentCertificationId, request).subscribe({
        next: (updatedCert) => {
          const index = this.certifications.findIndex(c => c.id === this.currentCertificationId);
          if (index !== -1) {
            this.certifications[index] = updatedCert;
          }
          this.resetCertificationForm();
          this.snackBar.open('Certification updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update certification:', err);
          this.snackBar.open('Failed to update certification', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteCertification(certId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Certification',
        message: 'Are you sure you want to delete this certification?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.certificationService.deleteCertification(certId).subscribe({
          next: () => {
            this.certifications = this.certifications.filter(c => c.id !== certId);
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

  resetCertificationForm(): void {
    this.certificationForm.reset();
    this.showCertificationForm = false;
    this.editingCertification = false;
    this.currentCertificationId = null;
  }

  // Language Methods
  addLanguage(): void {
    if (this.languageForm.valid) {
      const request: LanguageRequest = this.languageForm.value;

      if (this.editingLanguage && this.currentLanguageId) {
        this.updateLanguage();
      } else {
        this.languageService.createLanguage(this.userId, request).subscribe({
          next: (newLanguage) => {
            this.languages.push(newLanguage);
            this.resetLanguageForm();
            this.snackBar.open('Language added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add language:', err);
            this.snackBar.open('Failed to add language', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editLanguage(language: LanguageResponse): void {
    this.editingLanguage = true;
    this.showLanguageForm = true;
    this.currentLanguageId = language.id;
    this.languageForm.patchValue({
      name: language.name,
      proficiency: language.proficiency,
      certification: language.certification,
      certificateUrl: language.certificateUrl,
      nativeLanguage: language.nativeLanguage
    });
  }

  updateLanguage(): void {
    if (this.currentLanguageId) {
      const request: LanguageRequest = this.languageForm.value;
      this.languageService.updateLanguage(this.userId, this.currentLanguageId, request).subscribe({
        next: (updatedLanguage) => {
          const index = this.languages.findIndex(l => l.id === this.currentLanguageId);
          if (index !== -1) {
            this.languages[index] = updatedLanguage;
          }
          this.resetLanguageForm();
          this.snackBar.open('Language updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update language:', err);
          this.snackBar.open('Failed to update language', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteLanguage(languageId: number): void {
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
        this.languageService.deleteLanguage(this.userId, languageId).subscribe({
          next: () => {
            this.languages = this.languages.filter(l => l.id !== languageId);
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

  resetLanguageForm(): void {
    this.languageForm.reset({
      proficiency: ProficiencyLevel.INTERMEDIATE,
      nativeLanguage: false
    });
    this.showLanguageForm = false;
    this.editingLanguage = false;
    this.currentLanguageId = null;
  }

  // Project Methods
  addProject(): void {
    if (this.projectForm.valid) {
      const request: ProjectRequest = this.projectForm.value;

      if (this.editingProject && this.currentProjectId) {
        this.updateProject();
      } else {
        this.projectService.createProject(this.userId, request).subscribe({
          next: (newProject) => {
            this.projects.push(newProject);
            this.resetProjectForm();
            this.snackBar.open('Project added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to add project:', err);
            this.snackBar.open('Failed to add project', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  editProject(project: ProjectResponse): void {
    this.editingProject = true;
    this.showProjectForm = true;
    this.currentProjectId = project.id;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      skills: project.skills || []
    });
  }

  updateProject(): void {
    if (this.currentProjectId) {
      const request: ProjectRequest = this.projectForm.value;
      this.projectService.updateProject(this.currentProjectId, request).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(p => p.id === this.currentProjectId);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          this.resetProjectForm();
          this.snackBar.open('Project updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Failed to update project:', err);
          this.snackBar.open('Failed to update project', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteProject(projectId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.snackBar.open('Project deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Failed to delete project:', err);
            this.snackBar.open('Failed to delete project', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  resetProjectForm(): void {
    this.projectForm.reset({
      status: ProjectStatus.PLANNED,
      skills: []
    });
    this.showProjectForm = false;
    this.editingProject = false;
    this.currentProjectId = null;
  }

  // Technology chips methods
  addTech(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const skills = this.projectForm.get('skills')?.value || [];
      skills.push(value);
      this.projectForm.get('skills')?.setValue(skills);
    }
    event.chipInput!.clear();
  }

  removeTech(tech: string): void {
    const skills = this.projectForm.get('skills')?.value || [];
    const index = skills.indexOf(tech);
    if (index >= 0) {
      skills.splice(index, 1);
      this.projectForm.get('skills')?.setValue(skills);
    }
  }

  // Profile Photo Upload
  // -----------------Upload Image + Save Profile

// This method should be added to your component
  getProfilePictureUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl as string;
    }

    const profilePicture = this.profileForm.get('profilePicture')?.value;
    if (!profilePicture) {
      return 'assets/default-avatar.png';
    }

    // If the path already starts with http:// or https://, return it as is
    if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
      return profilePicture;
    }

    // Otherwise, prepend the base URL
    return this.profileService.getFullImageUrl(profilePicture);
  }

  // Add these properties to your component class
  verificationMessage: string = '';
  isHumanVerified: boolean = false;
  isVerifying: boolean = false;
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


}

