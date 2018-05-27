import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { EMPTY_MAPPING, Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mapping-new',
  styleUrls: ['./mapping.component.scss'],
  templateUrl: './new.component.html',
})
export class MappingNewComponent {
  keys = (obj) => Object.keys(obj || {})
  mapping: Mapping = EMPTY_MAPPING

  constructor(private wiremockService: WiremockService, private router: Router) {
  }

  save(mapping: Mapping) {
    this.wiremockService.createMapping(mapping)
      .subscribe(
        (resp) => this.router.navigate([`/mappings/${resp.id}`]),
        (res) => alert('Failure.' + JSON.stringify(res)),
      )
  }
}