import { Directive } from '@angular/core'
import { async, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs/observable/of'
import { fakeRoutes, FauxRouterLink } from '../lib/spec-utils/faux-router-link.spec'
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
  }
]

describe('MappingListComponent', () => {
  const wiremockMock = {
    mappings: jasmine.createSpy('wiremockMock.mappings')
      .and.returnValue(of(MAPPINGS)),
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
})