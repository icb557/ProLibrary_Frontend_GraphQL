import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Person } from '../../interfaces/person';
import { PersonService } from '../../services/person.service';
import { ApolloError } from '@apollo/client/core';
import Swal from 'sweetalert2';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-form-person',
  imports: [FormsModule, ReactiveFormsModule, FooterComponent, NavbarComponent],
  templateUrl: './form-person.component.html',
  styleUrl: './form-person.component.css'
})
export class FormPersonComponent {
  personForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('', [Validators.required])
  });

  username = ''
  action = ''

  constructor(private router: Router, private _personService: PersonService, private aRouter: ActivatedRoute) {
    this.username = this.aRouter.snapshot.paramMap.get('username')!
  }

  ngOnInit() {
    if (this.router.url === `/admin/users/formPerson/edit/${this.username}`) {
      this.action = 'edit'
      this.getPerson()
    }
    else {
      this.action = 'add'
    }
  }

  getPerson() {
    this._personService.getPersonByUsername(this.username).subscribe({
      next: (data) => {
        if (data) {
          this.personForm.setValue({
            username: data.username,
            password: data.password!,
            role: data.role[0].toUpperCase() + data.role.substring(1).toLowerCase()!
          })
        } else {
          Swal.fire({
            icon: "error",
            title: "Person not found",
            showConfirmButton: false,
            timer: 2000
          })
          this.goBack();
        }
      },
      error: (err: ApolloError) => {
        console.error('GraphQL error:', err);
        Swal.fire({
          icon: "error",
          title: "Error retrieving person",
          text: `Could not load person data`,
          showConfirmButton: false,
          timer: 2000
        })
        this.goBack();
      }
    });
  }

  createPerson() {
    if (this.personForm.valid) {
      const person: Person = {
        username: this.personForm.value.username!,
        password: this.personForm.value.password!,
        role: this.personForm.value.role!
      }
      
      if (this.action == 'add') {
        this._personService.createPerson(person).subscribe({
          next: (createdPerson) => {
            Swal.fire({
              icon: "success",
              title: "Person created successfully",
              text: `Person ${createdPerson.username} was created!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, 
          error: (err) => {
            console.error('GraphQL error:', err);
            Swal.fire({
              icon: "error",
              title: "Error creating person",
              text: `Check the form fields and try later`,
              showConfirmButton: false,
              timer: 2000
            })
          } 
        })
      } else {
        this._personService.updatePerson(this.username, person).subscribe({
          next: (updatedPerson) => {
            Swal.fire({
              icon: "success",
              title: "Person updated successfully",
              text: `Person ${updatedPerson.username} was updated!`,
              showConfirmButton: false,
              timer: 1500
            })
            this.goBack();
          }, 
          error: (err) => {
            console.error('GraphQL error:', err);
            Swal.fire({
              icon: "error",
              title: "Error updating person",
              text: `Check the form fields and try later`,
              showConfirmButton: false,
              timer: 2000
            })
          } 
        })
      }
    }
  }

  goBack() {
    this.router.navigate(['admin/users'])
  }
}