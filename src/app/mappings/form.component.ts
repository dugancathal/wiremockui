import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { HttpMethods } from '../lib/http/http-methods'
import { collectErrors } from '../lib/validators/collect-errors'
import { oneOf } from '../lib/validators/one-of'
import { EMPTY_MAPPING, Mapping } from '../wiremock/mapping'

@Component({
  selector: 'mapping-form',
  styleUrls: ['./mapping.component.scss'],
  templateUrl: './form.component.html',
})
export class MappingFormComponent implements OnChanges {
  keys = (obj) => Object.keys(obj || {})
  @Input() mapping: Mapping = EMPTY_MAPPING
  @Output() onSave: EventEmitter<Mapping> = new EventEmitter<Mapping>()
  form: FormGroup

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.buildForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.buildForm()
  }

  save() {
    if(!this.form.valid) {
      alert(JSON.stringify(collectErrors(this.form)))
      return
    }
    this.onSave.emit(this.form.value)
  }

  get patternsControls() {
    const requestControl = this.form.controls['request'] as FormGroup
    return requestControl.controls['bodyPatterns'] as FormArray
  }

  headerControls(reqOrResp) {
    const requestControl = this.form.controls[reqOrResp] as FormGroup
    return requestControl.controls['headers'] as FormGroup
  }

  addBodyMatcher() {
    this.patternsControls.push(new FormControl())
  }

  removeBodyPattern(i: number) {
    const requestControl = this.form.controls['request'] as FormGroup
    const patternsControl = requestControl.controls['bodyPatterns'] as FormArray
    patternsControl.removeAt(i)
  }

  addRequestHeader(header: string) {
    this.headerControls('request').addControl(header, new FormControl(''))
  }

  addResponseHeader(header: string) {
    this.headerControls('response').addControl(header, new FormControl(''))
  }

  removeRequestHeader(header: string) {
    this.headerControls('request').removeControl(header)
  }

  removeResponseHeader(header: string) {
    this.headerControls('response').removeControl(header)
  }

  private buildForm() {
    return this.fb.group({
      'name': this.mapping.name,
      'request': this.fb.group({
        'method': this.fb.control(this.mapping.request.method, [Validators.required, oneOf(HttpMethods)]),
        'url': this.fb.control(this.mapping.request.url, [Validators.required]),
        'headers': this.fb.group(
          this.keys(this.mapping.request.headers)
            .reduce((acc, header) => {
              acc[header] = this.mapping.request.headers[header]
              return acc
            }, {})
        ),
        'bodyPatterns': this.fb.array(
          this.mapping.request.bodyPatterns
        ),
      }),
      'response': this.fb.group({
        'status': this.fb.control(this.mapping.response.status, [Validators.required, Validators.min(0)]),
        'body': this.mapping.response.body,
        'headers': this.fb.group(
          this.keys(this.mapping.response.headers)
            .reduce((acc, header) => {
              acc[header] = this.mapping.response.headers[header]
              return acc
            }, {})
        )
      })
    })
  }
}