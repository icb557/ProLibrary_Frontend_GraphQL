import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { FormPersonComponent } from './pages/form-person/form-person.component';

export const routes: Routes = [{
    title: 'Admin',
    path: '',
    component: AdminComponent
}, {
    title: 'Form Person',
    path: 'formPerson',
    component: FormPersonComponent
}];
