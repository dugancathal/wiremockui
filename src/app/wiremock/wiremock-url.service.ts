import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { WindowWrapper } from '../lib/window/window-wrapper'

const BASE_URL_KEY = 'WIREMOCKUI:base-url'

@Injectable()
export class WiremockUrlService {
  private _baseUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:9999')

  constructor(private window: WindowWrapper) {
    const baseUrlFromLocalStorage = this.window.localStorage.getItem(BASE_URL_KEY)
    if (baseUrlFromLocalStorage)
      this._baseUrl.next(baseUrlFromLocalStorage)
  }

  baseUrl(): Observable<string> {
    return this._baseUrl
  }

  updateBaseUrl(newUrl: string) {
    this.window.localStorage.setItem(BASE_URL_KEY, newUrl)
    this._baseUrl.next(newUrl)
  }
}