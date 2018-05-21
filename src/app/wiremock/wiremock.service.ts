import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Mapping, MappingResponse } from './mapping'

@Injectable()
export class WiremockService {
  private wiremockBaseUrl: string
  constructor(private http: HttpClient) {
    this.wiremockBaseUrl = 'http://localhost:9999'
  }

  mappings(): Observable<Mapping[]> {
    return this.http.get(`${this.wiremockBaseUrl}/__admin/mappings`)
      .map((resp: MappingResponse) => resp.mappings)
  }
}