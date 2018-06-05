import { async, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { page } from '../lib/spec-utils/page'
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
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    expect(host.$('.raw-json')).toBeFalsy()

    host.clickOn('.show-json')

    expect(host.$('.raw-json')).toBeTruthy()
  })

  it('displays the requests made to this mapping', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    const requestCount = host.$('.request-count')
    expect(requestCount.innerText).toEqual('4')
    expect(host.$('.requests .recordings')).toBeFalsy()

    requestCount.click()
    host.detectChanges()

    const recordings = host.$('.requests .recordings')
    expect(recordings).toBeTruthy()
    expect(host.$$('.requests .recordings .recording').length).toEqual(4)
  })

  it('tags the mapping with the proxyUrl when it is proxied', () => {
    wiremockMock.mapping.and.returnValue(of({
      ...MAPPING, response: {
        ...MAPPING.response,
        isProxied: true,
        proxyTo: 'http://example.com'
      }
    }))
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    expect(host.$('.proxy-tag')).toBeTruthy()
    expect(host.$('.proxy-tag').textContent).toContain('http://example.com')

    expect(host.$('.response-status')).toBeFalsy()
    expect(host.$('.response-headers')).toBeFalsy()
    expect(host.$('.response-body')).toBeFalsy()
  })

  it('marks the mapping as STATIC when the response is not proxied', () => {
    wiremockMock.mapping.and.returnValue(of({
      ...MAPPING, response: {
        ...MAPPING.response,
        isProxied: false,
        proxyTo: 'STATIC'
      }
    }))
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    expect(host.$('.proxy-tag')).toBeTruthy()
    expect(host.$('.proxy-tag').textContent).toContain('NOT PROXIED')

    expect(host.$('.response-status')).toBeTruthy()
    expect(host.$('.response-headers')).toBeTruthy()
    expect(host.$('.response-body')).toBeTruthy()
  })
})