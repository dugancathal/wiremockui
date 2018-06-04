import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { rowFilter } from '../lib/filtering/row-filter'
import { identity } from '../lib/table/formatter'
import { cell, Row } from '../lib/table/table'
import { Mapping } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'mappings-list',
  styleUrls: ['./mapping.component.scss'],
  template: `
    <div class="options">
      <a class="buttonish" routerLink="/mappings/new">New Mapping</a>
      <button class="buttonish danger reset-mappings" (click)="resetMappings()">Reset mappings</button>
    </div>

    <input
      type="text"
      class="filter-input"
      (debouncedKeyup)="onFilterChange($event.target.value)"
      [value]="filter"
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
  filter: string = ''

  constructor(private api: WiremockService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || ''
      this.loadMappings()
    })
  }

  onFilterChange(newFilter: string) {
    this.filter = newFilter
    this.router.navigate([], withParams({filter: newFilter}))
    this.filterRows(newFilter)
  }

  resetMappings() {
    this.api.resetMappings()
      .subscribe(() => this.loadMappings())
  }

  private loadMappings() {
    return this.api.mappings().subscribe(mappings => {
      this.mappings = this.toTable(mappings)
      this.onFilterChange(this.filter)
    })
  }

  private filterRows = (newFilter: string) => {
    const rowToString = (row) => row[0].toLowerCase()
    this.filteredMappings = rowFilter(this.mappings, rowToString, newFilter.toLowerCase().split(/\s+/))
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

const withParams = (newParams) => ({
  queryParams: newParams,
  queryParamsHandling: 'merge',
  replaceUrl: true
} as NavigationExtras)