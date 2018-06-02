import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { WindowWrapper } from '../lib/window/window-wrapper'

const BASE_URL_KEY = 'WIREMOCKUI:base-url'

@Injectable()
export class WiremockUrlService {
  private _baseUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:9999')

  constructor(private window: WindowWrapper, private http: HttpClient) {
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

  verifyUrl(newUrl: string): Observable<boolean> {
    return this.http.get(`${newUrl}/__admin/mappings`)
      .map(() => true)
  }
}