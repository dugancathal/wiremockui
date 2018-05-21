import { async, TestBed } from '@angular/core/testing';
import { createHost } from '../spec-utils/host.spec';
import { cell } from './table';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  const HostModule = createHost(TableComponent, {}, {declarations: [TableComponent]});

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [HostModule]
    }).compileComponents()
  }));

  it('displays all rows', () => {
    const fixture = TestBed.createComponent(HostModule.host);
    fixture.detectChanges();
    fixture.componentInstance.setProps({
      headers: [cell('Header 1'), cell('Header 2')],
      rows: [
        [cell('Val 1'), cell('Val 2')]
      ]
    });

    const headers = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toEqual(2);
    expect(headers[0].innerText).toEqual('Header 1');
    expect(headers[1].innerText).toEqual('Header 2');

    const rowOne = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(rowOne.length).toEqual(2);
    expect(rowOne[0].innerText).toEqual('Val 1');
    expect(rowOne[1].innerText).toEqual('Val 2');
  });
});