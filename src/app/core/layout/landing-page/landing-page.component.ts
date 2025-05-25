import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToRegister(): void {
    this.router.navigate(['/user-register']);
  }

}
