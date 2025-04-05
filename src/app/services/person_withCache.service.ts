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
      },
      // Update cache to include the new person
      update: (cache, { data }) => {
        if (!data) return;
        
        const newPerson = data.createPerson;
        
        updateGQLCache(cache, newPerson, 'create')
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
      variables: { username },
      fetchPolicy: 'network-only' // Ensure we always fetch from the server
    }).valueChanges.pipe(
      map(result => result.data.getPersonById as Person)
    );
  }

  searchPersonByUsername(username: string): Observable<Person[]> {
    return this.apollo.watchQuery<{ searchPersonByUsername: Person[] }>({
      query: SEARCH_PERSON,
      variables: { username },
      fetchPolicy: 'network-only' // Ensure we always fetch from the server
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
      },
      // Update cache to include the new person
      update: (cache, { data }) => {
        if (!data) return;
        
        const updatedPerson = data.updatePerson;
        
        updateGQLCache(cache, updatedPerson, 'update')
      }
    }).pipe(
      map(result => result.data?.updatePerson as Person)
    );
  }

  deletePerson(username: string): Observable<boolean> {
    return this.apollo.mutate<{ deletePerson: boolean }>({
      mutation: DELETE_PERSON,
      variables: { username },
      // Update cache to remove deleted person
      update: (cache) => {
        const person: Person = {
          username,
          password: '', // Password is not needed for cache update
          role: '' // Role is not needed for cache update
        }
        updateGQLCache(cache, person, 'delete')
      }
    }).pipe(
      map(result => result.data?.deletePerson || false)
    );
  }

}

function updateGQLCache (cache: ApolloCache<any>, newPerson: Person, operation: string) {
    // Read the query from cache
    const existingData = cache.readQuery<{ getPeople: Person[] }>({
        query: GET_PEOPLE
    });
    
    let getPeople: Person[] = []
    switch (operation) {
        case 'create':
            getPeople = [...existingData!.getPeople, newPerson]
            break;
        case 'update':
          getPeople = existingData!.getPeople.map(p => p.username === newPerson.username ? newPerson : p)
          break;
        case 'delete':
            getPeople = existingData!.getPeople.filter(p => p.username !== newPerson.username)
            break;
        default:
            getPeople = existingData!.getPeople          
            break;            
    }
    // Write back to the cache with new person included
    if (existingData) {
        cache.writeQuery({
        query: GET_PEOPLE,
        data: {
            getPeople
        }
        });
    }
}