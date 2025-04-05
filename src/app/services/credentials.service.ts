import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Credential } from '../interfaces/credential';

// Define GraphQL mutation for login
const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password })
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  constructor(private apollo: Apollo) {}

  login(creds: Credential): Observable<string> {
    return this.apollo.mutate<{ login: string }>({
      mutation: LOGIN,
      variables: {
        username: creds.username,
        password: creds.password
      }
    }).pipe(
      map(result => result.data?.login as string)
    );
  }
}