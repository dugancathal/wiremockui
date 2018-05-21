import { Component, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { identity, stringable } from '../lib/table/formatter'
import { cell, Row } from '../lib/table/table'
import { Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mappings-list',
  template: `
    <wiremockui-table
      [headers]="headers"
      [rows]="mappings">
    </wiremockui-table>
  `
})
export class MappingsListComponent implements OnInit {
  headers: Row = [
    cell('Name'),
    cell('Request Method'),
    cell('Path')
  ]
  mappings: Row[] = []

  constructor(private api: WiremockService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.api.mappings().subscribe(mappings => this.mappings = this.toTable(mappings))
  }

  private toTable(mappings: Mapping[]): Row[] {
    const nameToLink = (mapping): stringable => {
      const linkTag = `<a href="/mappings/${mapping.id}">${mapping.name}</a>`
      return this.sanitizer.bypassSecurityTrustHtml(linkTag) as stringable
    }

    return mappings.map(mapping => {
      return [
        cell(mapping.name, identity, {href: `/mappings/${mapping.id}`}),
        cell(mapping.request.method),
        cell(mapping.request.url)
      ]
    })
  }
}