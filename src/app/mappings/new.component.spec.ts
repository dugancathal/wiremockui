import { async, inject, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { page } from '../lib/spec-utils/page'
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
    const doneCompiling = TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()

    spyOn(TestBed.get(Router), 'navigate')
    return doneCompiling
  }))

  it('POSTs the form on save', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.fillIn('input[name="mapping-name"]', 'GET Freya')
    host.fillIn('input[name="request-method"]', 'GET')
    host.fillIn('input[name="request-url"]', '/path')
    host.fillIn('input[name="response-status"]', '200')
    host.clickOn('.submit')

    expect(wiremockMock.createMapping).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'GET Freya'
    }))
  })

  it('redirects to the new mapping on successful save', inject([Router], (router) => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.fillIn('input[name="mapping-name"]', 'GET Freya')
    host.fillIn('input[name="request-method"]', 'GET')
    host.fillIn('input[name="request-url"]', '/path')
    host.fillIn('input[name="response-status"]', '200')
    host.clickOn('.submit')

    expect(router.navigate).toHaveBeenCalledWith(['/mappings/841-mapping-id'])
  }))
})