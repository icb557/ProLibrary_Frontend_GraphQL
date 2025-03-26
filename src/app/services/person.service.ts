import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private myAppUrl: string
  private myApiUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080/'
    this.myApiUrl = 'api/person'
  }
  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.myAppUrl}${this.myApiUrl}`, person);
  }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.myAppUrl}api/people`);
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  searchPersonByUsername(username: string): Observable<Person> {
    return this.http.get<Person>(`${this.myAppUrl}${this.myApiUrl}/search?username=${username}`);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.myAppUrl}${this.myApiUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }


}
