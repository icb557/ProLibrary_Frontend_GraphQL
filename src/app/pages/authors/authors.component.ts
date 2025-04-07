import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { FormAuthorComponent } from '../form-author/form-author.component';
import { Author } from '../../interfaces/author';
import { AuthorService } from '../../services/author.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-authors',
  imports: [NavbarComponent, FormAuthorComponent, FooterComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})

export class AuthorsComponent {

  rol = localStorage.getItem('rol')
  showForm = false

  currentIndex: number = 0;

  list: Author[] = []

  constructor(private _AuthorService: AuthorService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.router.url === '/admin/authors/create' || /\/admin\/authors\/edit\/\d+/.test(this.router.url))
      this.showForm = true
    else
      this.showForm = false
    this.getAuthors()
  }

  getAuthors() {
    this._AuthorService.getAuthors().subscribe((data) => {
      this.list = data
    })
  }


  deleteAuthor(id: string, name: string) {
    Swal.fire({
      title: "Are you sure you want to remove the Author?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        this._AuthorService.deleteAuthor(id).subscribe({
          next: (data) => {
            if (!data) {
              Swal.fire({
                icon: "error",
                title: "Error Deleting Author",
                text: `Make sure the author is not associated with any book`,
                showConfirmButton: false,
                timer: 2000
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: `Author ${name} deleted!!`,
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                window.location.reload()
              })
            }
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Author",
              text: `${e.error.message}`,
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
      }
    });
  }


  editAuthor(id: string) {
    this.router.navigate([`admin/authors/formAuthor/edit/${id}`])
  }

  addAuthor() {
    this.router.navigate(['admin/authors/formAuthor/create'])
  }
}
