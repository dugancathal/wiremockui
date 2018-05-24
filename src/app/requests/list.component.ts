import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { identity } from '../lib/table/formatter'
import { cell, Row } from '../lib/table/table'
import { Recording } from '../wiremock/recording'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'requests-list',
  template: `
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
    this.api.requests().subscribe(requests => {
      this.requests = this.toTable(requests)
      this.filteredRequests = this.requests
    })
  }

  private toTable(requests: Recording[]): Row[] {
    return requests.map(recording => {
      return [
        cell(recording.id, identity),
        cell(recording.request.method),
        cell(recording.request.url),
        cell(recording.request.loggedDate, (time) => this.dateFormatter.transform(time, 'full')),
      ]
    })
  }
}