import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Author } from '../../interfaces/author';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-form-book',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './form-book.component.html',
  styleUrl: './form-book.component.css'
})
export class FormBookComponent {

  BookForm = new FormGroup({
    isbn: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    title: new FormControl('', [Validators.required]),
    editorial: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    publicationYear: new FormControl('', [Validators.required]),
    authors: new FormControl('', [Validators.required])
  })

  id = ''
  action = ''
  object: Book = {} as Book

  constructor(private router: Router, private _BookService: BookService, private aRouter: ActivatedRoute, private authorService: AuthorService) {
    this.id = this.aRouter.snapshot.paramMap.get('isbn')!
  }


  ngOnInit() {
    if (this.router.url === `/admin/books/formBook/edit/${this.id}`) {
      this.action = 'edit'
      this.getBook()
    }
    else {
      this.action = 'add'
    }
  }

  getBook(){
    this._BookService.getBookById(this.id).subscribe((data) => {
      this.BookForm.setValue({
        isbn: data.isbn,
        title: data.title!,
        editorial: data.editorial!,
        genre: data.genre!,
        publicationYear: String (data.publicationYear!),
        authors: data.authors.map(a=>a.id).join(',')
      })
    })
  }

  saveBook() {
    if (this.BookForm.valid) {
      const Book: Book = {
        isbn: this.BookForm.value.isbn!,
        title: this.BookForm.value.title!,
        editorial: this.BookForm.value.editorial!,
        genre: this.BookForm.value.genre!,
        publicationYear: Number(this.BookForm.value.publicationYear!),
        authors: this.parseAuthors(this.BookForm.value.authors!)
      }

      if (this.action == 'add'){
        this._BookService.createBook(Book).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Book created successfully",
              text: `Book ${Book.title} was created!!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, error: (e: HttpErrorResponse) => {
            
              Swal.fire({
                icon: "error",
                title: "Error creating Book",
                text: `Check the form fields and try later`,
                showConfirmButton: false,
                timer: 2000
              })
            
          } 
        })  
      } else {
        this._BookService.updateBook(this.id, Book).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Book updated successfully",
              text: `Book ${Book.title} was updated!!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, error: (e: HttpErrorResponse) => {
            
              Swal.fire({
                icon: "error",
                title: "Error updating Book",
                text: `Check the form fields and try later`,
                showConfirmButton: false,
                timer: 2000
              })
          } 
        })
      }

    } else {
      console.log(this.BookForm)
      Swal.fire({
        icon: "error",
        title: "Form is not valid",
        text: `Check the form fields and try later`,
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  parseAuthors(authors: string): Author[]{
    const arr = authors.split(',')
    const authorsArr: Author[] = []
    arr.map(x => {
      this.authorService.getAuthorById(x.trim()).subscribe((data) => {
        authorsArr.push(data)
      })
    })
    return authorsArr
  }

  goBack(){
    this.router.navigate(['admin/books'])
  }

}
