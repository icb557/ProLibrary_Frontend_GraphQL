import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '../interfaces/jwtPayload';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  decodeToken(token: string): JwtPayload | undefined {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return undefined;
    }
  }

  getUsername(token: string): string | undefined {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? (decodedToken.sub) : undefined;
  }

  getRole(token: string): string | undefined {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? (decodedToken.role) : undefined;
  }
}
