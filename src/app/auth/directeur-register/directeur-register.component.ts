import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { DirecteurRequest } from '../../_models/auth';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-directeur-register',
  templateUrl: './directeur-register.component.html',
  styleUrls: ['./directeur-register.component.scss'],
  standalone: false,

})
export class DirecteurRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  isSuccessful = false;
  centres = ['LAYOUN_CENTRE', 'DAKHLA_CENTRE', 'CASA_CENTRE'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      sexe: ['', Validators.required],
      address: ['', Validators.required],
      centre: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const directeurRequest: DirecteurRequest = this.registerForm.value;

    this.authService.directeurRegister(directeurRequest).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.router.navigate(['/login']); // Or navigate to a confirmation page
      },
      error: err => {
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
        this.isSuccessful = false;
      }
    });
  }
}
