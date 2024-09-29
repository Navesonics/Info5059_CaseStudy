//vendor-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styles: ``
})


export class VendorHomeComponent implements OnInit {
  //vendors: Array<Vendor>;
  msg: string;
  vendors$?: Observable<Vendor[]>;
  vendor: Vendor;
  hideEditForm: boolean;
  initialLoad: boolean;

  constructor(public vendorService: VendorService) {
    this.vendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
    this.msg = '';
    this.hideEditForm = true;
    this.initialLoad = true;
  } // constructor

  ngOnInit(): void {
    //this.msg = 'loading vendors from server...';
    this.vendors$ = this.vendorService.get().pipe(
    tap(() => {
        if (!this.initialLoad) {
          this.msg = 'Vendors loaded via async pipe';
          this.initialLoad = true;
        }
      })
    );
  } // ngOnInit

  select(vendor: Vendor): void {
    this.vendor = vendor;
    this.msg = `Vendor ${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select

  /**
  * cancelled - event handler for cancel button
  */
  cancel(): void {
    this.msg = 'Operation cancelled';
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
  * update - send changed update to service
  */
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe({
      // Create observer object
      next: (vend: Vendor) => (this.msg = `Vendor ${vend.name} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update

} // VendorHomeComponent
