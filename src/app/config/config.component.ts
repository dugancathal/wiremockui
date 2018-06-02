import { Component, OnInit } from '@angular/core'
import { WiremockUrlService } from '../wiremock/wiremock-url.service'

const SUCCESS_FLASH_TIMEOUT = 2000

@Component({
  selector: 'config',
  template: `
    <h2>Local Config</h2>
    <form #form (submit)="save()">
      <div class="success flash" *ngIf="showSuccess">
        <p>Success!</p>
      </div>
      <div class="danger flash" *ngIf="showFailure">
        <p>Invalid url!</p>
      </div>
      
      <div class="form-input">
        <label for="url">Wiremock URL</label>
        <input type="text" id="url" name='url' [(ngModel)]="wiremockBaseUrl" [value]="wiremockBaseUrl">
      </div>
      
      <div class="actions">
        <button class="save buttonish" type="submit">Save</button>
      </div>
    </form>
  `
})
export class ConfigComponent implements OnInit {
  wiremockBaseUrl: string = ''
  showSuccess: boolean = false
  showFailure: boolean = false

  constructor(private wiremockUrlService: WiremockUrlService) {
  }

  ngOnInit(): void {
    this.wiremockUrlService.baseUrl().subscribe(url => this.wiremockBaseUrl = url)
  }

  save() {
    this.wiremockUrlService.verifyUrl(this.wiremockBaseUrl)
      .subscribe(this.onSuccess, this.onInvalidUrl)

  }

  onSuccess = () => {
    this.wiremockUrlService.updateBaseUrl(this.wiremockBaseUrl)
    this.showSuccess = true
    setTimeout(() => {
      this.showSuccess = false
    }, SUCCESS_FLASH_TIMEOUT)
  }

  onInvalidUrl = () => {
    this.showFailure = true
    setTimeout(() => {
      this.showFailure = false
    }, SUCCESS_FLASH_TIMEOUT)
  }
}