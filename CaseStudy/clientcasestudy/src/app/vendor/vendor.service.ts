//vendor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';

import { Vendor } from '@app/vendor/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends GenericHttpService<Vendor> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `vendors`);
  } // constructor

  /**
  * Retrieves the vendors JSON, then returns the array to a subscriber
  * we're temporarily using an any type (typically a bad idea) because the Spring Boot
  * repository returns all the data in an "embedded" property
  */

  // Fetch all employees
  get(): Observable<Vendor[]> {
    return super.getAll().pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  //Fetch an employee by ID (if needed)
  override getById(id: number): Observable<Vendor> {
    return super.getById(id).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Update an existing employee
  override  update(vendor: Vendor): Observable<Vendor> {
    return super.update(vendor).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Add a new employee
  add(vendor: Vendor): Observable<Vendor> {
    vendor.id = 0;
    return super.create(vendor).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Delete an employee by ID
  override delete(id: number): Observable<any> {
    return super.delete(id).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Error handling (inherits from GenericHttpService)
  override handleError(error: any) {
    return super.handleError(error); // Use the error handling from GenericHttpService
  }
} // VendorService
