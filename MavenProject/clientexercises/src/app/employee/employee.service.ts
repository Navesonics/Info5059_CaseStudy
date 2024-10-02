//employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';
import { Employee } from '@app/employee/employee';

@Injectable({
  providedIn: 'root',
})

export class EmployeeService extends GenericHttpService<Employee> {
  //resourceURL: string;
  constructor(httpClient: HttpClient) {
    super(httpClient, `employees`);
    //this.resourceURL = `${BASE_URL}/api/employees`;
  } // constructor
  /**
  * Retrieves the employeee JSON, then returns the array to a subscriber
  * we're temporarily using an any type (typically a bad idea) because the Spring Boot
  * repository returns all the data in an "embedded" property
  */
  // get(): Observable<Employee[]> {
  //   return this.http
  //     .get<Employee[]>(this.resourceURL)
  //     //.put<Employee>(`${this.resourceURL}`, employee)
  //     .pipe(retry(1), catchError(this.handleError));
  // } // get

    // Fetch all employees
  get(): Observable<Employee[]> {
    return super.getAll().pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  //Fetch an employee by ID (if needed)
  override getById(id: number): Observable<Employee> {
    return super.getById(id).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // update(employee: Employee): Observable<Employee> {
  //   return this.http
  //     .put<Employee>(`${this.resourceURL}`, employee)
  //     .pipe(retry(1), catchError(this.handleError));
  // } // update

  // Update an existing employee
  override  update(employee: Employee): Observable<Employee> {
    return super.update(employee).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // add(employee: Employee): Observable<Employee> {
  //   employee.id = 0;
  //   return this.http
  //     .post<Employee>(this.resourceURL, employee)
  //     .pipe(retry(1), catchError(this.handleError));
  // } // add3

  // Add a new employee
  add(employee: Employee): Observable<Employee> {
    employee.id = 0; // Ensure the new employee ID is reset to 0
    return super.create(employee).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // delete(id: number): Observable<number> {
  //   return this.http
  //     .delete<number>(`${this.resourceURL}/${id}`)
  //     .pipe(retry(1), catchError(this.handleError));
  // } // delete

  // Delete an employee by ID
  override delete(id: number): Observable<any> {
    return super.delete(id).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // // Error handling
  // handleError(error: any) {
  //   let errorMessage = error.message;
  //   console.log(error);
  //   console.log(errorMessage);

  //   return throwError(() => errorMessage);
  // }

  // Error handling (inherits from GenericHttpService)
  override handleError(error: any) {
    return super.handleError(error); // Use the error handling from GenericHttpService
  }
} // EmployeeService
