import { FormControl, ValidatorFn } from '@angular/forms'

export const oneOf = (acceptableValues: string[]): ValidatorFn => {
  return (control: FormControl) => {
    if (acceptableValues.some(val => val === control.value)) {
      return null
    }

    return {
      'field': `must be one of ${acceptableValues.join(', ')}`
    }
  }
}