//vendor-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styles: ``
})


export class VendorHomeComponent implements OnInit {
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
    this.vendors$ = this.vendorService.get();
  } // ngOnInit

  select(vendor: Vendor): void {
    this.vendor = vendor;
    this.msg = `Vendor ${vendor.name} selected`;
    this.toggleEditForm();
  } // select

  cancel(): void {
    this.msg = 'Operation cancelled';
    this.toggleEditForm();
  } // cancel

  update(vendor: Vendor): void {
    console.log('Updating vendor:', vendor);
    this.vendorService.update(vendor).subscribe({
      next: (vend: Vendor) => (this.msg = `Vendor ${vend.name} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // update

  save(vendor: Vendor): void {
    console.log('Saving vendor:', vendor);
    vendor.id ? this.update(vendor) : this.add(vendor);
  }// save

  add(vendor: Vendor): void {
    console.log('Adding vendor:', vendor);
    vendor.id = 0;
    this.vendorService.add(vendor).subscribe({
      next: (vend: Vendor) => (this.msg = `Vendor ${vend.id} added!`),
      error: (err: Error) => (this.msg = `Vendor not added! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // add

  delete(vendor: Vendor): void {
    console.log('Deleting vendor:', vendor);
    this.vendorService.delete(vendor.id).subscribe({
      next: (numOfVendorsDeleted: number) => {
        this.msg = numOfVendorsDeleted === 1 ? `Vendor ${vendor.name} deleted!` : 'Employee not deleted';
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => this.toggleEditForm(),
    });
  } // delete

  toggleEditForm(): void {
    this.hideEditForm = !this.hideEditForm;
  }

  newVendor(): void {
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
    this.toggleEditForm();
    this.msg = 'New Vendor';
  } // newVendor



} // VendorHomeComponent
