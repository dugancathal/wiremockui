import { Component, OnInit } from '@angular/core'
import { WiremockUrlService } from './wiremock/wiremock-url.service'

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <a routerLink="/config">Config</a>
      <a routerLink="/mappings">Mappings</a>
      
      <div class="url">{{baseUrl}}</div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding: 0.5rem;
          
          background-color: lightgray; 
      }
    `
  ]
})
export class AppComponent implements OnInit {
  baseUrl: string
  constructor(private wiremockUrlService: WiremockUrlService){}

  ngOnInit() {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
  }
}
