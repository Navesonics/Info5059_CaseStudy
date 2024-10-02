import { AbstractControl } from '@angular/forms';

export function ValidatePhone(control: AbstractControl): { invalidPhone: boolean } | null {
  const PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
  return !PHONE_REGEXP.test(control.value) ? { invalidPhone: true } : null;
} // ValidatePhone

// Email validation
export function ValidateEmail(control: AbstractControl): { [key: string]: boolean } | null {
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return !EMAIL_REGEXP.test(control.value) ? { invalidEmail: true } : null;
}
