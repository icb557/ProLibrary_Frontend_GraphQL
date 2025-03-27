import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private myAppUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080'

  }
}
