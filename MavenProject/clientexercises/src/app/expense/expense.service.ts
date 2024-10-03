//expense.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Expense } from '@app/expense/expense';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends GenericHttpService<Expense> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `expenses`);
  }

  // Return the expenses as an Observable
  override getAll(): Observable<Expense[]> {
    return super.getAll().pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}

