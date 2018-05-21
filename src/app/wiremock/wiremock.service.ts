import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Mapping, MappingResponse } from './mapping'
import { WiremockUrlService } from './wiremock-url.service'

@Injectable()
export class WiremockService {
  private baseUrl: string
  constructor(private http: HttpClient, private wiremockUrlService: WiremockUrlService) {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
  }

  mappings(): Observable<Mapping[]> {
    return this.http.get(`${this.baseUrl}/__admin/mappings`)
      .map((resp: MappingResponse) => resp.mappings)
  }
}