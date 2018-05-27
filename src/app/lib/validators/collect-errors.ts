import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms'

export const collectErrors = (control: AbstractControl, name: any = '', depth = name): { [controlKey: string]: ValidationErrors } => {
  const newDepth = depth.length === 0 ? name : `${depth}.${name}`

  if (control.invalid && control instanceof FormControl) {
    return {[newDepth]: control.errors}
  } else if (control instanceof FormGroup) {
    return Object.keys(control.controls).reduce((acc, controlName) => {
      return {...acc, ...collectErrors(control.controls[controlName], controlName, newDepth)}
    }, {})
  } else if (control instanceof FormArray) {
    return control.controls.reduce((acc, subControl, index) => {
      return {...acc, ...collectErrors(subControl, index, newDepth)}
    }, {})
  }

  return {}
}