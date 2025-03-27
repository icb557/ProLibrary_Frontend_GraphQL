import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credential, JwtToken } from '../interfaces/credential';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private myAppUrl: string

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080';
  }

  login(creds: Credential): Observable<JwtToken> {
    return this.http.post<JwtToken>(`${this.myAppUrl}/login`, creds);
  }
}
