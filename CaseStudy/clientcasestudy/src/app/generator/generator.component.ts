import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';

import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';

import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@app/purchase-order/purchase-order-item';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';

import { VENDOR_DEFAULT, PRODUCT_DEFAULT } from '@app/constants';
import { FileReadOptions } from 'fs/promises';

@Component({
  selector: 'app-purchase-order-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
})

export class GeneratorComponent implements OnInit, OnDestroy {

  // To prevent memory leaks
  formSubscription?: Subscription;

  msg: string = '';
  vendors: Vendor[] = [];
  selectedVendor: Vendor = VENDOR_DEFAULT;
  vendorProducts: Product[] = [];
  selectedProduct: Product = PRODUCT_DEFAULT;
  purchaseOrderItems: PurchaseOrderItem[] = [];

  vendorForm: FormControl;
  productForm: FormControl;
  quantityForm: FormControl;
  generatorFormGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService
  ) {

    this.vendorForm = new FormControl('');
    this.productForm = new FormControl('');
    this.quantityForm = new FormControl('');
    this.generatorFormGroup = this.builder.group({
      vendor: this.vendorForm,
      product: this.productForm,
      quantity: this.quantityForm,
    });
  }

  ngOnInit(): void {
    this.msg = 'Loading Vendor from server...';
    this.setupOnVendorPickedEvent();
    this.setupOnProductPickedEvent();
    this.setupOnQuantityPickedEvent();
    this.getAllVendors();
  }

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  }

  setupOnVendorPickedEvent(): void {
    this.formSubscription = this.generatorFormGroup.get('vendor')?.valueChanges.subscribe((vendor) => {
      if (vendor === null) return;
      this.selectedVendor = vendor;
      this.loadVendorProducts();
      this.selectedProduct = Object.assign({}, PRODUCT_DEFAULT);
      this.productForm.reset();
      this.quantityForm.reset();
      this.purchaseOrderItems = [];
      this.msg = 'Choose product for vendor';
    });
  }

  setupOnProductPickedEvent(): void {
    const productSubscription = this.generatorFormGroup.get('product')?.valueChanges.subscribe(product => {
      if (product === null) return;
      this.selectedProduct = product;
    });

    this.formSubscription?.add(productSubscription);
  }

  setupOnQuantityPickedEvent(): void{
    const quantitySubscription = this.generatorFormGroup.get('quantity')?.valueChanges.subscribe(quantity => {
      if (quantity === null) return;


      if(this.isProductAlreadySelected(this.selectedProduct.id)){

        let item = this.getPOItem(this.selectedProduct.id)
        if(item){
          item.qty = quantity;
        }
        else{
        }
        this.purchaseOrderItems = this.purchaseOrderItems.filter(item => item.qty > 0);


      }
      else{
        let poItem: PurchaseOrderItem= {
          id: 0,
          poid: 0,
          productid: this.selectedProduct.id,
          qty: quantity,
          price: this.selectedProduct.costprice,
        }
        this.purchaseOrderItems.push(poItem);
      }
      this.msg = `${quantity} - ${this.selectedProduct.name}(s) Added!`;

      console.log(this.purchaseOrderItems);

    });

    this.formSubscription?.add(quantitySubscription);

  }

  getAllVendors(verbose: boolean = true): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => this.vendors = vendors,
      error: (e: Error) => this.msg = `Failed to load Vendors - ${e.message}`,
      complete: () => verbose ? this.msg = `Vendors loaded!` : null,
    });
  }

  loadVendorProducts(verbose: boolean = true): void {
    this.vendorProducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      next: (payload: Product[]) => this.vendorProducts = payload,
      error: (err: Error) => this.msg = `Products fetch failed! - ${err.message}`,

      complete: () => verbose ? this.msg = `Products loaded!` : null,
    });
  }

  getPOItem(productid: string): PurchaseOrderItem | undefined {
    return this.purchaseOrderItems.find(item => item.productid === productid);
  }

  isProductAlreadySelected(productid: string): boolean {
    return this.purchaseOrderItems.find(item => item.productid === productid) !== undefined;
  }

  subtotal(): number{
    let result = 0;
    this.purchaseOrderItems.forEach(item => result += item.price * item.qty);
    return result;
  }
  tax(): number{
    const TAX_RATIO = 0.13;
    let result = 0;
    result = this.subtotal() * TAX_RATIO;
    return result;
  }
  total(): number{
    let result = 0;
    result = this.subtotal() + this.tax();
    return result;
  }

  createPurchaseOrder(): void {
    const purchaseOrder: PurchaseOrder = {
      id: 0,
      vendorid: this.selectedVendor.id,
      amount: this.total(),
      podate: '',
      items: this.purchaseOrderItems,

    };

    this.purchaseOrderService.create(purchaseOrder).subscribe({
      next: (purchaseOrder: PurchaseOrder) => {
        purchaseOrder.id > 0
          ? (this.msg = `Purchase Order ${purchaseOrder.id} added!`)
          : (this.msg = 'Purchase Order not added! - server error');
      },
      error: (err: Error) => (this.msg = `PurchaseOrder not added! - ${err.message}`),
      complete: () => this.resetGenerator(),
    });
  }

  resetGenerator(): void {
    this.productForm.reset();
    this.vendorForm.reset();
    this.quantityForm.reset();
    this.selectedVendor = Object.assign({}, VENDOR_DEFAULT);
    this.selectedProduct = Object.assign({}, PRODUCT_DEFAULT);
    this.vendorProducts = [];
    this.purchaseOrderItems = [];
  }
}

