import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../../_models/responsable';
import { DirecteurService } from '../../../_services/directeur.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({


  selector: 'app-responsable-list',
  standalone: false,
  templateUrl: './responsable-list.component.html',
  styleUrl: './responsable-list.component.scss'

})
export class ResponsableListComponent implements OnInit {
  responsables: Responsable[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private directeurService: DirecteurService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadResponsables();
  }

  loadResponsables(): void {
    this.directeurService.getAllResponsables().subscribe(
      (data) => {
        this.responsables = data;
      },
      (err) => {
        this.errorMessage = err.error.message || 'An error occurred while loading responsables.';
      }
    );
  }

  editResponsable(id: number): void {
    this.router.navigate(['/directeur/responsables/edit', id]);
  }

  viewResponsable(id: number): void {
    this.router.navigate(['/directeur/responsables/view', id]);
  }

  deleteResponsable(id: number): void {
    if (confirm('Are you sure you want to delete this responsable?')) {
      this.directeurService.deleteResponsable(id).subscribe(
        (response) => {
          this.successMessage = 'Responsable deleted successfully!';
          this.loadResponsables(); // Refresh the list
        },
        (err) => {
          this.errorMessage = err.error.message || 'Failed to delete the responsable.';
        }
      );
    }
  }

  createNewResponsable(): void {
    this.router.navigate(['/directeur/responsables/create']);
  }
}
