import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book.service'; // Updated import path

@Component({
  selector: 'app-books',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  books: Book[] = [];
  searchTitle: string = ''; // Changed from searchIsbn to searchTitle to match GraphQL query

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  formAdd() {
    this.router.navigate(['admin/books/formBook/create']);
  }

  formEdit(isbn: string) {
    this.router.navigate([`admin/books/formBook/edit/${isbn}`]);
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        console.log('Loaded books:', this.books);
      },
      error: (error) => {
        console.error('Error loading books', error);
      }
    });
  }

  searchBook() {
    if (!this.searchTitle.trim()) {
      this.loadBooks();
      return;
    }

    this.bookService.searchBook(this.searchTitle).subscribe({
      next: (result: Book[]) => {
        this.books = result;
        console.log('Search result:', this.books);
      },
      error: (error) => {
        console.error('Error searching Book', error);
        this.books = []; // Clear books on error
      }
    });
  }

  deleteBook(isbn: string) {
    if (confirm('Are you sure you want to delete this Book?')) {
      this.bookService.deleteBook(isbn).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.isbn !== isbn);
        },
        error: (error) => {
          console.error('Error deleting Book', error);
        }
      });
    }
  }
}