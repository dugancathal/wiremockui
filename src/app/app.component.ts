import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { WiremockUrlService } from './wiremock/wiremock-url.service'

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <a routerLink="/config" [class.current-link]="isCurrentRoute('/config')">Local Config</a>
      <a routerLink="/recordings" [class.current-link]="isCurrentRoute('/recordings')">Requests</a>
      <a routerLink="/mappings" [class.current-link]="isCurrentRoute('/')">Mappings</a>

      <div class="url">{{baseUrl}}</div>
    </div>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  baseUrl: string

  constructor(private wiremockUrlService: WiremockUrlService, private router: Router) {
  }

  ngOnInit() {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
  }

  isCurrentRoute(path: string): boolean {
    return this.router.url === path
  }
}
