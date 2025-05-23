import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsable } from '../../../_models/responsable';
import {DirecteurService} from '../../../_services/directeur.service';

@Component({
  selector: 'app-responsable-view',
  standalone: false,
  templateUrl: './responsable-view.component.html',
  styleUrl: './responsable-view.component.scss'
})



export class ResponsableViewComponent implements OnInit {
  responsable?: Responsable;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private directeurService: DirecteurService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadResponsable(id);
  }

  loadResponsable(id: number): void {
    this.directeurService.getResponsableById(id).subscribe(
      (data) => {
        this.responsable = data;
      },
      (err) => {
        this.errorMessage = err.error.message || 'An error occurred while loading responsable details.';
      }
    );
  }

  editResponsable(): void {
    this.router.navigate(['/directeur/responsables/edit', this.responsable?.id]);
  }

  goBack(): void {
    this.router.navigate(['/directeur/responsables']);
  }
}
