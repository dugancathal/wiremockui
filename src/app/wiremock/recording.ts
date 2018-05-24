import { RecordedRequest } from './mapping'

export interface Recording {
  id?: string
  request: RecordedRequest
  response: Response
}

export interface RecordingsResponse {
  requests: Recording[]
}