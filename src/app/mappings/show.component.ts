import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { EMPTY_MAPPING, Mapping, RecordedRequest } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mapping-show',
  styleUrls: ['./mapping.component.scss'],
  templateUrl: './show.component.html',
})
export class MappingShowComponent implements OnInit {
  keys = (obj) => Object.keys(obj || {})
  showJSON = false
  mapping: Mapping = EMPTY_MAPPING
  requests: RecordedRequest[] = []
  private mappingId: string
  showRecordings: boolean = false

  constructor(private route: ActivatedRoute, private wiremockService: WiremockService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.mappingId = params.get('id')
      return this.wiremockService.mapping(this.mappingId)
    })).subscribe((mapping: Mapping) => {
      this.mapping = mapping
      this.fetchRequests(mapping)
      this.fetchBody(mapping)
    })
  }

  private fetchRequests(mapping: Mapping) {
    this.wiremockService.requestsMatching(mapping.request)
      .subscribe(requests => this.requests = requests)
  }

  private fetchBody(mapping: Mapping) {
    if (mapping.response.bodyFileName) {
      this.wiremockService.bodyFile(mapping.response.bodyFileName)
        .subscribe(body => this.mapping = {
          ...mapping,
          response: {
            ...mapping.response,
            body
          }
        })
    }
  }
}