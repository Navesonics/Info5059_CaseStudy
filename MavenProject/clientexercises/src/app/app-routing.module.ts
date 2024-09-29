//app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeHomeComponent } from './employee/employee-home/employee-home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Exercises - Home' },
  { path: 'employees', component: EmployeeHomeComponent, title: 'Exercises - Employees' },
  { path: '', component: HomeComponent, title: 'Exercises - Home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
