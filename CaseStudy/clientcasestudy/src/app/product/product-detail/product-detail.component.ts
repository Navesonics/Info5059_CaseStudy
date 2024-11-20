import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { MatExpansionModule } from '@angular/material/expansion';

import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { PRODUCT_DEFAULT } from '@app/constants';
import { ProductService } from '@app/product/product.service'; // Import ProductService
import { decimalValidator } from '@app/validators/decimal.validator';
import { integerValidator } from '@app/validators/integer.validator';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatComponentsModule, MatExpansionModule],
  templateUrl: './product-detail.component.html',
  styles: [],
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product = PRODUCT_DEFAULT;
  @Input() vendors: Vendor[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  products: Product[] = [];  // Ensure this array is populated with data

  id: FormControl;
  vendorid: FormControl;
  name: FormControl;
  costprice: FormControl;
  msrp: FormControl;
  rop: FormControl;
  eoq: FormControl;
  qoh: FormControl;
  qoo: FormControl;
  qrcode: FormControl;
  qrcodetext: FormControl;

  productForm: FormGroup;

  constructor(private builder: FormBuilder, private productService: ProductService) {
      this.id = new FormControl('', Validators.compose([Validators.required, this.uniqueCodeValidator(this.products)]));
      this.vendorid = new FormControl('', Validators.compose([Validators.required]));
      this.name = new FormControl('', Validators.compose([Validators.required]));
      // Apply decimal validator
      this.costprice = new FormControl('', Validators.compose([Validators.required, decimalValidator()]));
      this.msrp = new FormControl('', Validators.compose([Validators.required, decimalValidator()]));

      // Apply integer validator
      this.rop = new FormControl('', Validators.compose([Validators.required, integerValidator()]));
      this.eoq = new FormControl('', Validators.compose([Validators.required, integerValidator()]));
      this.qoh = new FormControl('', Validators.compose([Validators.required, integerValidator()]));
      this.qoo = new FormControl('', Validators.compose([Validators.required, integerValidator()]));
      this.qrcode = new FormControl();
      this.qrcodetext = new FormControl();

      this.productForm = this.builder.group({
          id: this.id,
          vendorid: this.vendorid,
          name: this.name,
          costprice: this.costprice,
          msrp: this.msrp,
          rop: this.rop,
          eoq: this.eoq,
          qoh: this.qoh,
          qoo: this.qoo,
          qrcode: this.qrcode,
          qrcodetext: this.qrcodetext,
      });
  }

  ngOnInit(): void {
      this.fetchAllProducts();  // Fetch products when the component initializes

      this.productForm.patchValue({
          id: this.product.id,
          vendorid: this.product.vendorid,
          name: this.product.name,
          costprice: this.product.costprice,
          msrp: this.product.msrp,
          rop: this.product.rop,
          eoq: this.product.eoq,
          qoh: this.product.qoh,
          qoo: this.product.qoo,
          qrcode: this.product.qrcode,
          qrcodetext: this.product.qrcodetext,
      });

      if (this.product.id) {
          this.id.disable();
      }
  }

  // Fetch all products and store them in the products array
  fetchAllProducts(): void {
      this.productService.getAll().subscribe({
          next: (products: Product[]) => {
              this.products = products;  // Now the products array will have data
              // Reapply the uniqueCodeValidator now that products have been fetched
              this.id.setValidators([Validators.required, this.uniqueCodeValidator(this.products)]);
              this.id.updateValueAndValidity();  // Revalidate the form control
          },
          error: (err: any) => {
              console.error('Failed to fetch products:', err);
          }
      });
  }

  uniqueCodeValidator(products: Product[]): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
          if (products.find((p) => p.id === control.value)) {
              return { idExists: true }; // Product ID already exists
          }
          return null; // No error, ID is unique
      };
  }

  updateProductInDetail(): void {
      this.product.id = this.productForm.get('id')?.value;
      this.product.vendorid = this.productForm.value.vendorid;
      this.product.name = this.productForm.value.name;
      this.product.costprice = this.productForm.value.costprice;
      this.product.msrp = this.productForm.value.msrp;
      this.product.rop = this.productForm.value.rop;
      this.product.eoq = this.productForm.value.eoq;
      this.product.qoh = this.productForm.value.qoh;
      this.product.qoo = this.productForm.value.qoo;
      this.product.qrcode = '';
      this.product.qrcodetext = '';
      this.saved.emit(this.product);
  }

  onCancel(): void {
      this.cancelled.emit();
  }

  onDelete(): void {
      this.deleted.emit(this.product);
  }
}
