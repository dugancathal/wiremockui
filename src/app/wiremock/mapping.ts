import { HTTP_METHOD } from './http-methods'

export interface HeaderMatcher {
  equalTo?: string
}

export interface Request {
  id?: string
  method: HTTP_METHOD
  url: string
  headers: { [key: string]: HeaderMatcher }
  bodyPatterns: any[]
}

export interface RecordedRequest extends Request {
  loggedDate: number
  body: string
}

export interface Response {
  status: number
  body?: string
  proxyBaseUrl?: string
  jsonBody?: any
  base64Body?: any
  bodyFileName?: string
  headers: { [key: string]: string }
}

export interface Mapping {
  id?: string
  name?: string
  request: Request
  response: EnrichedResponse
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
    status: 200,
    jsonBody: {},
    headers: {},
    isProxied: false,
  }
})

function tryPrettyPrint(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, "  ")
  } catch(e) {
    return body
  }
}

export interface EnrichedResponse extends Response {
  proxyTo?: string
  isProxied?: boolean
}

export const enrichRequest = (request) => {
  const headers = request.headers || {}
  const bodyPatterns = request.bodyPatterns || []
  return {
    ...request,
    bodyPatterns: bodyPatterns.map(pattern => JSON.stringify(pattern)),
    body: tryPrettyPrint(request.body),
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

export const enrichResponse = (response): EnrichedResponse => {
  const body = tryPrettyPrint(response.body)
  return {
    ...response,
    proxyTo: response.proxyBaseUrl ? response.proxyBaseUrl : 'STATIC',
    isProxied: !!response.proxyBaseUrl,
    body
  } as EnrichedResponse
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