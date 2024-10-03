//expense-home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';
import { Employee } from '@app/employee/employee';
import { EmployeeModule } from '@app/employee/employee.module';
import { EmployeeService } from '@app/employee/employee.service';
import { EXPENSE_DEFAULT } from '@app/constants';
import { ExpenseDetailComponent } from '@app/expense/expense-detail/expense-detail.component';

@Component({
  selector: 'app-expense-home',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, EmployeeModule, ExpenseDetailComponent],
  templateUrl: './expense-home.component.html',
})
export class ExpenseHomeComponent implements OnInit {
  msg: string = '';
  showDetails: boolean = false;
  displayedColumns: string[] = ['id', 'dateincurred', 'employeeid'];
  dataSource: MatTableDataSource<Expense> = new MatTableDataSource<Expense>();
  employees: Employee[] = [];
  expenseInDetail: Expense = EXPENSE_DEFAULT

  constructor(public expenseService: ExpenseService, public employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getAllEmployees();
    this.getAllExpenses();
  }

  getAllExpenses(verbose: boolean = true): void {
    this.expenseService.getAll().subscribe({
      next: (expenses: Expense[]) => this.dataSource.data = expenses,
      error: (e: Error) => this.msg = `Failed to load expenses - ${e.message}`,
      complete: () => verbose ? this.msg = `Expenses loaded!` : null,
    });
  }

  getAllEmployees(verbose: boolean = true): void {
    this.employeeService.getAll().subscribe({
      next: (employees: Employee[]) => this.employees = employees,
      error: (e: Error) => this.msg = `Failed to load employees - ${e.message}`,
      complete: () => verbose ? this.msg = `Employees loaded!` : null,
    });
  }

  select(selectedExpense: Expense): void {
    this.expenseInDetail = selectedExpense;
    this.msg = `Expense ${selectedExpense.id} selected`;
    this.showDetails = true;
  }

  save(expense: Expense): void {
    expense.id ? this.update(expense) : this.create(expense);
  }

  cancel(): void {
    this.msg = 'Operation cancelled';
    this.showDetails = false;
  }

  create(expense: Expense): void {
    this.msg = 'Creating expense...';
    this.expenseService.create(expense).subscribe({
      next: (e: Expense) => {
        this.msg = e.id > 0
          ? `Expense ${e.id} added!`
          : `Expense ${e.id} not added!`;
        this.getAllExpenses(false); // Refresh table - Not verbose
      },
      error: (e: Error) => this.msg = `Create failed! - ${e.message}`,
      complete: () => this.showDetails = false,
    });
  }

  update(expense: Expense): void {
    this.msg = 'Updating expense...';
    this.expenseService.update(expense).subscribe({
      next: (e: Expense) => {
        this.msg = `Expense ${e.id} updated!`;
        this.getAllExpenses(false); // Refresh table - Not verbose
      },
      error: (e: Error) => this.msg = `Update failed! - ${e.message}`,
      complete: () => this.showDetails = false,
    });
  }

  delete(expense: Expense): void {
    this.expenseService.delete(expense.id).subscribe({
      next: (rowsUpdated: number) => {
        this.msg = rowsUpdated === 1
          ? `Expense ${expense.id} deleted!`
          : `Expense ${expense.id} not deleted!`;
        this.getAllExpenses(false); // Refresh table - Not verbose
      },
      error: (e: Error) => (this.msg = `Delete failed! - ${e.message}`),
      complete: () => this.showDetails = false,
    });
  }

  startNewExpense(): void {
    this.expenseInDetail = Object.assign({}, EXPENSE_DEFAULT);
    this.msg = 'New expense';
    this.showDetails = true;
  }

  sortExpensesWithObjectLiterals(sort: Sort): void {
    const literals = {

      id: () =>
        this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) => sort.direction === 'asc'
            ? (a.id - b.id)
            : (b.id - a.id)
        ),

      employeeid: () =>
        this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) => sort.direction === 'asc'
            ? (a.employeeid - b.employeeid)
            : (b.employeeid - a.employeeid)
        ),

      dateincurred: () =>
        this.dataSource.data = this.dataSource.data.sort(
          (a: Expense, b: Expense) => sort.direction === 'asc'
            ? (a.dateincurred < b.dateincurred ? -1 : 1)
            : (b.dateincurred < a.dateincurred ? -1 : 1)
        ),
    };

    literals[sort.active as keyof typeof literals]();
  }
}
