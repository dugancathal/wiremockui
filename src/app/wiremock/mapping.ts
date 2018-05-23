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
  const headers = request.headers || {}
  const bodyPatterns = request.bodyPatterns || []
  return {
    ...request,
    bodyPatterns: bodyPatterns.map(pattern => JSON.stringify(pattern)),
    headers: {
      ...(
        Object.keys(headers).reduce((acc, header) => {
          acc[header] = JSON.stringify(headers[header] || {})
          return acc
        }, {})
      )
    },
  }
}

export const enrichResponse = (response) => {
  const body = response.body || response.base64Body || response.bodyFileName || JSON.stringify(response.jsonBody, null, "  ")
  return {
    ...response,
    body
  }
}

export const enrichMapping = (mapping): Mapping => {
  return {
    ...mapping,
    request: enrichRequest(mapping.request),
    response: enrichResponse(mapping.response),
  } as Mapping
}

export const dumpRequest = (request) => {
  return {
    ...request,
    bodyPatterns: request.bodyPatterns.map(pattern => JSON.parse(pattern)),
    headers: {
      ...(
        Object.keys(request.headers).reduce((acc, header) => {
          acc[header] = JSON.parse(request.headers[header] || {})
          return acc
        }, {})
      )
    }
  }
}

export const dumpMapping = (mapping): Mapping => {
  return {
    ...mapping,
    request: dumpRequest(mapping.request),
    response: mapping.response,
  } as Mapping
}