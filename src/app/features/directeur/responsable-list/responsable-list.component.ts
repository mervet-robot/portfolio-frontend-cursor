import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Responsable } from '../../../_models/responsable';
import { DirecteurService } from '../../../_services/directeur.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-responsable-list',
  standalone: false,
  templateUrl: './responsable-list.component.html',
  styleUrls: ['./responsable-list.component.scss']
})
export class ResponsableListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'name', 'department', 'gender', 'address', 'centre', 'actions'];
  dataSource = new MatTableDataSource<Responsable>(); // This is what you should use in template
  errorMessage = '';
  successMessage = '';

  //--- For Filter
  searchText = '';
  genderFilter = '';
  departmentFilter = '';



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private directeurService: DirecteurService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadResponsables();


    // Custom filter logic
    this.dataSource.filterPredicate = (data: Responsable, filter: string): boolean => {
      const [search, gender, department] = filter.split('$');

      const matchesSearch =
        (data.username?.toLowerCase().includes(search) ?? false) ||
        (data.email?.toLowerCase().includes(search) ?? false) ||
        (data.profile?.firstName?.toLowerCase().includes(search) ?? false) ||
        (data.profile?.lastName?.toLowerCase().includes(search) ?? false) ||
        (data.profile?.department?.toLowerCase().includes(search) ?? false) ||
        (data.profile?.address?.toLowerCase().includes(search) ?? false) ||
        (data.profile?.centre?.toLowerCase().includes(search) ?? false);

      const matchesGender =
        gender === '' || (data.profile?.sexe?.toLowerCase() === gender);

      const matchesDepartment =
        department === '' || (data.profile?.department?.toLowerCase() === department);

      return matchesSearch && matchesGender && matchesDepartment;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadResponsables(): void {
    this.directeurService.getAllResponsables().subscribe(
      (data) => {
        this.dataSource.data = data; // Set the data for the table
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this responsable?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.directeurService.deleteResponsable(id).subscribe(
          (response) => {
            this.successMessage = 'Responsable deleted successfully!';
            this.loadResponsables();
            setTimeout(() => this.successMessage = '', 3000);
          },
          (err) => {
            this.errorMessage = err.error.message || 'Failed to delete the responsable.';
          }
        );
      }
    });
  }
  createNewResponsable(): void {
    this.router.navigate(['/directeur/responsables/create']);
  }

//------Add this method for filtering
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilter();
  }

  onGenderFilterChange(value: string) {
    this.genderFilter = value.trim().toLowerCase();
    this.updateFilter();
  }

  onDepartmentFilterChange(value: string) {
    this.departmentFilter = value.trim().toLowerCase();
    this.updateFilter();
  }


  updateFilter() {
    // Combine all filters: text$gender$department
    this.dataSource.filter = `${this.searchText}$${this.genderFilter}$${this.departmentFilter}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



//---------truncateText
  truncateText(text: string, limit: number = 15): string {
    if (!text) return 'N/A';
    return text.length > limit ? text.substr(0, limit) + '...' : text;
  }

}
