import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';



@NgModule({
  declarations: [
    VendorListComponent,
    VendorHomeComponent
  ],
  imports: [CommonModule, MatComponentsModule],
})
export class VendorModule { }
