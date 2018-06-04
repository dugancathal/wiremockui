import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { rowFilter } from '../lib/filtering/row-filter'
import { identity } from '../lib/table/formatter'
import { cell, Row } from '../lib/table/table'
import { Recording } from '../wiremock/recording'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'requests-list',
  template: `
    <input
      type="text"
      class="filter-input"
      [value]="filter"
      (debouncedKeyup)="onFilterChange($event.target.value)"
      placeholder="Filter"/>

    <wiremockui-table
      [headers]="headers"
      [rows]="filteredRequests">
    </wiremockui-table>
  `
})
export class RequestsListComponent implements OnInit {
  headers: Row = [
    cell('Recording ID'),
    cell('Request Method'),
    cell('Path'),
    cell('Time'),
  ]
  requests: Row[] = []
  filteredRequests: Row[]
  filter: string = ''

  constructor(private api: WiremockService, private dateFormatter: DatePipe, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || ''
      this.loadRequests()
    })
  }

  private loadRequests() {
    this.api.recordings().subscribe(requests => {
      this.requests = this.toTable(requests)
      this.onFilterChange(this.filter)
    })
  }

  onFilterChange(newFilter: string) {
    this.filter = newFilter
    this.router.navigate([], {queryParams: {filter: newFilter}, queryParamsHandling: 'merge'})
    this.filterRows(newFilter)
  }

  private filterRows = (newFilter: string) => {
    const rowToString = (row) => JSON.stringify(row).toLowerCase()
    this.filteredRequests = rowFilter(this.requests, rowToString, newFilter.toLowerCase().split(/\s+/))
  }

  private toTable(requests: Recording[]): Row[] {
    return requests.map(recording => {
      return [
        cell(recording.id, identity, {href: `/recordings/${recording.id}`}),
        cell(recording.request.method),
        cell(recording.request.url),
        cell(recording.request.loggedDate, (time) => this.dateFormatter.transform(time, 'full')),
      ]
    })
  }
}