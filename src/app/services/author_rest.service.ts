import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../interfaces/author';
@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private myAppUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080'

  }
  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(`${this.myAppUrl}/author`, author);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.myAppUrl}/authors`);
  }

  getAuthorById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.myAppUrl}/author/${id}`);
  }

  updateAuthor(id: string, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.myAppUrl}/author/${id}`, author);
  }

  deleteAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}/author/${id}`);
  }

}
