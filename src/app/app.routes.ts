import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { FormPersonComponent } from './pages/form-person/form-person.component';
import { FormAuthorComponent } from './pages/form-author/form-author.component';
import { FormBookComponent } from './pages/form-book/form-book.component';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeComponent } from './pages/employee/employee.component';

export const routes: Routes = [{
    title: 'Login',
    path: '',
    component: LoginComponent
},{
    title: 'Admin',
    path: 'admin',
    component: AdminComponent
}, {
    title: 'FormPerson',
    path: 'admin/formPerson',
    component: FormPersonComponent
}, {
    title: 'FormAuthor',
    path: 'admin/formAuthor',
    component: FormAuthorComponent
}, {
    title: 'FormBook',
    path: 'admin/formBook',
    component: FormBookComponent
}, {
    title: 'Employee',
    path: 'employee',
    component: EmployeeComponent
}];
