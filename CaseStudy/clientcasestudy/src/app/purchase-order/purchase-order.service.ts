//purchase-order.service.ts
import { Injectable } from '@angular/core';
import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService extends GenericHttpService<PurchaseOrder> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `pos`);
  }

  // Return the expenses as an Observable
  override getAll(): Observable<PurchaseOrder[]> {
    return super.getAll().pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

}


