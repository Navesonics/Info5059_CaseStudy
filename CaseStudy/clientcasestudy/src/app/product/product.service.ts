import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '@app/product/product';
import { retry, catchError } from 'rxjs/operators';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService extends GenericHttpService<Product> {

  constructor(httpClient: HttpClient)
  {
    super(httpClient, 'products');
  }

  //return the product as an observable
  override getAll(): Observable<Product[]>{
    return super.getAll().pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}
