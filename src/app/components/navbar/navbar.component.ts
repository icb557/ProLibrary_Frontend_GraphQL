import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  username: string = localStorage.getItem('username')!;
  role: string = localStorage.getItem('role')!;

  constructor(private router: Router) { 
  }

  goHome() {
    this.router.navigate([`/${this.role}`]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
