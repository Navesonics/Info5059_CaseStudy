import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatComponentsModule } from '@app/mat-components/mat-components.module';

import { Employee } from '@app/employee/employee';
import { EmployeeService } from '@app/employee/employee.service';

import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';

import { Report } from '@app/report/report';
import { ReportItem } from '@app/report/report-item';
import { ReportService } from '@app/report/report.service';

import { EMPLOYEE_DEFAULT } from '@app/constants';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './report-generator.component.html',
})
export class GeneratorComponent implements OnInit, OnDestroy {

  // To prevent memory leaks
  formSubscription?: Subscription;

  msg: string = '';
  employees: Employee[] = [];
  selectedEmployee: Employee = EMPLOYEE_DEFAULT;
  employeeExpenses: Expense[] = [];
  reportItems: ReportItem[] = [];
  total: number = 0;

  employeeForm: FormControl;
  expenseForm: FormControl;
  generatorFormGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private expenseService: ExpenseService,
    private reportService: ReportService
  ) {

    this.employeeForm = new FormControl('');
    this.expenseForm = new FormControl('');
    this.generatorFormGroup = this.builder.group({
      employee: this.employeeForm,
      expense: this.expenseForm,
    });
  }

  ngOnInit(): void {
    this.msg = 'Loading employees from server...';
    this.setupOnEmployeePickedEvent();
    this.setupOnExpensePickedEvent();
    this.getAllEmployees();
  }

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  }

  setupOnEmployeePickedEvent(): void {
    this.formSubscription = this.generatorFormGroup.get('employee')?.valueChanges.subscribe((employee) => {
      if (!employee) return;
      this.selectedEmployee = employee;
      this.loadEmployeeExpenses();
      this.reportItems = [];
      this.msg = 'Choose expense for employee';
    });
  }

  setupOnExpensePickedEvent(): void {
    const expenseSubscription = this.generatorFormGroup.get('expense')?.valueChanges.subscribe(expense => {
      if (!expense) return;

      const item: ReportItem = {
        id: 0,
        reportid: 0,
        expenseid: expense.id,
      };

      if (!this.isExpenseAlreadySelected(expense)) {
        this.reportItems.push(item);
        this.total += expense.amount;
      }
    });

    this.formSubscription?.add(expenseSubscription);
  }

  getAllEmployees(verbose: boolean = true): void {
    this.employeeService.getAll().subscribe({
      next: (employees: Employee[]) => this.employees = employees,
      error: (e: Error) => this.msg = `Failed to load employees - ${e.message}`,
      complete: () => verbose ? this.msg = `Employees loaded!` : null,
    });
  }

  loadEmployeeExpenses(): void {
    this.employeeExpenses = [];
    this.expenseService.getSome(this.selectedEmployee.id).subscribe({
      next: (expenses: Expense[]) => this.employeeExpenses = expenses,
      error: (err: Error) => this.msg = `expenses fetch failed! - ${err.message}`
    });
  }

  getExpense(expenseid: number): Expense | undefined {
    return this.employeeExpenses.find(e => e.id === expenseid);
  }

  selectedExpenses(): Expense[] {
    let expenses: Expense[] = [];
    this.reportItems.forEach(ri => {
      let expense = this.getExpense(ri.expenseid);
      if (expense) {
        expenses.push(expense);
      }
    });
    return expenses;
  }

  isExpenseAlreadySelected(expense: Expense): boolean {
    return this.reportItems.find(item => item.expenseid === expense.id) !== undefined;
  }

  unselectedEmployeeExpenses() : Expense[] {
    return this.employeeExpenses.filter(e => !this.isExpenseAlreadySelected(e));
  }

  createReport(): void {
    const report: Report = {
      id: 0,
      items: this.reportItems,
      employeeid: this.selectedEmployee.id,
    };

    this.reportService.create(report).subscribe({
      next: (report: Report) => {
        report.id > 0
          ? (this.msg = `Report ${report.id} added!`)
          : (this.msg = 'Report not added! - server error');
      },
      error: (err: Error) => (this.msg = `Report not added! - ${err.message}`),
      complete: () => this.resetGenerator(),
    });
  }

  resetGenerator(): void {
    this.expenseForm.reset();
    this.employeeForm.reset();
    this.selectedEmployee = Object.assign({}, EMPLOYEE_DEFAULT);
    this.employeeExpenses = [];
    this.reportItems = [];
    this.total = 0;
  }
}
