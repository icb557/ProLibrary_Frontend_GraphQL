import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { FormPersonComponent } from './pages/form-person/form-person.component';
import { FormAuthorComponent } from './pages/form-author/form-author.component';
import { FormBookComponent } from './pages/form-book/form-book.component';

export const routes: Routes = [{
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
}];
