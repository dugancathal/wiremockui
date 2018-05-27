import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing'
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
      imports: [HostModule],
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
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.component.compRef.instance.wiremockBaseUrl = 'http://new-url.com'
    host.detectChanges()

    host.$('.save').click()
    urlService.baseUrl().subscribe(url => expect(url).toEqual('http://new-url.com'))
  }))

  it('displays a FLASH when saved and hides it after 2 seconds', fakeAsync(() => {
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
  }))
})