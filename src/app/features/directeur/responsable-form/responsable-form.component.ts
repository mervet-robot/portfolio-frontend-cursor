import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DirecteurService } from '../../../_services/directeur.service';
import { ResponsableRequest } from '../../../_models/responsable';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsable-form',
  template: `
    <div class="container mt-4">
      <h2>{{ isAddMode ? 'Add' : 'Edit' }} Responsable</h2>

      <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

      <form [formGroup]="responsableForm" (ngSubmit)="onSubmit()" class="card p-4 shadow">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="username" class="form-label">Username *</label>
            <input
              type="text"
              formControlName="username"
              class="form-control"
              [ngClass]="{ 'is-invalid': submitted && f['username'].errors }"
              id="username"
            />
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
              <div *ngIf="f['username'].errors['required']">Username is required</div>
              <div *ngIf="f['username'].errors['minlength']">Username must be at least 3 characters</div>
              <div *ngIf="f['username'].errors['maxlength']">Username must not exceed 20 characters</div>
            </div>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label">Email *</label>
            <input
              type="email"
              formControlName="email"
              class="form-control"
              [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
              id="email"
            />
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
              <div *ngIf="f['email'].errors['maxlength']">Email must not exceed 50 characters</div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="firstName" class="form-label">First Name *</label>
            <input
              type="text"
              formControlName="firstName"
              class="form-control"
              [ngClass]="{ 'is-invalid': submitted && f['firstName'].errors }"
              id="firstName"
            />
            <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">
              <div *ngIf="f['firstName'].errors['required']">First name is required</div>
            </div>
          </div>

          <div class="col-md-6">
            <label for="lastName" class="form-label">Last Name *</label>
            <input
              type="text"
              formControlName="lastName"
              class="form-control"
              [ngClass]="{ 'is-invalid': submitted && f['lastName'].errors }"
              id="lastName"
            />
            <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">
              <div *ngIf="f['lastName'].errors['required']">Last name is required</div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="department" class="form-label">Department</label>
            <input
              type="text"
              formControlName="department"
              class="form-control"
              id="department"
            />
          </div>

          <div class="col-md-6">
            <label for="phoneNumber" class="form-label">Phone Number</label>
            <input
              type="text"
              formControlName="phoneNumber"
              class="form-control"
              id="phoneNumber"
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">
            {{ isAddMode ? 'Password *' : 'Password (leave blank to keep current password)' }}
          </label>
          <input
            type="password"
            formControlName="password"
            class="form-control"
            [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
            id="password"
          />
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            <div *ngIf="f['password'].errors['required']">Password is required</div>
            <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
            <div *ngIf="f['password'].errors['maxlength']">Password must not exceed 40 characters</div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
            {{ isAddMode ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .form-label {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .form-control {
      border-radius: 5px;
      padding: 10px 15px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-control:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .alert {
      padding: 10px 15px;
      border-radius: 4px;
      margin-bottom: 15px;
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

    .btn {
      padding: 8px 20px;
      border-radius: 5px;
      font-weight: 500;
    }

    .is-invalid {
      border-color: #dc3545;
      padding-right: calc(1.5em + 0.75rem);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResponsableFormComponent implements OnInit {
  responsableForm!: FormGroup;
  isAddMode: boolean = true;
  id?: number;
  errorMessage = '';
  successMessage = '';
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private directeurService: DirecteurService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.responsableForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [
        this.isAddMode ? Validators.required : Validators.nullValidator,
        Validators.minLength(6),
        Validators.maxLength(40)
      ]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      department: [''],
      phoneNumber: ['']
    });

    if (!this.isAddMode) {
      this.directeurService.getResponsableById(this.id!).subscribe(
        (responsable) => {
          this.responsableForm.patchValue({
            username: responsable.username,
            email: responsable.email,
            firstName: responsable.profile?.firstName,
            lastName: responsable.profile?.lastName,
            department: responsable.profile?.department,
            phoneNumber: responsable.profile?.phoneNumber
          });
          // Remove password validation in edit mode
          this.responsableForm.get('password')?.setValidators(
            [Validators.minLength(6), Validators.maxLength(40)]
          );
          this.responsableForm.get('password')?.updateValueAndValidity();
        },
        (error) => {
          this.errorMessage = error.error.message || 'Failed to load responsable data';
        }
      );
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.responsableForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.responsableForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepare the request data
    const responsableData: ResponsableRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      department: this.f['department'].value,
      phoneNumber: this.f['phoneNumber'].value
    };

    if (this.isAddMode) {
      this.createResponsable(responsableData);
    } else {
      this.updateResponsable(responsableData);
    }
  }

  private createResponsable(responsableData: ResponsableRequest): void {
    this.directeurService.createResponsable(responsableData).subscribe(
      (response) => {
        this.successMessage = 'Responsable created successfully!';
        this.router.navigate(['/directeur/responsables']);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Failed to create responsable';
        this.loading = false;
      }
    );
  }

  private updateResponsable(responsableData: ResponsableRequest): void {
    // If password is empty, remove it from the request
    // if (!responsableData.password) {
    //   delete responsableData.password;
    // }

    this.directeurService.updateResponsable(this.id!, responsableData).subscribe(
      (response) => {
        this.successMessage = 'Responsable updated successfully!';
        this.router.navigate(['/directeur/responsables']);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Failed to update responsable';
        this.loading = false;
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/directeur/responsables']);
  }
}
