import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Book } from '../interfaces/book';

// Define GraphQL queries and mutations
const GET_BOOKS = gql`
  query GetBooks {
    getBooks{
        isbn
        title
        editorial
        genre
        publicationYear
        authors{
            id
            firstName
            middleName
            firstLastName
            secondLastName
            nationality
        }
    }
}
`;

const GET_BOOK = gql`
  query GetBook($isbn: String!) {
    getBookById(isbn: $isbn) {
        isbn
        title
        editorial
        genre
        publicationYear
        authors{
            id
            firstName
            middleName
            firstLastName
            secondLastName
            nationality
        }
    }
  }
`;

const SEARCH_BOOK = gql`
  query SearchBook($title: String!) {
    searchBookByTitle(title: $title) {
        isbn
        editorial
        genre
        publicationYear
        title
        authors {
            firstLastName
            firstName
            id
            middleName
            nationality
            secondLastName
        }
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($book: BookInput!) {
    createBook(book: $book) {
        isbn
        title
        editorial
        genre
        publicationYear
        authors{
            id
            firstName
            middleName
            firstLastName
            secondLastName
            nationality
        }
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($isbn: String!, $book: BookInput!) {
    updateBook(isbn: $isbn, book: $book) {
      isbn
      title
      editorial
      genre
      publicationYear
      authors{
          id
          firstName
          middleName
          firstLastName
          secondLastName
          nationality
        }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($isbn: String!) {
    deleteBook(isbn: $isbn)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private apollo: Apollo) {}

  createBook(book: Book): Observable<Book> {
    return this.apollo.mutate<{ createBook: Book }>({
      mutation: CREATE_BOOK,
      variables: {
        book: {
          isbn: book.isbn,
          title: book.title,
          editorial: book.editorial,
          genre: book.genre,
          publicationYear: book.publicationYear,
          authors: book.authors
        }
      }
    }).pipe(
      map(result => result.data?.createBook as Book)
    );
  }

  getBooks(): Observable<Book[]> {
    return this.apollo.watchQuery<{ getBooks: Book[] }>({
      query: GET_BOOKS
    }).valueChanges.pipe(
      map(result => result.data.getBooks as Book[])
    );
  }

  getBookById(isbn: string): Observable<Book> {
    return this.apollo.watchQuery<{ getBookById: Book }>({
      query: GET_BOOK,
      variables: { isbn }
    }).valueChanges.pipe(
      map(result => result.data.getBookById as Book)
    );
  }

  searchBook(title: string): Observable<Book[]> {
    return this.apollo.watchQuery<{ searchBookByTitle: Book[] }>({
      query: SEARCH_BOOK,
      variables: { title }
    }).valueChanges.pipe(
      map(result => result.data.searchBookByTitle as Book[])
    );
  }

  updateBook(isbn: string, book: Book): Observable<Book> {
    return this.apollo.mutate<{ updateBook: Book }>({
      mutation: UPDATE_BOOK,
      variables: {
        isbn,
        book: {
          isbn: book.isbn,
          title: book.title,
          editorial: book.editorial,
          genre: book.genre,
          publicationYear: book.publicationYear,
          authors: book.authors
        }
      }
    }).pipe(
      map(result => result.data?.updateBook as Book)
    );
  }

  deleteBook(isbn: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteBook: boolean }>({
      mutation: DELETE_BOOK,
      variables: { isbn }
    }).pipe(
      map(result => result.data?.deleteBook || false)
    );
  }
}