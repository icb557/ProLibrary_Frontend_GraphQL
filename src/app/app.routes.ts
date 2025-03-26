import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { FormPersonComponent } from './pages/form-person/form-person.component';
import { FormAuthorComponent } from './pages/form-author/form-author.component';
import { FormBookComponent } from './pages/form-book/form-book.component';

export const routes: Routes = [{
    title: 'Admin',
    path: '',
    component: AdminComponent
}, {
    title: 'Form Person',
    path: 'formPerson',
    component: FormPersonComponent
}, {
    title: 'Form Author',
    path: 'formAuthor',
    component: FormAuthorComponent
}, {
    title: 'Form Book',
    path: 'formBook',
    component: FormBookComponent
}];
