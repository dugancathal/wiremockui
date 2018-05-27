import { UrlSegment } from '@angular/router'
import { of } from 'rxjs/observable/of'

export const mockRoute = (url: string, params: { [key: string]: string }) => {
  return {
    url: of(url.split('/').map(segment => new UrlSegment(segment, {}))),
    paramMap: of({
      get: (paramKey) => params[paramKey]
    })
  }
}