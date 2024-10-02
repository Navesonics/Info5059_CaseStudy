//employee-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { catchError,tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'employee-home.component.html',
})
export class EmployeeHomeComponent implements OnInit {
  msg: string;
  employees$?: Observable<Employee[]>;
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
    this.msg = `Loading...`;
    this.getAll();
  } // ngOnInit
  /**
  * getAll - retrieve everything
  */
  getAll(): void {
    this.employees$ = this.employeeService.getAll();
    this.employees$.subscribe({
      error: (e: Error) => this.msg = `Couldn't get employees - ${e.message}`,
      complete: () => this.msg = `Employees loaded!`,
    });
  } // getAll

  select(employee: Employee): void {
    this.employee = employee;
    this.msg = `${employee.lastname} selected`;
    this.toggleEditForm();
  } // select

  /**
   * Cancelled - event handler for cancel button
  */
  cancel(): void {
    this.msg = 'Operation cancelled';
    this.toggleEditForm();
  } // cancel
  /**
   * Update - send changed update to service
  */
  update(employee: Employee): void {
    this.employeeService.update(employee).subscribe({
      next: (emp: Employee) => (this.msg = `Employee ${emp.id} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // update

  /**
   * Save - determine whether we're doing an add or an update
  */
  save(employee: Employee): void {
    employee.id ? this.update(employee) : this.add(employee);
  }

  /**
   * Add - send employee to service, receive new employee back
  */
  add(employee: Employee): void {
    employee.id = 0;
    this.employeeService.add(employee).subscribe({
      next: (emp: Employee) => {
        this.msg = `Employee ${emp.id} added!`;
      },
      error: (err: Error) => (this.msg = `Employee not added! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // add

  /**
   * Delete - send employee id to service for deletion
  */
  delete(employee: Employee): void {
    this.employeeService.delete(employee.id).subscribe({
      next: (numOfEmployeesDeleted: number) => {
        this.msg = numOfEmployeesDeleted === 1 ? `Employee ${employee.lastname} deleted!` : 'Employee not deleted';
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // delete

  /**
   * Confirm Delete - prompts user to confirm the deletion
   */
  confirmDelete(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.lastname}?`)) {
      this.delete(employee);
    }
  }

  /**
   * Toggle Edit Form - handles toggling the visibility of the form
   */
  toggleEditForm(): void {
    this.hideEditForm = !this.hideEditForm;
  }

  /**
   * New Employee - create new employee instance
  */
  newEmployee(): void {
    this.employee = {
      id: 0,
      title: '',
      firstname: '',
      lastname: '',
      phoneno: '',
      email: '',
    };
    this.toggleEditForm();
    this.msg = 'New Employee';
  } // newEmployee

} // EmployeeHomeComponent
