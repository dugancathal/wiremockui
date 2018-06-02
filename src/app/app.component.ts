import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { timer } from 'rxjs/observable/timer'
import { switchMap } from 'rxjs/operators'
import { WiremockUrlService } from './wiremock/wiremock-url.service'

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <a class="url status" routerLink="/config" [class.danger]="!wiremockOk" [class.success]="wiremockOk">
        Current Wiremock: {{baseUrl}}
      </a>

      <a routerLink="/config" [class.current-link]="isCurrentRoute('/config')">Local Config</a>
      <a routerLink="/recordings" [class.current-link]="isCurrentRoute('/recordings')">Requests</a>
      <a routerLink="/mappings" [class.current-link]="isCurrentRoute('/')">Mappings</a>
    </div>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  baseUrl: string
  wiremockOk = false

  constructor(private wiremockUrlService: WiremockUrlService, private router: Router) {
  }

  ngOnInit() {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
    timer(500, 5000)
      .pipe(switchMap(() => this.wiremockUrlService.verifyUrl(this.baseUrl)))
      .subscribe((wiremockOk) => this.wiremockOk = wiremockOk)
  }

  isCurrentRoute(path: string): boolean {
    return this.router.url === path
  }
}
