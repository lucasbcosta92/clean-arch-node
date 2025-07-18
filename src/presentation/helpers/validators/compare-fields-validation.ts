import { InvalidParamError } from "../../errors";
import { Validation } from "./";

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) { }

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName])
      return new InvalidParamError(this.fieldToCompareName)
  }
}