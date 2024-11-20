// integer.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const INTEGER_REGEXP = /^\d+$/;
    if (!INTEGER_REGEXP.test(control.value)) {
      return { invalidInteger: true };
    }
    return null;
  };
}
