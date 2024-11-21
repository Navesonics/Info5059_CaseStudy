import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="customdialog" style="position: relative;">
      <!-- Close Button -->
      <button
        mat-icon-button
        mat-dialog-close
        id="deleteCancel"
        style="position: absolute; top: 10px; right: 10px; font-size: xx-large; z-index: 10;"
      >
        <mat-icon>close</mat-icon>
      </button>

      <!-- Title -->
      <h2 mat-dialog-title class="mat-mdc-dialog-title" style="padding-top: 50px;">{{ title }}</h2>

      <!-- Content -->
      <mat-dialog-content class="mat-mdc-dialog-content">
        Do you wish to delete this {{ entityname }}?
      </mat-dialog-content>

      <!-- Actions -->
      <mat-dialog-actions style="display: flex; justify-content: space-between; padding: 0 10px;">
        <button mat-raised-button id="deleteNo" mat-dialog-close>No</button>
        <button mat-raised-button id="deleteYes" color="warn" [mat-dialog-close]="true">Yes</button>
      </mat-dialog-actions>
    </div>



  `
})
export class DeleteDialogComponent {
  title: string = '';
  entityname: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.entityname = data.entityname
  }
}
