//vendor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASE_URL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Vendor } from './vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  resourceURL: string;
  constructor(public http: HttpClient) {
    this.resourceURL = `${BASE_URL}/api/vendors`;
  } // constructor

  /**
  * Retrieves the vendors JSON, then returns the array to a subscriber
  * we're temporarily using an any type (typically a bad idea) because the Spring Boot
  * repository returns all the data in an "embedded" property
  */

  get(): Observable<Vendor[]> {
    return this.http
    .get<Vendor[]>(this.resourceURL)
    .pipe(retry(1), catchError(this.handleError));
  } // get

  update(vendor: Vendor): Observable<Vendor> {
  return this.http
    .put<Vendor>(`${this.resourceURL}`, vendor)
    .pipe(retry(1), catchError(this.handleError));
  } // update

  add(vendor: Vendor): Observable<Vendor> {
    vendor.id = 0;
    return this.http
      .post<Vendor>(this.resourceURL, vendor)
      .pipe(retry(1), catchError(this.handleError));
  } // add

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
} // VendorService
