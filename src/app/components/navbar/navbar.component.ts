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
    if(this.role == 'ROLE_ADMIN'){
      this.router.navigate([`/admin`]);
    } else {
      this.router.navigate([`/employee`]);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
