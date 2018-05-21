import { Component, Input } from '@angular/core';
import { Row } from './table';

@Component({
  selector: 'wiremockui-table',
  styleUrls: ['./table.component.scss'],
  template: `
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let header of headers">{{header.value}}</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows">
        <td *ngFor="let cell of row">{{cell.formatter(cell.value)}}</td>
      </tr>
      </tbody>
    </table>
  `
})
export class TableComponent {
  @Input() headers: Row = [];
  @Input() rows: Row[] = [];
}