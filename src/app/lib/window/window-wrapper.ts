import { Injectable } from '@angular/core'

@Injectable()
export class WindowWrapper {
  localStorage = window.localStorage
}