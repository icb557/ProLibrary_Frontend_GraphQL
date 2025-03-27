import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private myAppUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:8080'
  }
  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.myAppUrl}/person`, person);
  }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.myAppUrl}/people`);
  }

  getPersonByUsername(username: string): Observable<Person> {
    return this.http.get<Person>(`${this.myAppUrl}/person/${username}`);
  }

  searchPersonByUsername(username: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.myAppUrl}/person/search?username=${username}`);
  }

  updatePerson(username: string, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.myAppUrl}/person/${username}`, person);
  }

  deletePerson(username: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}/person/${username}`);
  }


}
