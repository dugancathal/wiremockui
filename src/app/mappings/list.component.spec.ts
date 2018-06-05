import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { current } from 'codelyzer/util/syntaxKind'
import { of } from 'rxjs/observable/of'
import { DebounceKeyupDirective } from '../lib/debounce/debounce.directive'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { page } from '../lib/spec-utils/page'
import { TableComponent } from '../lib/table/table.component'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingsListComponent } from './list.component'

const MAPPINGS = [
  {
    id: 'imma-mapping-id',
    name: 'Get Thor',
    request: {method: 'GET', url: '/aesir/thor'},
    response: {proxyTo: 'STATIC'}
  },
  {
    id: 'imma-mapping-id-2',
    name: 'Get Odin',
    request: {method: 'GET', url: '/aesir/odin'},
    response: {proxyTo: 'STATIC'}
  },
  {
    id: 'imma-mapping-id-3',
    name: 'Get Freya',
    request: {method: 'GET', url: '/aesir/freya'},
    response: {proxyTo: 'http://example.com'}
  },
]

describe('MappingListComponent', () => {
  let currentRoute: ActivatedRoute = {queryParams: of({})} as ActivatedRoute
  const cellWithValue = (value) => jasmine.objectContaining({value})
  const rowWithValues = (...values) => values.map(cellWithValue)
  const wiremockMock = {
    mappings: jasmine.createSpy('wiremockMock.mappings')
      .and.returnValue(of(MAPPINGS)),
    resetMappings: jasmine.createSpy('wiremockMock.resetMappings')
      .and.returnValue(of({}))
  }
  const HostModule = createHost(MappingsListComponent, {}, {
    declarations: [TableComponent, DebounceKeyupDirective],
    imports: [fakeRoutes(MappingsListComponent)],
    providers: [
      {provide: WiremockService, useValue: wiremockMock},
      {provide: ActivatedRoute, useValue: currentRoute},
    ]
  })

  beforeEach(async(() => {
    currentRoute.queryParams = of({})
    return TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()
  }))

  it('shows the mappings and their NAME', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()
    const table = host.$ng('wiremockui-table').componentInstance
    expect(table.rows[0])
      .toEqual(rowWithValues('Get Thor', 'GET', '/aesir/thor', 'STATIC'))
  })

  it('allows text-based filtering of the mappings', fakeAsync(() => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    const table = host.$ng('wiremockui-table').componentInstance
    expect(table.rows.length).toEqual(MAPPINGS.length)

    host.fillIn('.filter-input', 'odin')
    host.tick(150)

    expect(table.rows.length).toEqual(1)
    expect(table.rows[0]).toEqual(rowWithValues('Get Odin', 'GET', '/aesir/odin', 'STATIC'))
  }))

  it('allows resetting mappings', () => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.clickOn('.reset-mappings')

    expect(wiremockMock.resetMappings).toHaveBeenCalled()
  })

  it('adds the filter to the navigation history', fakeAsync(inject([Router], (router: Router) => {
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    host.fillIn('.filter-input', 'odin')
    tick(150)

    expect(router.url).toContain('filter=odin')
  })))

  it('retrieves the filter from the URL on boot', inject([ActivatedRoute], (route: ActivatedRoute) => {
    route.queryParams = of({filter: 'initial-filter'})
    const host = page(TestBed.createComponent(HostModule.host))
    host.detectChanges()

    expect(host.$('.filter-input').value).toEqual('initial-filter')
  }))
})