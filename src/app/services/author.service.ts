import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Author } from '../interfaces/author';

// Define GraphQL queries and mutations
const GET_AUTHORS = gql`
  query GetAuthors {
    getAuthors {
      id
      firstName
      middleName
      firstLastName
      secondLastName
      nationality
    }
  }
`;

const GET_AUTHOR = gql`
  query GetAuthor($id: String!) {
    getAuthorById(id: $id) {
      id
      firstName
      middleName
      firstLastName
      secondLastName
      nationality
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($author: AuthorInput!) {
    createAuthor(author: $author) {
      id
      firstName
      middleName
      firstLastName
      secondLastName
      nationality
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: String!, $author: AuthorInput!) {
    updateAuthor(id: $id, author: $author) {
      id
      firstName
      middleName
      firstLastName
      secondLastName
      nationality
    }
  }
`;

const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: String!) {
    deleteAuthor(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private apollo: Apollo) {}

  createAuthor(author: Author): Observable<Author> {
    return this.apollo.mutate<{ createAuthor: Author }>({
      mutation: CREATE_AUTHOR,
      variables: {
        author: {
          id: author.id,
          firstName: author.firstName,
          middleName: author.middleName,
          firstLastName: author.firstLastName,
          secondLastName: author.secondLastName,
          nationality: author.nationality
        }
      }
    }).pipe(
      map(result => result.data?.createAuthor as Author)
    );
  }

  getAuthors(): Observable<Author[]> {
    return this.apollo.watchQuery<{ getAuthors: Author[] }>({
      query: GET_AUTHORS
    }).valueChanges.pipe(
      map(result => result.data.getAuthors as Author[])
    );
  }

  getAuthorById(id: string): Observable<Author> {
    return this.apollo.watchQuery<{ getAuthorById: Author }>({
      query: GET_AUTHOR,
      variables: { id }
    }).valueChanges.pipe(
      map(result => result.data.getAuthorById as Author)
    );
  }

  updateAuthor(id: string, author: Author): Observable<Author> {
    return this.apollo.mutate<{ updateAuthor: Author }>({
      mutation: UPDATE_AUTHOR,
      variables: {
        id,
        author: {
          id: author.id,
          firstName: author.firstName,
          middleName: author.middleName,
          firstLastName: author.firstLastName,
          secondLastName: author.secondLastName,
          nationality: author.nationality
        }
      }
    }).pipe(
      map(result => result.data?.updateAuthor as Author)
    );
  }

  deleteAuthor(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteAuthor: boolean }>({
      mutation: DELETE_AUTHOR,
      variables: { id }
    }).pipe(
      map(result => result.data?.deleteAuthor || false)
    );
  }
}