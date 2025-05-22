import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsable } from '../../../_models/responsable';
import { DirecteurService } from '../../../_services/directeur.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsable-view',
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 class="mb-0">Responsable Details</h3>
              <div>
                <button class="btn btn-sm btn-light me-2" (click)="editResponsable()">Edit</button>
                <button class="btn btn-sm btn-light" (click)="goBack()">Back to List</button>
              </div>
            </div>
            
            <div class="card-body" *ngIf="responsable">
              <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
              
              <div class="row mb-4">
                <div class="col-md-4">
                  <div class="profile-image-container">
                    <div class="profile-placeholder d-flex justify-content-center align-items-center">
                      <i class="bi bi-person-circle fs-1"></i>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-8">
                  <h4>{{ responsable.profile?.firstName }} {{ responsable.profile?.lastName }}</h4>
                  <p class="text-muted mb-2">{{ responsable.username }}</p>
                  <p class="badge bg-info text-white">Role: {{ responsable.role }}</p>
                  
                  <div class="mt-3">
                    <p><strong>Email:</strong> {{ responsable.email }}</p>
                    <p *ngIf="responsable.profile?.department"><strong>Department:</strong> {{ responsable.profile?.department }}</p>
                    <p *ngIf="responsable.profile?.phoneNumber"><strong>Phone:</strong> {{ responsable.profile?.phoneNumber }}</p>
                    <p><strong>Status:</strong> 
                      <span class="badge" [ngClass]="responsable.active ? 'bg-success' : 'bg-danger'">
                        {{ responsable.active ? 'Active' : 'Inactive' }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-body" *ngIf="!responsable && !errorMessage">
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading responsable details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      overflow: hidden;
    }
    
    .card-header {
      padding: 15px 20px;
    }
    
    .profile-image-container {
      width: 100%;
      padding-top: 100%;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      background-color: #f8f9fa;
      margin-bottom: 15px;
    }
    
    .profile-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #adb5bd;
      background-color: #e9ecef;
    }
    
    .badge {
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.35em 0.65em;
    }
    
    .bg-info {
      background-color: #17a2b8 !important;
    }
    
    .bg-success {
      background-color: #28a745 !important;
    }
    
    .bg-danger {
      background-color: #dc3545 !important;
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ResponsableViewComponent implements OnInit {
  responsable?: Responsable;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private directeurService: DirecteurService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadResponsable(id);
  }

  loadResponsable(id: number): void {
    this.directeurService.getResponsableById(id).subscribe(
      (data) => {
        this.responsable = data;
      },
      (err) => {
        this.errorMessage = err.error.message || 'An error occurred while loading responsable details.';
      }
    );
  }

  editResponsable(): void {
    this.router.navigate(['/directeur/responsables/edit', this.responsable?.id]);
  }

  goBack(): void {
    this.router.navigate(['/directeur/responsables']);
  }
} 