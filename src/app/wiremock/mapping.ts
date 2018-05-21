export interface HeaderMatcher {
  equalTo?: string
}

type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface Request {
  method: HTTP_METHOD
  url: string
  headers: { [key: string]: HeaderMatcher }
  bodyPatterns: any[]
}

export interface RecordedRequest extends Request {
  loggedDate: number
}

export interface Response {
  status: number
  body?: string
  jsonBody?: any
  base64Body?: any
  bodyFileName?: string
  headers: { [key: string]: string }
}

export interface Mapping {
  id?: string
  name?: string
  request: Request
  response: Response
}

export interface MappingsResponse {
  mappings: Mapping[]
}

export interface RequestsResponse {
  requests: RecordedRequest[]
}

export const EMPTY_MAPPING = Object.freeze({
  id: '',
  name: '',
  request: {
    method: "GET" as HTTP_METHOD,
    url: '',
    headers: {},
    bodyPatterns: [],
  },
  response: {
    status: 0,
    jsonBody: {},
    headers: {},
  }
})

export const enrichRequest = (request) => {
  return request
}

export const enrichResponse = (response) => {
  return {
    ...response,
    body: response.body || response.jsonBody || response.base64Body || response.bodyFileName
  }
}

export const enrichMapping = (mapping): Mapping => {
  return {
    ...mapping,
    request: enrichRequest(mapping.request),
    response: enrichResponse(mapping.response),
  } as Mapping
}
