//employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Employee } from './employee';

@Injectable({
  providedIn: 'root',
})

export class EmployeeService {
  resourceURL: string;
  constructor(public http: HttpClient) {
    this.resourceURL = `${BASE_URL}/api/employees`;
  } // constructor
  /**
  * Retrieves the employeee JSON, then returns the array to a subscriber
  * we're temporarily using an any type (typically a bad idea) because the Spring Boot
  * repository returns all the data in an "embedded" property
  */
   get(): Observable<Employee[]> {
     return this.http
       .get<Employee[]>(this.resourceURL)
       //.put<Employee>(`${this.resourceURL}`, employee)
       .pipe(retry(1), catchError(this.handleError));
   } // get
   
   update(employee: Employee): Observable<Employee> {
     return this.http
       .put<Employee>(`${this.resourceURL}`, employee)
       .pipe(retry(1), catchError(this.handleError));
   } // update
   
   add(employee: Employee): Observable<Employee> {
     employee.id = 0;
     return this.http
       .post<Employee>(this.resourceURL, employee)
       .pipe(retry(1), catchError(this.handleError));
   } // add3

   delete(id: number): Observable<number> {
     return this.http
       .delete<number>(`${this.resourceURL}/${id}`)
       .pipe(retry(1), catchError(this.handleError));
   } // delete

   // Error handling
   handleError(error: any) {
     let errorMessage = error.message;
     console.log(error);
     console.log(errorMessage);

     return throwError(() => errorMessage);
   }

} // EmployeeService
