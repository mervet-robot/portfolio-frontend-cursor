import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../../_models/responsable';
import { DirecteurService } from '../../../_services/directeur.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsable-list',
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Responsables</h2>
        <button class="btn btn-primary" (click)="createNewResponsable()">Add New Responsable</button>
      </div>

      <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Name</th>
              <th scope="col">Department</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let responsable of responsables">
              <td>{{ responsable.id }}</td>
              <td>{{ responsable.username }}</td>
              <td>{{ responsable.email }}</td>
              <td>{{ responsable.profile?.firstName }} {{ responsable.profile?.lastName }}</td>
              <td>{{ responsable.profile?.department || 'Not specified' }}</td>
              <td>
                <div class="btn-group" role="group" aria-label="Responsable actions">
                  <button class="btn btn-info btn-sm me-1" (click)="viewResponsable(responsable.id!)">View</button>
                  <button class="btn btn-warning btn-sm me-1" (click)="editResponsable(responsable.id!)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteResponsable(responsable.id!)">Delete</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="responsables.length === 0">
              <td colspan="6" class="text-center">No responsables found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .thead-dark {
      background-color: #343a40;
      color: white;
    }

    .btn-group {
      display: flex;
    }

    .alert {
      padding: 10px 15px;
      border-radius: 4px;
      margin-bottom: 15px;
      animation: fadeOut 5s forwards;
    }

    .alert-success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .alert-danger {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    @keyframes fadeOut {
      0% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; }
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ResponsableListComponent implements OnInit {
  responsables: Responsable[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private directeurService: DirecteurService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadResponsables();
  }

  loadResponsables(): void {
    this.directeurService.getAllResponsables().subscribe(
      (data) => {
        this.responsables = data;
      },
      (err) => {
        this.errorMessage = err.error.message || 'An error occurred while loading responsables.';
      }
    );
  }

  editResponsable(id: number): void {
    this.router.navigate(['/directeur/responsables/edit', id]);
  }

  viewResponsable(id: number): void {
    this.router.navigate(['/directeur/responsables/view', id]);
  }

  deleteResponsable(id: number): void {
    if (confirm('Are you sure you want to delete this responsable?')) {
      this.directeurService.deleteResponsable(id).subscribe(
        (response) => {
          this.successMessage = 'Responsable deleted successfully!';
          this.loadResponsables(); // Refresh the list
        },
        (err) => {
          this.errorMessage = err.error.message || 'Failed to delete the responsable.';
        }
      );
    }
  }

  createNewResponsable(): void {
    this.router.navigate(['/directeur/responsables/create']);
  }
} 