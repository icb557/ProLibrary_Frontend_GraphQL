import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book.service';
import Swal from 'sweetalert2';
import { Author } from '../../interfaces/author';
import { AuthorService } from '../../services/author.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-book',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, ReactiveFormsModule],
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
  });

  id = '';
  action = '';

  constructor(
    private router: Router, 
    private _BookService: BookService, 
    private aRouter: ActivatedRoute, 
    private authorService: AuthorService
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('isbn')!;
  }

  ngOnInit() {
    console.log('FormBookComponent initialized');
    if (this.router.url === `/admin/books/formBook/edit/${this.id}`) {
      this.action = 'edit';
      this.getBook();
    } else {
      this.action = 'add';
    }
  }

  getBook() {
    console.log('Fetching book with ID:', this.id);
    this._BookService.getBookById(this.id).subscribe({
      next: (data) => {
        console.log('Book fetched:', data);
        this.BookForm.setValue({
          isbn: data.isbn,
          title: data.title,
          editorial: data.editorial,
          genre: data.genre,
          publicationYear: String(data.publicationYear),
          authors: data.authors.map(a => a.id).join(',')
        });
      },
      error: (error) => {
        console.error('Error fetching book:', error);
        Swal.fire({
          icon: "error",
          title: "Error Loading Book",
          text: "Could not load the book details.",
          showConfirmButton: true
        });
      }
    });
  }

  async saveBook() {
    console.log('saveBook method called');
    
    if (!this.BookForm.valid) {
      console.log('Form is invalid:', this.BookForm.errors);
      Swal.fire({
        icon: "error",
        title: "Form is not valid",
        text: "Please check the form fields and try again.",
        showConfirmButton: true
      });
      return;
    }
    
    const formValues = this.BookForm.value;
    console.log('Form values:', formValues);
    
    // Extract author IDs from the comma-separated string
    const authorIds = formValues.authors!.split(',').map(id => id.trim()).filter(id => id !== '');
    console.log('Author IDs:', authorIds);
    
    if (authorIds.length === 0) {
      console.log('No author IDs provided');
      Swal.fire({
        icon: "error",
        title: "No Authors",
        text: "Please specify at least one author.",
        showConfirmButton: true
      });
      return;
    }
    
    try {
      // Fetch authors sequentially and collect them in an array
      const authors: Author[] = [];
      
      for (const authorId of authorIds) {
        try {
          // Convert observable to promise using firstValueFrom
          const author = await firstValueFrom(this.authorService.getAuthorById(authorId));
          delete author.__typename;
          authors.push(author);
          console.log(`Author ${authorId} fetched:`, author);
        } catch (error) {
          console.error(`Error fetching author ${authorId}:`, error);
          throw new Error(`Could not fetch author with ID: ${authorId}`);
        }
      }
      
      console.log('All authors fetched:', authors);
      
      // Create the book object with the fetched authors
      const book: Book = {
        isbn: formValues.isbn!,
        title: formValues.title!,
        editorial: formValues.editorial!,
        genre: formValues.genre!,
        publicationYear: Number(formValues.publicationYear!),
        authors: authors
      };
      
      console.log('Book object created:', book);
      
      // Perform create or update based on action
      if (this.action === 'add') {
        console.log('Creating new book');
        // Convert observable to promise
        const result = await firstValueFrom(this._BookService.createBook(book));
        console.log('Book created:', result);
        this.showSuccessAndNavigate('created');
      } else {
        console.log('Updating book with ID:', this.id);
        // Convert observable to promise
        const result = await firstValueFrom(this._BookService.updateBook(this.id, book));
        console.log('Book updated:', result);
        this.showSuccessAndNavigate('updated');
      }
    } catch (error) {
      console.error('Error in saveBook process:', error);
      Swal.fire({
        icon: "error",
        title: this.action === 'add' ? "Error Creating Book" : "Error Updating Book",
        text: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        showConfirmButton: true
      });
    }
  }
  
  showSuccessAndNavigate(action: string) {
    Swal.fire({
      icon: "success",
      title: `Book ${action} successfully`,
      text: `Book "${this.BookForm.value.title}" was ${action}!`,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.goBack();
    });
  }
  
  showError(action: string) {
    Swal.fire({
      icon: "error",
      title: `Error ${action} Book`,
      text: "An error occurred. Please try again later.",
      showConfirmButton: true
    });
  }

  goBack() {
    this.router.navigate(['admin/books']);
  }
}