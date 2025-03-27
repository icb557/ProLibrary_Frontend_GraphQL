import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NavbarComponent, FooterComponent, RouterLink]
})
export class AdminComponent {
  constructor(private router: Router) {

  }

  formAdd() {
    this.router.navigate(['/formPerson']);
  }
  formAddAuthor() {
    this.router.navigate(['/formAuthor']);
  }
  formAddBook() {
    this.router.navigate(['/formBook']);
  }
}