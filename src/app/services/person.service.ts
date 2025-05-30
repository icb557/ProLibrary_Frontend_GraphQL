import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Person } from '../interfaces/person';
import { ApolloCache } from '@apollo/client/cache';

// Define GraphQL queries and mutations
const GET_PEOPLE = gql`
  query GetPeople {
    getPeople {
      username
      password
      role
    }
}
`;

const GET_PERSON = gql`
  query GetPerson($username: String!) {
    getPersonById(username: $username) {
      username
      password
      role
    }
  }
`;

const SEARCH_PERSON = gql`
  query SearchPerson($username: String!) {
    searchPersonByUsername(username: $username) {
      username
      password
      role
    }
  }
`;

const CREATE_PERSON = gql`
  mutation CreatePerson($person: PersonInput!) {
    createPerson(person: $person) {
      username
      password
      role
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($username: String!, $person: PersonInput!) {
    updatePerson(username: $username, person: $person) {
      username
      password
      role
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($username: String!) {
    deletePerson(username: $username)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private apollo: Apollo) {}

  createPerson(person: Person): Observable<Person> {
    return this.apollo.mutate<{ createPerson: Person }>({
      mutation: CREATE_PERSON,
      variables: {
        person: {
          username: person.username,
          password: person.password,
          role: person.role
        }
      }
    }).pipe(
      map(result => result.data?.createPerson as Person)
    );
  }

  getPeople(): Observable<Person[]> {
    return this.apollo.watchQuery<{ getPeople: Person[] }>({
      query: GET_PEOPLE
    }).valueChanges.pipe(
      map(result => result.data.getPeople as Person[])
    );
  }

  getPersonByUsername(username: string): Observable<Person> {
    return this.apollo.watchQuery<{ getPersonById: Person }>({
      query: GET_PERSON,
      variables: { username }
    }).valueChanges.pipe(
      map(result => result.data.getPersonById as Person)
    );
  }

  searchPersonByUsername(username: string): Observable<Person[]> {
    return this.apollo.watchQuery<{ searchPersonByUsername: Person[] }>({
      query: SEARCH_PERSON,
      variables: { username }
    }).valueChanges.pipe(
      map(result => result.data.searchPersonByUsername as Person[])
    );
  }

  updatePerson(username: string, person: Person): Observable<Person> {
    return this.apollo.mutate<{ updatePerson: Person }>({
      mutation: UPDATE_PERSON,
      variables: {
        username,
        person: {
          username: person.username,
          password: person.password,
          role: person.role
        }
      }
    }).pipe(
      map(result => result.data?.updatePerson as Person)
    );
  }

  deletePerson(username: string): Observable<boolean> {
    return this.apollo.mutate<{ deletePerson: boolean }>({
      mutation: DELETE_PERSON,
      variables: { username }
    }).pipe(
      map(result => result.data?.deletePerson || false)
    );
  }

}