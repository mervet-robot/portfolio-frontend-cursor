import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  standalone: false,
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  message = '';
  centres = ['LAYOUN_CENTRE', 'DAKHLA_CENTRE', 'CASA_CENTRE'];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      sexe: ['', Validators.required],
      address: ['', Validators.required],
      centre: ['', Validators.required]
      // No 'role' field needed for basic user registration
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.registerUser(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.message = res.message || 'User registration successful';
        // Optionally navigate to login or a success page
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'An unknown error occurred';
        this.isSignUpFailed = true;
      }
    });
  }
}
