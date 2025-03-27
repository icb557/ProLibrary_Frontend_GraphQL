import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Person } from '../../interfaces/person';
import { AuthorService } from '../../services/author.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, isEmpty, of, switchMap, tap } from 'rxjs';
import { Author } from '../../interfaces/author';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-author',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './form-author.component.html',
  styleUrl: './form-author.component.css'
})
export class FormAuthorComponent {
  authorForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    middleName: new FormControl(''),
    firstLastName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    secondLastName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    nationality: new FormControl('', [Validators.required]),
  })

  id = ''
  action = ''
  object: Author = {} as Author

  constructor(private router: Router, private _authorService: AuthorService, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id')!
  }


  ngOnInit() {
    if (this.router.url === `/admin/authors/formAuthor/edit/${this.id}`) {
      this.action = 'edit'
      this.getAuthor()
    }
    else {
      this.action = 'add'
    }
  }

  getAuthor(){
    this._authorService.getAuthorById(this.id).subscribe((data) => {
      this.authorForm.setValue({
        id: data.id,
        firstName: data.firstName!,
        middleName: data.middleName!,
        firstLastName: data.firstLastName!,
        secondLastName: data.secondLastName!,
        nationality: data.nationality!
      })
    })
  }

  saveAuthor() {
    if (this.authorForm.valid) {
      console.log('wwwwwww')
      const author: Author = {
        id: this.authorForm.value.id!,
        firstName: this.authorForm.value.firstName!,
        middleName: this.authorForm.value.middleName!,
        firstLastName: this.authorForm.value.firstLastName!,
        secondLastName: this.authorForm.value.secondLastName!,
        nationality: this.authorForm.value.nationality!,
      }

      if (this.action == 'add'){
        this._authorService.createAuthor(author).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Author created successfully",
              text: `Author ${author.firstName + author.firstLastName} was created!!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, error: (e: HttpErrorResponse) => {
            
              Swal.fire({
                icon: "error",
                title: "Error creating author",
                text: `Check the form fields and try later`,
                showConfirmButton: false,
                timer: 2000
              })
            
          } 
        })  
      } else {
        this._authorService.updateAuthor(this.id, author).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Author updated successfully",
              text: `Author ${author.firstName + author.firstLastName} was updated!!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, error: (e: HttpErrorResponse) => {
            
              Swal.fire({
                icon: "error",
                title: "Error updating author",
                text: `Check the form fields and try later`,
                showConfirmButton: false,
                timer: 2000
              })
          } 
        })
      }

    } else {
      Swal.fire({
        icon: "error",
        title: "Form is not valid",
        text: `Check the form fields and try later`,
        showConfirmButton: false,
        timer: 2000
      })
    }
  }


  goBack(){
    this.router.navigate(['admin/authors'])
  }

}
