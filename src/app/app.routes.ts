import { Routes } from '@angular/router';
import { Courses } from './Pages/courses/courses';
import { Admin } from './Pages/admin/admin';
import { Appointments } from './Pages/appointment/appointments';

export const routes: Routes = [
  {
    path: '',
    component: Courses,
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: 'appointment',
    component: Appointments,
  },
];
