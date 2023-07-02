import { FormErrorMap, ValidationError } from "./models";

export class FormError {
  private _errors: ValidationError[];
  public errors: FormErrorMap;

  constructor(errors: ValidationError[]) {
    this._errors = errors;
    this.errors = this.errorsToDictionary(errors);
  }

  errorsToDictionary(errors: ValidationError[]) {
    const dict: FormErrorMap = {};
    errors.forEach((e) => {
      dict[e.path] = e.msg;
    });
    return dict;
  }
}
