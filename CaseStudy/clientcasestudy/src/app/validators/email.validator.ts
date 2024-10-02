import { AbstractControl } from '@angular/forms';

// Email validation
export function ValidateEmail(control: AbstractControl): { [key: string]: boolean } | null {
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return !EMAIL_REGEXP.test(control.value) ? { invalidEmail: true } : null;
}
