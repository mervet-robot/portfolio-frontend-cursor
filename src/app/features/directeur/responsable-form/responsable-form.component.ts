import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DirecteurService } from '../../../_services/directeur.service';
import { ResponsableRequest } from '../../../_models/responsable';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-responsable-form',
  standalone: false,
  templateUrl: './responsable-form.component.html',
  styleUrl: './responsable-form.component.scss'

})
export class ResponsableFormComponent implements OnInit {
  responsableForm!: FormGroup;
  isAddMode: boolean = true;
  id?: number;
  errorMessage = '';
  successMessage = '';
  loading = false;
  submitted = false;
  centres = ['LAYOUN_CENTRE', 'DAKHLA_CENTRE', 'CASA_CENTRE'];

  hidePassword = true;

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
      phoneNumber: [''],
      sexe: ['', Validators.required],
      address: ['', Validators.required],
      centre: ['', Validators.required]
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
            phoneNumber: responsable.profile?.phoneNumber,
            sexe: responsable.profile?.sexe,
            address: responsable.profile?.address,
            centre: responsable.profile?.centre
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
      phoneNumber: this.f['phoneNumber'].value,
      sexe: this.f['sexe'].value,
      address: this.f['address'].value,
      centre: this.f['centre'].value
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
    if (!responsableData.password) {
      delete responsableData.password;
    }

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
