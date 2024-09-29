//employee.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeHomeComponent } from './employee-home/employee-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeHomeComponent,
    EmployeeDetailComponent,
  ],

  imports: [
    CommonModule,
    MatComponentsModule,
    ReactiveFormsModule,
  ],
})
export class EmployeeModule {}
