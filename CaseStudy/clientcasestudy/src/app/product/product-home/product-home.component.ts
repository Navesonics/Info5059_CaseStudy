//product-home.components.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { VendorService } from '@app/vendor/vendor.service';
import { PRODUCT_DEFAULT } from '@app/constants';
import { ProductDetailComponent } from '@app/product/product-detail/product-detail.component';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule,
    MatComponentsModule,
    MatTableModule,
    MatSortModule,
    VendorModule,
    ProductDetailComponent,
  ],
  templateUrl: './product-home.component.html',
  styles: ``
})

export class ProductHomeComponent implements OnInit {
  msg: string = '';
  showDetails: boolean = false;
  isExistingProduct: boolean = false;
  displayedColumns: string[] = ['Product No.', 'Name', 'Vendor ID'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  vendors: Vendor[] = [];
  productInDetail: Product = PRODUCT_DEFAULT

  constructor(public productService: ProductService, public vendorService: VendorService) {
  }

  ngOnInit(): void {
    this.getAllVendors();
    this.getAllProducts();
  }

  getAllProducts(verbose: boolean = true): void {
    this.productService.getAll().subscribe({
      next: (products: Product[]) => this.dataSource.data = products,
      error: (e: Error) => this.msg = `Failed to load products - ${e.message}`,
      complete: () => verbose ? this.msg = `Products loaded!` : null,
    });
  }

  getAllVendors(verbose: boolean = true): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => this.vendors = vendors,
      error: (e: Error) => this.msg = `Failed to load vendors - ${e.message}`,
      complete: () => verbose ? this.msg = `Vendors loaded!` : null,
    });
  }

  select(selectedProduct: Product): void {
    this.productInDetail = selectedProduct;
    this.msg = `Product ${selectedProduct.id} selected`;
    this.showDetails = true;
  }

  save(product: Product): void {
    if (this.dataSource.data.find((p) => p.id === product.id)) {
      this.update(product);
    }
    else{
      this.create(product);
    }
  }

  cancel(): void {
    this.msg = 'Operation cancelled';
    this.showDetails = false;
  }

  create(product: Product): void {
    this.msg = 'Creating product...';
    this.productService.create(product).subscribe({
      next: (p: Product) => {
        this.msg = p.id
          ? `Product ${p.id} added!`
          : `Product ${p.id} not added!`;
        this.getAllProducts(false); // Refresh table - Not verbose
      },
      error: (e: Error) => this.msg = `Create failed! - ${e.message}`,
      complete: () => this.showDetails = false,
    });
  }

  update(product: Product): void {
    this.msg = 'Updating product...';
    console.log("Updating 1");
    this.productService.update(product).subscribe({

      next: (p: Product) => {
        console.log("Updating 2");
        this.msg = `Product ${p.id} updated!`;
        this.getAllProducts(false); // Refresh table - Not verbose
      },
      error: (e: Error) => this.msg = `Update failed! - ${e.message}`,
      complete: () => this.showDetails = false,
    });
  }

  delete(product: Product): void {
    this.productService.deleteString(product.id).subscribe({
      next: (rowsUpdated: String) => {
        this.msg = `Product ${product.id} deletion complete`;
        this.getAllProducts(false); // Refresh table - Not verbose
      },
      error: (e: Error) => (this.msg = `Delete failed! - ${e.message}`),
      complete: () => this.showDetails = false,
    });
  }

  startNewProduct(): void {
    this.productInDetail = Object.assign({}, PRODUCT_DEFAULT);
    this.msg = 'New product';
    this.showDetails = true;
  }

  // sortProductsWithObjectLiterals(sort: Sort): void {
  //   const literals = {
  //     id: () =>
  //       this.dataSource.data = this.dataSource.data.sort(
  //         (a: Product, b: Product) => sort.direction === 'asc'
  //           ? (a.id.localeCompare(b.id)) // Assuming `id` is a string
  //           : (b.id.localeCompare(a.id))
  //       ),

  //     name: () =>
  //       this.dataSource.data = this.dataSource.data.sort(
  //         (a: Product, b: Product) => sort.direction === 'asc'
  //           ? (a.name.localeCompare(b.name))
  //           : (b.name.localeCompare(a.name))
  //       ),

  //     vendorid: () =>
  //       this.dataSource.data = this.dataSource.data.sort(
  //         (a: Product, b: Product) => sort.direction === 'asc'
  //           ? (a.vendorid - b.vendorid)
  //           : (b.vendorid - a.vendorid)
  //       ),
  //   };

  //   literals[sort.active as keyof typeof literals]();
  // }
}
