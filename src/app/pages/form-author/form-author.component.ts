import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Person } from '../../interfaces/person';
import { AuthorService } from '../../services/author.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, isEmpty, of, switchMap, tap } from 'rxjs';
import { Author } from '../../interfaces/author';

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
    middleName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    secondLastName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    nationality: new FormControl('', [Validators.required]),
  })

  constructor(private router: Router, private _authorService: AuthorService) {

  }
  saveAuthor() {
    if (this.authorForm.valid) {
      const author: Author = {
        id: this.authorForm.value.id!,
        firstName: this.authorForm.value.firstName!,
        middleName: this.authorForm.value.middleName!,
        lastName: this.authorForm.value.lastName!,
        secondLastName: this.authorForm.value.secondLastName!,
        nationality: this.authorForm.value.nationality!,

      }
      console.log(author)
      this._authorService.createAuthor(author).subscribe(data => {
        console.log(data)
      })




    } else {
      console.error('Form is not valid');
    }
  }

}
