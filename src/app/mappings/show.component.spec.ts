import { async, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs/observable/of'
import * as url from 'url'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingShowComponent } from './show.component'

const MAPPING = {
  id: 'mapping-id',
  name: 'Get Thor',
  request: {
    method: 'GET',
    url: '/aesir/thor'
  },
  response: {}
}

describe('MappingShowComponent', () => {
  const wiremockMock = {
    mapping: jasmine.createSpy('wiremockMock.mapping')
      .and.returnValue(of(MAPPING)),
    requestsMatching: jasmine.createSpy('wiremockMock.requestsMatching')
      .and.returnValue(of([{}, {}, {}, {}])),
    reset: jasmine.createSpy('wiremockMock.reset')
      .and.returnValue(of({}))
  }
  const HostModule = createHost(MappingShowComponent, {}, {
    imports: [fakeRoutes(MappingShowComponent)],
    providers: [
      {provide: WiremockService, useValue: wiremockMock},
      {provide: ActivatedRoute, useValue: {paramMap: of({get: () => MAPPING.id})}}
    ]
  })

  beforeEach(async(() => {
    wiremockMock.requestsMatching.calls.reset()
    wiremockMock.mapping.calls.reset()
    wiremockMock.reset.calls.reset()
    return TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()
  }))

  it('shows the mappings and their NAME', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    expect(host.nativeElement.querySelector('.raw-json')).toBeFalsy()

    const showJson = host.nativeElement.querySelector('.show-json')
    showJson.click()
    host.detectChanges()

    expect(host.nativeElement.querySelector('.raw-json')).toBeTruthy()
  })

  it('displays the requests made to this mapping', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const requestCount = host.nativeElement.querySelector('.request-count')
    expect(requestCount.innerText).toEqual('4')
    expect(host.nativeElement.querySelector('.requests .recordings')).toBeFalsy()

    requestCount.click()
    host.detectChanges()

    const recordings = host.nativeElement.querySelector('.requests .recordings')
    expect(recordings).toBeTruthy()
    expect(recordings.querySelectorAll('.recording').length).toEqual(4)
  })
})