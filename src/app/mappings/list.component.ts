import { Component, OnInit } from '@angular/core'
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

  constructor(private api: WiremockService) {
  }

  ngOnInit() {
    this.api.mappings().subscribe(mappings => this.mappings = toTable(mappings))
  }
}

function toTable(mappings: Mapping[]): Row[] {
  return mappings.map(mapping => {
    return [
      cell(mapping.name),
      cell(mapping.request.method),
      cell(mapping.request.url)
    ]
  })
}