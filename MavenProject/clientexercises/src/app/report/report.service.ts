//report.service.ts
import { Injectable } from '@angular/core';
import { Report } from '@app/report/report';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends GenericHttpService<Report> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `reports`);
  }

  override getSome(id: number): Observable<Report[]> {
    return super.getSome(id).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

}

