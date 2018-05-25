import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { EMPTY_MAPPING, Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mapping-edit',
  styleUrls: ['./mapping.component.scss'],
  templateUrl: './edit.component.html',
})
export class MappingEditComponent implements OnInit {
  keys = (obj) => Object.keys(obj || {})
  mapping: Mapping = EMPTY_MAPPING
  form: FormGroup
  private mappingId: string

  constructor(private route: ActivatedRoute, private wiremockService: WiremockService, private fb: FormBuilder) {
    this.form = this.buildForm()
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.mappingId = params.get('id')
      return this.wiremockService.mapping(this.mappingId)
    })).subscribe((mapping: Mapping) => {
      this.mapping = mapping
      this.form = this.buildForm()
    })
  }

  save() {
    this.wiremockService.updateMapping(this.mappingId, {...this.mapping, ...this.form.value} as Mapping)
      .subscribe(
        (_) => alert('Success'),
        (res) => alert('Failure.' + JSON.stringify(res)),
      )
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
    this.headerControls('request').removeControl( header)
  }
  removeResponseHeader(header: string) {
    this.headerControls('response').removeControl( header)
  }

  private buildForm() {
    return this.fb.group({
      'name': this.mapping.name,
      'request': this.fb.group({
        'method': this.mapping.request.method,
        'url': this.mapping.request.url,
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
        'status': this.mapping.response.status,
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