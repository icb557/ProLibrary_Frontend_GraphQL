import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CredentialsService } from '../../services/credentials.service';
import { Credential } from '../../interfaces/credential';
import { JwtService } from '../../services/jwt.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApolloError } from '@apollo/client/core';

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
        next: (token) => {

          if (!token) {
            console.log("Cannot get token")
          } else{
            const username = this._jwtService.getUsername(token!)
            const role = this._jwtService.getRole(token!)
            localStorage.setItem('token', token!)
            localStorage.setItem('username', username!)
            localStorage.setItem('role', role!)
            if (this.validateRole(role!)) {
              this.router.navigate(['/admin'])
            } else {
              this.router.navigate(['/employee'])
            }
          }
        }, 
        error: (error: ApolloError) => {
          // Extract the error message from GraphQL error response
          const errorMessage = this.extractGraphQLErrorMessage(error);
          
          Swal.fire({
            title: "Login Failed",
            html: `<p id="loginError">${errorMessage}</p>`,
            icon: "error",
            showConfirmButton: false,
            timer: 1200
          })
        }
      })
    }
  }

  // Helper method to extract error message from GraphQL error
  private extractGraphQLErrorMessage(error: ApolloError): string {
    // Check for GraphQL errors array first
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      // Try to extract the message from the first GraphQL error
      return error.graphQLErrors[0].message || 'Authentication failed';
    }
    
    // Check for network errors
    if (error.networkError) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Fallback error message
    return 'Authentication failed. Please try again.';
  }

  validateRole(role: string): boolean {
      return true ? role === 'ROLE_ADMIN' : false
  }

  validateData(): boolean {
    const passwordRegex = /^.{8,}$/;

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