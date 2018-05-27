import { async, inject, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingFormComponent } from './form.component'
import { MappingNewComponent } from './new.component'

describe('MappingNewComponent', () => {
  const wiremockMock = {
    createMapping: jasmine.createSpy('wiremockMock.createMapping')
      .and.returnValue(of({id: '841-mapping-id'}))
  }

  const HostModule = createHost(MappingNewComponent, {}, {
    declarations: [MappingNewComponent, MappingFormComponent],
    imports: [fakeRoutes(MappingNewComponent)],
    providers: [
      {provide: WiremockService, useValue: wiremockMock},
    ]
  })

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()
  }))

  it('POSTs the form on save', inject([Router], (router) => {
    spyOn(router, 'navigate')
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const nameInput = host.nativeElement.querySelector('input[name="mapping-name"]')
    nameInput.value = 'GET Freya'
    nameInput.dispatchEvent(new Event('input'))
    host.detectChanges()

    host.nativeElement.querySelector('.submit').click()
    host.detectChanges()

    expect(wiremockMock.createMapping).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'GET Freya'
    }))
  }))

  it('redirects to the new mapping on successful save', inject([Router], (router) => {
    spyOn(router, 'navigate')
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const nameInput = host.nativeElement.querySelector('input[name="mapping-name"]')
    nameInput.value = 'GET Freya'
    nameInput.dispatchEvent(new Event('input'))
    host.detectChanges()

    host.nativeElement.querySelector('.submit').click()
    host.detectChanges()

    expect(router.navigate).toHaveBeenCalledWith(['/mappings/841-mapping-id'])
  }))
})