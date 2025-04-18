import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../interfaces/book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

books: Book[] = []
searchTitle = ''

constructor(private bookService: BookService){

}

ngOnInit(): void {
  this.loadbooks();
}

loadbooks() {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error loading books', error);
        Swal.fire({
          icon: "error",
          title: "Error Loading Books",
          text: `Try again later`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  searchBook() {
    if (!this.searchTitle.trim()) {
      this.loadbooks();
      return;
    }


    this.bookService.searchBook(this.searchTitle).subscribe({
      next: (result: Book[]) => {
        this.books = result;
      },
      error: (error) => {
        console.error('Error searching Book', error);
        Swal.fire({
          icon: "error",
          title: "Error Loading Books",
          text: `Try again later`,
          showConfirmButton: false,
          timer: 1500
        });
        this.books = []; // Clear books on error
      }
    });
  }

}
