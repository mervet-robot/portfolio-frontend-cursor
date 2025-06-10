import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { ProjectStatus } from '../../../_models/project';
import { RespProjectRequest, RespProjectResponse } from '../../../_models/resp-project';
import { RespProjectService } from '../../../_services/resp-project.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { RespFeedbackService } from '../../../_services/resp-feedback.service';
import { RespFeedbackComponent } from '../resp-feedback/resp-feedback.component';

@Component({
  selector: 'app-resp-projects',
  standalone: false,
  templateUrl: './resp-projects.component.html',
  styleUrls: ['./resp-projects.component.scss']
})
export class RespProjectsComponent implements OnInit {
  projects: RespProjectResponse[] = [];
  projectStatuses = Object.values(ProjectStatus);
  newSkill: string = '';
  currentProjectId: number | null = null;
  isEditing = false;

  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: RespProjectService,
    private feedbackService: RespFeedbackService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      status: [ProjectStatus.PLANNED, Validators.required],
      skills: [[]]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    const responsableId = 1; // Replace with actual responsable ID logic
    this.projectService.getAllProjects(responsableId).subscribe({
      next: (projects: RespProjectResponse[]) => this.projects = projects,
      error: (err: any) => this.showError('Failed to load projects', err)
    });
  }

  addProject(): void {
    if (this.projectForm.valid) {
      const request: RespProjectRequest = this.projectForm.value;
      const responsableId = 1; // Replace with actual responsable ID logic
      const operation = this.isEditing
        ? this.projectService.updateProject(this.currentProjectId!, request)
        : this.projectService.createProject(responsableId, request);

      operation.subscribe({
        next: (project: RespProjectResponse) => {
          this.isEditing ? this.updateProjectInList(project) : this.projects.push(project);
          this.resetForm();
          this.showSuccess(`Project ${this.isEditing ? 'updated' : 'added'} successfully`);
        },
        error: (err: any) => this.showError(`Failed to ${this.isEditing ? 'update' : 'add'} project`, err)
      });
    }
  }

  editProject(project: RespProjectResponse): void {
    this.currentProjectId = project.id;
    this.isEditing = true;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      skills: project.skills || []
    });
  }

  deleteProject(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.deleteProject(id).subscribe({
          next: () => {
            this.projects = this.projects.filter(p => p.id !== id);
            this.showSuccess('Project deleted successfully');
          },
          error: (err: any) => this.showError('Failed to delete project', err)
        });
      }
    });
  }

  addSkillFromInput(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      const currentSkills = this.projectForm.get('skills')?.value || [];
      if (!currentSkills.includes(value)) {
        this.projectForm.get('skills')?.setValue([...currentSkills, value]);
      }
      this.newSkill = '';
      input.value = '';
    }
  }

  removeSkill(skill: string): void {
    const currentSkills = this.projectForm.get('skills')?.value || [];
    this.projectForm.get('skills')?.setValue(currentSkills.filter((s: string) => s !== skill));
  }

  resetForm(): void {
    this.projectForm.reset({
      status: ProjectStatus.PLANNED,
      skills: []
    });
    this.isEditing = false;
    this.currentProjectId = null;
    this.newSkill = '';
  }

  private updateProjectInList(updatedProject: RespProjectResponse): void {
    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
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

  navigateToMediaManagement(projectId: number): void {
    this.router.navigate(['/responsable/projects', projectId, 'media']);
  }

  manageFeedback(projectId: number): void {
    const dialogRef = this.dialog.open(RespFeedbackComponent, {
      width: '800px',
      data: { projectId: projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Optionally, you can refresh data or handle results here
    });
  }
}
