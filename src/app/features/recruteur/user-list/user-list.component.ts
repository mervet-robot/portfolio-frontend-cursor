import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'name', 'gender', 'address', 'centre','actions'];
  dataSource = new MatTableDataSource<User>();
  errorMessage = '';

  //--- For Filter
  searchText = '';
  genderFilter = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadApprenants();

    // Custom filter logic
    this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
      const [search, gender] = filter.split('$');

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

      return matchesSearch && matchesGender;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadApprenants(): void {
    this.userService.getAllApprenant().subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (err) => {
        this.errorMessage = err.error.message || 'An error occurred while loading apprenants.';
      }
    );
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilter();
  }

  onGenderFilterChange(value: string) {
    this.genderFilter = value.trim().toLowerCase();
    this.updateFilter();
  }

  updateFilter() {
    this.dataSource.filter = `${this.searchText}$${this.genderFilter}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  truncateText(text: string, limit: number = 15): string {
    if (!text) return 'N/A';
    return text.length > limit ? text.substr(0, limit) + '...' : text;
  }

  viewResponsable(id: number): void {
    this.router.navigate(['/profile', id]);
  }

}
