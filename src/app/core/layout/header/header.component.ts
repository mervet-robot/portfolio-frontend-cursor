import {Component, Inject, OnInit, OnDestroy, PLATFORM_ID} from '@angular/core';
import {TokenService} from '../../../_services/token.service';
import {Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  username?: string;
  role?: string;
  private userSubscription!: Subscription;

  constructor(private tokenService: TokenService, private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userAgent = window.navigator.userAgent;
      console.log('User Agent:', userAgent);
    }

    this.userSubscription = this.tokenService.user$.subscribe(user => {
      if (user && user.id) {
        this.isLoggedIn = true;
        this.username = user.username;
        this.role = user.role;
      } else {
        this.isLoggedIn = false;
        this.username = undefined;
        this.role = undefined;
      }
    });
  }

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
