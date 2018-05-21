import { Component, OnInit } from '@angular/core'
import { WiremockUrlService } from './wiremock/wiremock-url.service'

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <a routerLink="/config">Local Config</a>
      <a routerLink="/mappings">Mappings</a>

      <div class="url">{{baseUrl}}</div>
    </div>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
      `
          .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;

              margin-bottom: 1rem;
              padding: 0.5rem;

              background-color: lightgray;
          }

          .header > * {
              flex: 1 1 auto;

              padding: 0.5rem 0;

              text-align: center;
          }

          .content {
              padding: 1rem;
          }
    `
  ]
})
export class AppComponent implements OnInit {
  baseUrl: string

  constructor(private wiremockUrlService: WiremockUrlService) {
  }

  ngOnInit() {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
  }
}
