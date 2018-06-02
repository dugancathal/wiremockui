import { Component, Input, OnChanges } from '@angular/core'
import { Row } from './table'

@Component({
  selector: 'wiremockui-table',
  styleUrls: ['./table.component.scss'],
  template: `
    <section class="pagination">
      <span 
        *ngFor="let number of pages" 
        class="buttonish"
        [class.current-page]="currentPage === number"
        (click)="goToPage(number)">
        {{number + 1}}
      </span>
    </section>
    
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let header of headers">{{header.value}}</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of page">
        <td *ngFor="let cell of row">
          <a *ngIf="cell.href" [routerLink]="cell.href">{{cell.formatter(cell.value)}}</a>
          <span *ngIf="!cell.href">{{cell.formatter(cell.value)}}</span>
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export class TableComponent implements OnChanges {
  @Input() headers: Row = []
  @Input() rows: Row[] = []

  @Input() perPage = 25

  currentPage = 0
  page: Row[] = []
  pages: number[] = []

  ngOnChanges() {
    this.page = this.calculatePage()
    this.pages = this.pageNumbers()
  }

  goToPage(number) {
    this.currentPage = number
    this.ngOnChanges()
  }

  private calculatePage() {
    const start = this.currentPage * this.perPage
    return (this.rows || []).slice(start, start + this.perPage)
  }

  private pageNumbers() {
    const numPages = Math.ceil((this.rows || []).length / this.perPage) || 1
    return [...Object.keys(new Array(numPages).fill(0)).map(Number)]
  }
}