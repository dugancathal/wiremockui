import { HTTP_METHOD } from './http-methods'
import { RecordedRequest, Response } from './mapping'

export interface Recording {
  id?: string
  request: RecordedRequest
  response: Response
  wasMatched: boolean
}

export const EMPTY_RECORDING = Object.freeze({
  id: '',
  request: {
    method: 'GET' as HTTP_METHOD,
    url: '',
    headers: {},
    bodyPatterns: [],
    loggedDate: 0
  },
  response: {
    status: 0,
    body: '',
    headers: {},
  },
}) as Recording

export interface RecordingsResponse {
  requests: Recording[]
}
