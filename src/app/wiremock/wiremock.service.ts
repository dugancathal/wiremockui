import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import {
  dumpMapping,
  dumpRequest,
  enrichMapping,
  enrichRequest,
  Mapping,
  MappingsResponse,
  RecordedRequest,
  Request,
  RequestsResponse
} from './mapping'
import { Recording, RecordingsResponse } from './recording'
import { WiremockUrlService } from './wiremock-url.service'

@Injectable()
export class WiremockService {
  private baseUrl: string

  constructor(private http: HttpClient, private wiremockUrlService: WiremockUrlService) {
    this.wiremockUrlService.baseUrl().subscribe(url => this.baseUrl = url)
  }

  mappings(): Observable<Mapping[]> {
    return this.http.get(`${this.baseUrl}/__admin/mappings`)
      .map((resp: MappingsResponse) => resp.mappings.map(enrichMapping))
  }

  requests(): Observable<Recording[]> {
    return this.http.get(`${this.baseUrl}/__admin/requests`)
      .map((resp: RecordingsResponse) => resp.requests)
  }

  mapping(id: string): Observable<Mapping> {
    return this.http.get(`${this.baseUrl}/__admin/mappings/${id}`)
      .map((resp: Mapping) => enrichMapping(resp))
  }

  requestsMatching(request: Request): Observable<RecordedRequest[]> {
    return this.http.post(`${this.baseUrl}/__admin/requests/find`, dumpRequest(request))
      .map((resp: RequestsResponse) => resp.requests.map(enrichRequest))
  }

  updateMapping(mappingId: string, updated: Mapping) {
    return this.http.put(`${this.baseUrl}/__admin/mappings/${mappingId}`, dumpMapping(updated))
  }
}