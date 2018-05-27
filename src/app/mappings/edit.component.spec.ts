import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { mockRoute } from '../lib/spec-utils/mock-route'
import { page } from '../lib/spec-utils/page'
import { EMPTY_MAPPING } from '../wiremock/mapping'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingEditComponent } from './edit.component'
import { MappingFormComponent } from './form.component'

describe('MappingEditComponent', () => {
  const wiremockMock = {
    updateMapping: jasmine.createSpy('wiremockMock.updateMapping')
      .and.returnValue(of({})),
    mapping: jasmine.createSpy('wiremockMock.mapping')
      .and.returnValue(of(EMPTY_MAPPING))
  }
  const HostModule = createHost(MappingEditComponent, {}, {
    declarations: [MappingEditComponent, MappingFormComponent],
    imports: [fakeRoutes(MappingEditComponent)],
    providers: [
      {provide: WiremockService, useValue: wiremockMock},
      {provide: ActivatedRoute, useValue: mockRoute('/mappings/993-mapping-id/edit', {id: '993-mapping-id'})}
    ]
  })

  beforeEach(async(() => {
    const doneCompiling = TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()

    spyOn(TestBed.get(Router), 'navigate')
    return doneCompiling
  }))

  it('PUTs the form on save', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.fillIn('input[name="mapping-name"]', 'GET Freya')
    host.fillIn('input[name="request-method"]', 'GET')
    host.fillIn('input[name="request-url"]', '/path')
    host.fillIn('input[name="response-status"]', '200')
    host.clickOn('.submit')

    expect(wiremockMock.updateMapping).toHaveBeenCalledWith('993-mapping-id', jasmine.objectContaining({
      name: 'GET Freya'
    }))
  })

  it('redirects to the updated mapping on successful save', inject([Router], (router) => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.fillIn('input[name="mapping-name"]', 'GET Freya')
    host.fillIn('input[name="request-method"]', 'GET')
    host.fillIn('input[name="request-url"]', '/path')
    host.fillIn('input[name="response-status"]', '200')
    host.clickOn('.submit')

    expect(router.navigate).toHaveBeenCalledWith(['/mappings/993-mapping-id'])
  }))
})