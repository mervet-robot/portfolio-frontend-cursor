import {Component, Inject, OnInit, OnDestroy, PLATFORM_ID} from '@angular/core';
import {TokenService} from '../../../_services/token.service';
import {isPlatformBrowser} from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private userSubscription!: Subscription;

  constructor(private tokenService: TokenService,
  @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Example: console.log('Footer loaded in browser');
    }

    this.userSubscription = this.tokenService.user$.subscribe(user => {
      if (user && user.id) {
        this.isLoggedIn = true;
        // Update other properties if needed, e.g.:
        // this.username = user.username;
      } else {
        this.isLoggedIn = false;
        // Clear other properties if needed, e.g.:
        // this.username = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
