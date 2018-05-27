import { async, inject, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { mockRoute } from '../lib/spec-utils/mock-route'
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
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const nameInput = host.nativeElement.querySelector('input[name="mapping-name"]')
    nameInput.value = 'GET Freya'
    nameInput.dispatchEvent(new Event('input'))
    host.detectChanges()

    host.nativeElement.querySelector('.submit').click()
    host.detectChanges()

    expect(wiremockMock.updateMapping).toHaveBeenCalledWith('993-mapping-id', jasmine.objectContaining({
      name: 'GET Freya'
    }))
  })

  it('redirects to the updated mapping on successful save', inject([Router], (router) => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const nameInput = host.nativeElement.querySelector('input[name="mapping-name"]')
    nameInput.value = 'GET Freya'
    nameInput.dispatchEvent(new Event('input'))
    host.detectChanges()

    host.nativeElement.querySelector('.submit').click()
    host.detectChanges()

    expect(router.navigate).toHaveBeenCalledWith(['/mappings/993-mapping-id'])
  }))
})