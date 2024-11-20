// decimal.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function decimalValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const DECIMAL_REGEXP = /^\d+(\.\d{1,2})?$/;
    if (!DECIMAL_REGEXP.test(control.value)) {
      return { invalidDecimal: true };
    }
    return null;
  };
}
