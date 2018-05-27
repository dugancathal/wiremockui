import { FormBuilder, Validators } from '@angular/forms'
import { collectErrors } from './collect-errors'

describe('collectErrors', () => {
  it('returns top level errors with the correct nesting', () => {
    const fb = new FormBuilder()
    const errors = collectErrors(fb.group({
      'name': fb.control('', [Validators.required])
    }))
    expect(errors).toEqual({
      'name': {required: true}
    })
  })

  it('returns nested errors with the parent key in the name', () => {
    const fb = new FormBuilder()
    const errors = collectErrors(fb.group({
      'address': fb.group({
        street: fb.control('', [Validators.required])
      })
    }))
    expect(errors).toEqual({
      'address.street': {required: true}
    })
  })

  it('returns the correct index for formArray controls', () => {
    const fb = new FormBuilder()
    const errors = collectErrors(fb.group({
      'phoneNumbers': fb.array([
        fb.group({number: fb.control('', [Validators.required])}),
        fb.group({number: fb.control('303-999-3231', [Validators.required])}),
      ])
    }))

    expect(errors).toEqual({
      'phoneNumbers.0.number': {required: true}
    })
  })
})