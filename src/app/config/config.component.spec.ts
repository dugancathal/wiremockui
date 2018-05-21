import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing'
import { createHost } from '../lib/spec-utils/host.spec'
import { WiremockUrlService } from '../wiremock/wiremock-url.service'
import { ConfigComponent } from './config.component'

describe('ConfigComponent', () => {
  const HostModule = createHost(ConfigComponent, {}, {})

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [HostModule],
      providers: [WiremockUrlService]
    }).compileComponents()
  }))

  it('shows the default wiremockBaseUrl on load', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const input = host.nativeElement.querySelector('input[name="url"]')

    expect(input.value).toEqual('http://localhost:9999')
  })

  it('updates the wiremockUrlService baseUrl on save', inject([WiremockUrlService], (urlService: WiremockUrlService) => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    host.componentInstance.compRef.instance.wiremockBaseUrl = 'http://new-url.com'
    host.detectChanges()

    host.nativeElement.querySelector('.save').click()
    urlService.baseUrl().subscribe(url => expect(url).toEqual('http://new-url.com'))
  }))

  it('displays a FLASH when saved and hides it after 2 seconds', fakeAsync(() => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    expect(host.nativeElement.querySelector('.success.flash')).toBeFalsy()
    host.nativeElement.querySelector('.save').click()
    host.detectChanges()
    tick()
    expect(host.nativeElement.querySelector('.success.flash')).toBeTruthy()

    tick(1999)
    host.detectChanges()
    expect(host.nativeElement.querySelector('.success.flash')).toBeTruthy()
    tick(2)
    host.detectChanges()
    expect(host.nativeElement.querySelector('.success.flash')).toBeFalsy()
  }))
})