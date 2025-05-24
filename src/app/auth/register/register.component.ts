import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  message = '';
  roles = ['APPRENANT', 'LAUREAT', 'RESPONSABLE', 'RECRUTEUR'];
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
      role: ['APPRENANT'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sexe: ['', Validators.required],
      address: ['', Validators.required],
      centre: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.registerProfessional(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.message = res.message || 'Registration successful';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
