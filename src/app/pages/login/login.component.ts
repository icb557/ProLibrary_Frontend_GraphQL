import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { CredentialsService } from '../../services/credentials.service';
import { Credential } from '../../interfaces/credential';
import { JwtService } from '../../services/jwt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = ''
  password = ''
  constructor(
    private router: Router, 
    private _credentialsService: CredentialsService,
    private _jwtService: JwtService  
  ) {}

  login() {
    if (this.validateData()) {
      const creds: Credential = {
        username: this.username,
        password: this.password
      }

      this._credentialsService.login(creds).subscribe({
        next: (data) => {
          const token = data.token
          if (!data) {
            console.log("Cannot get token")
          } else{
            const username = this._jwtService.getUsername(token!)
            const role = this._jwtService.getRole(token!)
            localStorage.setItem('token', token!)
            localStorage.setItem('token', username!)
            localStorage.setItem('token', role!)
            if (this.validateRole(role!)) {
              this.router.navigate(['/admin'])
            } else {
              this.router.navigate(['/employee'])
            }
          }
        }, error: (e: HttpErrorResponse) => {
          Swal.fire({
            title: "Login Failed",
            html: `<p id="loginError">${e.error.message}</p>`,
            icon: "error",
            showConfirmButton: false,
            timer: 1200
          })
        }
      })

    }
  }

  validateRole(role: string): boolean {
      return true ? role === 'ROLE_ADMIN' : false
  }

  validateData(): boolean {

    // const usernameRegex = /^[A-Z][a-z]{6}[0-9]$/;
    const passwordRegex = /^.{8,}$/;

    // if (!usernameRegex.test(this.username)) {
    //   Swal.fire({
    //     title: "Invalid Username",
    //     html: '<p id="usernameError">Username must have the first capital letter, 6 lowercase letters and a number.</p>',
    //     icon: "info",
    //     showConfirmButton: false,
    //     timer: 1200
    //   })
    //   return false
    // }
    if (!passwordRegex.test(this.password)) {
      Swal.fire({
        title: "Invalid Password",
        html: '<p id="passwordError">The password must have a minimum of 8 characters</p>',
        icon: "info",
        showConfirmButton: false,
        timer: 1200
      })
      return false
    }
    return true
  }
}
