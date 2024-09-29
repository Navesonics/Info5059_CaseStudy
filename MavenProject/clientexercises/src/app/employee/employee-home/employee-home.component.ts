import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
@Component({
templateUrl: 'employee-home.component.html',
})
export class EmployeeHomeComponent implements OnInit {
employees: Array<Employee>;
msg: string;
constructor(public employeeService: EmployeeService) {
this.employees = [];
this.msg = '';
} // constructor
ngOnInit(): void {
this.msg = 'loading employees from server...';
this.employeeService.get().subscribe({
// Observer object, complete method intrinscally unsubscribes
next: (payload: any) => {
this.employees = payload._embedded.employees;
this.msg = 'employees loaded!!';
},
error: (err: Error) => (this.msg = `Get failed! - ${err.message}`),
complete: () => {},
}); // subscribe
} // ngOnInit
} // EmployeeHomeComponent
