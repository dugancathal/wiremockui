import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class WiremockUrlService {
  private _baseUrl: BehaviorSubject<string> = new BehaviorSubject('http://localhost:9999')

  baseUrl(): Observable<string> {
    return this._baseUrl
  }

  updateBaseUrl(newUrl: string) {
    this._baseUrl.next(newUrl)
  }
}