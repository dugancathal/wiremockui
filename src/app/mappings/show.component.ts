import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { EMPTY_MAPPING, Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mapping-show',
  styleUrls: ['./show.component.scss'],
  templateUrl: './show.component.html',
})
export class MappingShowComponent implements OnInit {
  keys = (obj) => Object.keys(obj || {})
  showJSON = false
  mapping: Mapping = EMPTY_MAPPING
  private mappingId: string

  constructor(private route: ActivatedRoute, private wiremockService: WiremockService) {

  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.mappingId = params.get('id')
      return this.wiremockService.mapping(this.mappingId)
    })).subscribe(mapping => {
      this.mapping = mapping
    })
  }
}