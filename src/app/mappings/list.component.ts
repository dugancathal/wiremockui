import { Component, OnInit } from '@angular/core'
import { rowFilter } from '../lib/filtering/row-filter'
import { identity } from '../lib/table/formatter'
import { cell, Row } from '../lib/table/table'
import { Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mappings-list',
  styleUrls: ['./mapping.component.scss'],
  template: `
    <input
      type="text"
      class="filter-input"
      (keyup)="onFilterChange($event.target.value)"
      placeholder="Filter by name"/>

    <wiremockui-table
      [headers]="headers"
      [rows]="filteredMappings">
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
  filteredMappings: Row[]

  constructor(private api: WiremockService) {
  }

  ngOnInit() {
    this.api.mappings().subscribe(mappings => {
      this.mappings = this.toTable(mappings)
      this.filteredMappings = this.mappings
    })
  }

  onFilterChange(newFilter: string) {
    const rowToString = (row) => row[0].toLowerCase()
    this.filteredMappings = rowFilter(this.mappings, rowToString, newFilter.split(/\s+/))
  }

  private toTable(mappings: Mapping[]): Row[] {
    return mappings.map(mapping => {
      return [
        cell(mapping.name, identity, {href: `/mappings/${mapping.id}`}),
        cell(mapping.request.method),
        cell(mapping.request.url)
      ]
    })
  }
}