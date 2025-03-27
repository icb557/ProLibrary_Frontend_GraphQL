import { Component, OnInit } from '@angular/core';
import { Person } from '../../interfaces/person';
import { PersonService } from '../../services/person.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent]
})
export class UsersComponent implements OnInit {
  users: Person[] = [];
  searchUsername: string = '';

  constructor(private personService: PersonService, private router: Router) { }



  ngOnInit(): void {
    this.loadUsers();
  }

  formAdd() {
    this.router.navigate(['admin/users/formPerson/create']);
  }

  formEdit(username: string) {
    this.router.navigate([`admin/users/formPerson/edit/${username}`]);
  }


  loadUsers() {
    this.personService.getPeople().subscribe({
      next: (data: Person[]) => {
        this.users = data;
        console.log('Loaded users:', this.users);
      },
      error: (error) => {
        console.error('Error loading users', error);
      }
    });
  }

  searchUser() {
    if (!this.searchUsername.trim()) {
      this.loadUsers();
      return;
    }


    this.personService.searchPersonByUsername(this.searchUsername).subscribe({
      next: (result: Person[]) => {
        this.users = result;
        console.log('Search result:', this.users);
      },
      error: (error) => {
        console.error('Error searching user', error);
        this.users = []; // Clear users on error
      }
    });
  }

  deleteUser(username: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.personService.deletePerson(username).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.username !== username);
        },
        error: (error) => {
          console.error('Error deleting user', error);
        }
      });
    }
  }
}