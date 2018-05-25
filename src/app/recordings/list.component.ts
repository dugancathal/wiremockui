import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
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
      (keyup)="onFilterChange($event.target.value)"
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

  constructor(private api: WiremockService, private dateFormatter: DatePipe) {
  }

  ngOnInit() {
    this.api.recordings().subscribe(requests => {
      this.requests = this.toTable(requests)
      this.filteredRequests = this.requests
    })
  }

  onFilterChange(newFilter: string) {
    const rowStringer = (row) => JSON.stringify(row).toLowerCase()
    this.filteredRequests = rowFilter(this.requests, rowStringer, newFilter.split(/\s+/))
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