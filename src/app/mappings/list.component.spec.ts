import { async, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs/observable/of'
import { fakeRoutes } from '../lib/spec-utils/faux-router-link.spec'
import { createHost } from '../lib/spec-utils/host.spec'
import { TableComponent } from '../lib/table/table.component'
import { WiremockService } from '../wiremock/wiremock.service'
import { MappingsListComponent } from './list.component'

const MAPPINGS = [
  {
    id: 'imma-mapping-id',
    name: 'Get Thor',
    request: {method: 'GET', url: '/aesir/thor'},
    response: {}
  },
  {
    id: 'imma-mapping-id-2',
    name: 'Get Odin',
    request: {method: 'GET', url: '/aesir/odin'},
    response: {}
  }
]

describe('MappingListComponent', () => {
  const wiremockMock = {
    mappings: jasmine.createSpy('wiremockMock.mappings')
      .and.returnValue(of(MAPPINGS)),
    resetMappings: jasmine.createSpy('wiremockMock.resetMappings')
      .and.returnValue(of({}))
  }
  const HostModule = createHost(MappingsListComponent, {}, {
    declarations: [TableComponent],
    imports: [fakeRoutes(MappingsListComponent)],
    providers: [
      {provide: WiremockService, useValue: wiremockMock}
    ]
  })

  const cellWithValue = (value) => jasmine.objectContaining({value})
  const rowWithValues = (...values) => values.map(cellWithValue)

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()
  }))

  it('shows the mappings and their NAME', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()
    const table = host.debugElement.query(By.css('wiremockui-table')).componentInstance
    expect(table.rows[0]).toEqual(rowWithValues('Get Thor', 'GET', '/aesir/thor'))
  })

  it('allows text-based filtering of the mappings', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    const table = host.debugElement.query(By.css('wiremockui-table')).componentInstance
    expect(table.rows.length).toEqual(2)

    const filter = host.nativeElement.querySelector('input.filter-input') as HTMLInputElement
    filter.value = 'odin'
    filter.dispatchEvent(new Event('keyup'))
    host.detectChanges()

    expect(table.rows.length).toEqual(1)
    expect(table.rows[0]).toEqual(rowWithValues('Get Odin', 'GET', '/aesir/odin'))
  })

  it('allows resetting mappings', () => {
    const host = TestBed.createComponent(HostModule.host)
    host.detectChanges()

    host.nativeElement.querySelector('.reset-mappings').click()
    host.detectChanges()

    expect(wiremockMock.resetMappings).toHaveBeenCalled()
  })
})