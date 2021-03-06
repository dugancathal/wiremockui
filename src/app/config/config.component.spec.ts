import { HttpClientTestingModule } from '@angular/common/http/testing'
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing'
import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'
import { createHost } from '../lib/spec-utils/host.spec'
import { page } from '../lib/spec-utils/page'
import { WindowWrapper } from '../lib/window/window-wrapper'
import { WiremockUrlService } from '../wiremock/wiremock-url.service'
import { ConfigComponent } from './config.component'

describe('ConfigComponent', () => {
  const HostModule = createHost(ConfigComponent, {}, {})
  const fauxWindow = {
    localStorage: {
      getItem: jasmine.createSpy('localStorage.getItem'),
      setItem: jasmine.createSpy('localStorage.setItem'),
    }
  }

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [HostModule, HttpClientTestingModule],
      providers: [
        WiremockUrlService,
        {provide: WindowWrapper, useValue: fauxWindow}
      ]
    }).compileComponents()
  }))

  it('shows the default wiremockBaseUrl on load', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    const input = host.$('input[name="url"]')

    expect(input.value).toEqual('http://localhost:9999')
  })

  it('updates the wiremockUrlService baseUrl on save', inject([WiremockUrlService], (urlService: WiremockUrlService) => {
    spyOn(urlService, 'verifyUrl').and.returnValue(of(true))
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.component.compRef.instance.wiremockBaseUrl = 'http://new-url.com'
    host.detectChanges()

    host.$('.save').click()
    urlService.baseUrl().subscribe(url => expect(url).toEqual('http://new-url.com'))
  }))

  it('displays a FLASH on successful save and hides it after 2 seconds', fakeAsync(inject([WiremockUrlService], (urlService: WiremockUrlService) => {
    spyOn(urlService, 'verifyUrl').and.returnValue(of(true))
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    expect(host.$('.success.flash')).toBeFalsy()
    host.$('.save').click()
    host.detectChanges()
    tick()
    expect(host.$('.success.flash')).toBeTruthy()

    tick(1999)
    host.detectChanges()
    expect(host.$('.success.flash')).toBeTruthy()
    tick(2)
    host.detectChanges()
    expect(host.$('.success.flash')).toBeFalsy()
  })))

  it('verifies the URL works on save', inject([WiremockUrlService], (urlService: WiremockUrlService) => {
    spyOn(urlService, 'verifyUrl').and.returnValue(Observable.throw(new Error('invalid url')))
    spyOn(urlService, 'updateBaseUrl').and.callThrough()

    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.component.compRef.instance.wiremockBaseUrl = 'http://new-url.com'
    host.detectChanges()

    host.$('.save').click()
    expect(urlService.updateBaseUrl).not.toHaveBeenCalled()
  }))
})