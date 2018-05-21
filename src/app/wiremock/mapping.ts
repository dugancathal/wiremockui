export interface HeaderMatcher {
  equalTo?: string
}

export interface Request {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  headers: { [key: string]: HeaderMatcher }
}

export interface Response {
  status: number
  jsonBody: any
  headers: { [key: string]: string }
}

export interface Mapping {
  name?: string
  request: Request
  response: Response
}

export interface MappingResponse {
  mappings: Mapping[]
}