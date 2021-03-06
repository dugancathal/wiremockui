import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
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
  private mappingId: string

  constructor(private route: ActivatedRoute, private wiremockService: WiremockService, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.mappingId = params.get('id')
      return this.wiremockService.mapping(this.mappingId)
    })).subscribe((mapping: Mapping) => {
      this.mapping = mapping
    })
  }

  save(mapping: Mapping) {
    this.wiremockService.updateMapping(this.mappingId, mapping)
      .subscribe(
        () => this.router.navigate([`/mappings/${this.mappingId}`]),
        (res) => alert('Failure.' + JSON.stringify(res)),
      )
  }
}