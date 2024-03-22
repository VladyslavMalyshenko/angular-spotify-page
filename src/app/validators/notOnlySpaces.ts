import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notOnlySpaces(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowed = control.value.trim();
    return !allowed ? { onlySpaces: { value: control.value } } : null;
  };
}
