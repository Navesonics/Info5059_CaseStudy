
//expense-detail.components.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Expense } from '@app/expense/expense';
import { Employee } from '@app/employee/employee';
import { EXPENSE_DEFAULT } from '@app/constants';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
  templateUrl: './expense-detail.component.html',
  styles: [],
})
export class ExpenseDetailComponent implements OnInit {

  @Input() expense: Expense = EXPENSE_DEFAULT;
  @Input() employees: Employee[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  employeeid: FormControl;
  categoryid: FormControl;
  description: FormControl;
  amount: FormControl;
  receipt: FormControl;
  dateincurred: FormControl;

  expenseForm: FormGroup;

    constructor(private builder: FormBuilder) {
        this.employeeid = new FormControl('', Validators.compose([Validators.required, Validators.min(1)]));
        this.categoryid = new FormControl('', Validators.compose([Validators.required]));
        this.description = new FormControl('', Validators.compose([Validators.required]));
        this.amount = new FormControl('', Validators.compose([Validators.required]));
        this.receipt = new FormControl('', Validators.compose([Validators.required]));
        this.dateincurred = new FormControl('', Validators.compose([Validators.required]));

        this.expenseForm = this.builder.group({
            employeeid: this.employeeid,
            categoryid: this.categoryid,
            description: this.description,
            amount: this.amount,
            receipt: this.receipt,
            dateincurred: this.dateincurred,
        });
    }

    ngOnInit(): void {
        this.expenseForm.patchValue({
            employeeid: this.expense.employeeid,
            categoryid: this.expense.categoryid,
            description: this.expense.description,
            amount: this.expense.amount,
            receipt: this.expense.receipt,
            dateincurred: new Date(this.expense.dateincurred),
        });
    }

    updateExpenseInDetail(): void {
        this.expense.employeeid = this.expenseForm.value.employeeid;
        this.expense.categoryid = this.expenseForm.value.categoryid;
        this.expense.description = this.expenseForm.value.description;
        this.expense.amount = this.expenseForm.value.amount;
        this.expense.receipt = this.expenseForm.value.receipt;
        this.expense.dateincurred = this.expenseForm.value.dateincurred;

        this.saved.emit(this.expense);
    }
}
