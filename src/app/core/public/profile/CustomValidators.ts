import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class CustomValidators {
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordField)?.value;
      const confirmPassword = form.get(confirmPasswordField)?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
