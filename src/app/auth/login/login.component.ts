import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {TokenService} from '../../_services/token.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  successMessage = '';
  roles: string[] = [];
  showRoleMessage = false;
  unauthorizedRoleMessage = '';
  isNotRegistered = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().roles;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    this.isNotRegistered = false;

    this.authService.login({ username, password }).subscribe({
      next: data => {
        this.tokenService.saveToken(data.token);
        this.tokenService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = [data.role];
        this.unauthorizedRoleMessage = '';
        this.isNotRegistered = false;

        this.showRoleBasedMessage(data.role);

        if (!['LAUREAT','APPRENANT', 'RESPONSABLE','RECRUTEUR', 'DIRECTEUR'].includes(data.role)) {
          this.tokenService.signOut();
          this.isLoggedIn = false;
          return;
        }

        const user = this.tokenService.getUser();
        if (!user || !user.id) {
          console.error("User data or user ID is not available after login.");
          this.router.navigate(['/login']);
          return;
        }

        setTimeout(() => {
          this.redirectBasedOnRoleAndFirstLogin(user);
        }, 100);
      },
      error: err => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
          this.isNotRegistered = true;
        } else if (err.status === 404) {
          this.errorMessage = 'Account not found. Please register first.';
          this.isNotRegistered = true;
        } else {
          this.errorMessage = err.error.message || 'Login failed';
        }
        this.isLoginFailed = true;
      }
    });
  }

  private showRoleBasedMessage(role: string): void {
    this.showRoleMessage = true;

    switch(role) {
      case 'LAUREAT':
        this.successMessage = 'Login successful as LAUREAT';
        break;
      case 'APPRENANT':
        this.successMessage = 'Login successful as APPRENANT';
        break;
      case 'RESPONSABLE':
        this.successMessage = 'Login successful as RESPONSABLE';
        break;
      case 'RECRUTEUR':
        this.successMessage = 'Login successful as RECRUTEUR';
        break;
      case 'DIRECTEUR':
        this.successMessage = 'Login successful as DIRECTEUR';
        break;
      // case 'APPRENANT':
      //   this.errorMessage = 'Sorry, you are still an APPRENANT. You should register again to benefit from this service.';
      //   this.tokenService.signOut();
      //   this.isLoginFailed = true;
      //   this.isLoggedIn = false;
      //   break;
      default:
        this.unauthorizedRoleMessage = 'Vous n\'êtes pas inscrit au programme. Vous devez d\'abord vous inscrire en tant qu\'apprenant pour profiter de ce service.';
        this.isLoginFailed = true;
    }
  }

  redirectBasedOnRoleAndFirstLogin(user: any): void {
    const firstLoginFlagKey = `hasSeenProfileWizard_${user.id}`;

    switch (user.role) {
      case 'LAUREAT':
      case 'APPRENANT':
        const hasSeenWizard = localStorage.getItem(firstLoginFlagKey);
        if (!hasSeenWizard) {
          localStorage.setItem(firstLoginFlagKey, 'true');
          this.router.navigate(["/profile-wizard"]);
        } else {
          this.router.navigate(["/portfolio"]);
        }
        break;
      case 'RESPONSABLE':
        this.router.navigate(['/review-projects']);
        break;
      case 'RECRUTEUR':
        this.router.navigate(['/user-list']);
        break;
      case 'DIRECTEUR':
        this.router.navigate(['/directeur/responsables']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }


  goBack(): void {
    this.router.navigate(['/landing-page']);
  }

}
