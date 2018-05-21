import { async, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { createHost } from '../lib/spec-utils/host.spec'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingShowComponent } from './show.component'

describe('MappingShowComponent', () => {
  const wiremockMock = {
    mapping: jasmine.createSpy('wiremockMock.mapping')
      .and.returnValue(of({name: 'Get Thor', request: {method: 'GET', url: '/aesir/thor'}, response: {}})),
  }
  const HostModule = createHost(MappingShowComponent, {}, {
    providers: [
      {provide: WiremockService, useValue: wiremockMock},
      {provide: ActivatedRoute, useValue: {paramMap: of({get: () => 999})}}
    ]
  })

  beforeEach(async(() => {
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
})