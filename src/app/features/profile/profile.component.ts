import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../_services/token.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserMediaService} from '../../_services/user-media.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent  {
  // mediaItem: any;
  // currentUserId: number;
  //
  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private mediaService: UserMediaService,
  //   private tokenService: TokenService
  // ) {
  //   this.currentUserId = this.tokenService.getUser().id;
  // }
  //
  // ngOnInit(): void {
  //   const mediaId = this.route.snapshot.params['id'];
  //   this.loadMedia(mediaId);
  // }
  //
  // loadMedia(mediaId: number): void {
  //   this.mediaService.getUserMedia(this.currentUserId).subscribe({
  //     next: (mediaItems) => {
  //       this.mediaItem = mediaItems.find(item => item.id === +mediaId);
  //       if (!this.mediaItem) {
  //         this.router.navigate(['/media']);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading media:', err);
  //       this.router.navigate(['/media']);
  //     }
  //   });
  // }
}
