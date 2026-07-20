import { Routes } from '@angular/router';
import { Courses } from './Pages/courses/courses';
import { Admin } from './Pages/admin/admin';

export const routes: Routes = [
    {
        path: "",
        component: Courses,
        pathMatch: 'full'
    },
    {
        path: "admin",
        component: Admin
    }
];
