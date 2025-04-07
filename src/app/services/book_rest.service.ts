import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../interfaces/book';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private myAppUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080'
  }
  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.myAppUrl}/book`, book);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.myAppUrl}/books`);
  }

  getBookById(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.myAppUrl}/book/${isbn}`);
  }

  searchBook(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.myAppUrl}/book/search?title=${title}`);
  }

  updateBook(isbn: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.myAppUrl}/book/${isbn}`, book);
  }

  deleteBook(isbn: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}/book/${isbn}`);
  }
}
