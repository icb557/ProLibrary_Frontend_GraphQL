import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Person } from '../../interfaces/person';
import { PersonService } from '../../services/person.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, isEmpty, of, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-form-person',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './form-person.component.html',
  styleUrl: './form-person.component.css'
})
export class FormPersonComponent {
  personForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('', [Validators.required])

  });
  constructor(private router: Router, private _personService: PersonService) {


  }

  createPerson() {
    if (this.personForm.valid) {

      const person: Person = {
        username: this.personForm.value.username!,
        password: this.personForm.value.password!,
        role: this.personForm.value.role!
      }
      console.log(person)
      this._personService.createPerson(person).subscribe(data => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Person Created",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/admin/users'])

        })


      })
    }

  }
}

