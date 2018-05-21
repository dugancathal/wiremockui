import { Component, OnInit } from '@angular/core'
import { WiremockUrlService } from '../wiremock/wiremock-url.service'

const SUCCESS_FLASH_TIMEOUT = 2000

@Component({
  selector: 'config',
  template: `
    <form #form (submit)="save()">
      <div class="success flash" *ngIf="showSuccess">
        <p>Success!</p>
      </div>
      
      <div class="form-input">
        <input type="text" name='url' [(ngModel)]="wiremockBaseUrl" [value]="wiremockBaseUrl">
      </div>
      
      <div class="actions">
        <button class="save" type="submit">Save</button>
      </div>
    </form>
  `
})
export class ConfigComponent implements OnInit {
  wiremockBaseUrl: string = ''
  showSuccess: boolean = false

  constructor(private wiremockUrlService: WiremockUrlService) {
  }

  ngOnInit(): void {
    this.wiremockUrlService.baseUrl().subscribe(url => this.wiremockBaseUrl = url)
  }

  save() {
    this.wiremockUrlService.updateBaseUrl(this.wiremockBaseUrl)
    this.showSuccess = true
    setTimeout(() => {
      this.showSuccess = false
    }, SUCCESS_FLASH_TIMEOUT)
  }
}