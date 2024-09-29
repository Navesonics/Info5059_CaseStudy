//employee-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'employee-home.component.html',
})
export class EmployeeHomeComponent implements OnInit {
  //employees: Array<Employee>;
  msg: string;
  employees$?: Observable<Employee[]>;
  //loaded: boolean;
  employee: Employee;
  hideEditForm: boolean;
  initialLoad: boolean;

  constructor(public employeeService: EmployeeService) {
    this.employee = {
      id: 0,
      title: '',
      firstname: '',
      lastname: '',
      phoneno: '',
      email: '',
    };
    this.msg = '';
    this.hideEditForm = true;
    this.initialLoad = true;
  } // constructor

  ngOnInit(): void {
    this.msg = 'loading employees from server...';
    this.employees$ = this.employeeService.get().pipe(
      tap(() => {
          if (!this.initialLoad) {
            this.msg = 'Employees loaded via async pipe';
            this.initialLoad = true;
          }
        })
      );
  } // ngOnInit

  select(employee: Employee): void {
    this.employee = employee;
    this.msg = `${employee.lastname} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select

  /**
  * cancelled - event handler for cancel button
  */
  cancel(): void {
    this.msg = 'Operation cancelled';
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
  * update - send changed update to service
  */
  update(employee: Employee): void {
    this.employeeService.update(employee).subscribe({
      // Create observer object
      next: (emp: Employee) => (this.msg = `Employee ${emp.id} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update

} // EmployeeHomeComponent
