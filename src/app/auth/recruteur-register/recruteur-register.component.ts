import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { RecruteurRequest } from '../../_models/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recruteur-register',
  templateUrl: './recruteur-register.component.html',
  styleUrls: ['./recruteur-register.component.scss'],
  standalone: false
})
export class RecruteurRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  isSuccessful = false;

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
      company: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const recruteurRequest: RecruteurRequest = this.registerForm.value;

    this.authService.recruteurRegister(recruteurRequest).subscribe({
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
