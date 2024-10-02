//employee-detail.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
})

export class EmployeeDetailComponent implements OnInit {
  @Input() selectedEmployee: Employee = {
    id: 0,
    title: '',
    firstname: '',
    lastname: '',
    phoneno: '',
    email: '',
  };

  @Input() employees: Employee[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter<Employee>();

  employeeForm: FormGroup;
  title: FormControl;
  firstname: FormControl;
  lastname: FormControl;
  phoneno: FormControl;
  email: FormControl;

  constructor(private builder: FormBuilder) {
    this.title = new FormControl('');
    this.firstname = new FormControl('');
    this.lastname = new FormControl('');
    this.phoneno = new FormControl('');
    this.email = new FormControl('');
    this.employeeForm = new FormGroup({
      title: this.title,
      firstname: this.firstname,
      lastname: this.lastname,
      phoneno: this.phoneno,
      email: this.email,
    });
  } // constructor

  ngOnInit(): void {
    // patchValue doesn’t care if all values present
    this.employeeForm.patchValue({
      title: this.selectedEmployee.title,
      firstname: this.selectedEmployee.firstname,
      lastname: this.selectedEmployee.lastname,
      phoneno: this.selectedEmployee.phoneno,
      email: this.selectedEmployee.email,
    });
  } // ngOnInit

  updateSelectedEmployee(): void {
    this.selectedEmployee.title = this.employeeForm.value.title;
    this.selectedEmployee.firstname = this.employeeForm.value.firstname;
    this.selectedEmployee.lastname = this.employeeForm.value.lastname;
    this.selectedEmployee.phoneno = this.employeeForm.value.phoneno;
    this.selectedEmployee.email = this.employeeForm.value.email;
    this.saved.emit(this.selectedEmployee);
  }
} // EmployeeDetailComponent
