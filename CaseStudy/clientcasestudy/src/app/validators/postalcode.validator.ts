import { AbstractControl } from '@angular/forms';

// Canada Postal Code validation
export function ValidatePostalCode(control: AbstractControl): { [key: string]: boolean } | null {
  const POSTAL_CODE_REGEXP = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return !POSTAL_CODE_REGEXP.test(control.value) ? { invalidPostalCode: true } : null;
}
