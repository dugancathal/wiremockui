import { enrichRequest, enrichResponse } from './mapping'

describe('API Transformations', () => {
  describe('enrichRequest', () => {
    it('stringifies all the bodyPatterns', () => {
      const request = {
        bodyPatterns: [
          {contains: 'yololololo'}
        ]
      }

      expect(enrichRequest(request)).toEqual(jasmine.objectContaining({
        bodyPatterns: [
          `{"contains":"yololololo"}`
        ]
      }))
    })

    it('stringifies the header matchers', () => {
      const request = {
        headers: {
          'Content-Type': {
            'equalTo': 'application/json'
          }
        }
      }

      expect(enrichRequest(request).headers).toEqual(jasmine.objectContaining({
        'Content-Type': `{"equalTo":"application/json"}`
      }))
    })
  })

  describe('enrinchResponse', () => {
    describe('when the body is valid JSON', () => {
      it('pretty-prints the response body', () => {
        const response = {
          body: `{"myKey": "myValue"}`
        }
        expect(enrichResponse(response).body).toEqual(`{\n  "myKey": "myValue"\n}`)
      })
    })

    describe('when the body is NOT valid json', () => {
      it('returns the body as is', () => {
        const response = {
          body: `I'm just a string`
        }
        expect(enrichResponse(response).body).toEqual(`I'm just a string`)
      })
    })

    it('denotes responses that come from proxies', () => {
      const proxiedResponse = {proxyBaseUrl: 'https://jsonplaceholder.typicode.com'}
      expect(enrichResponse(proxiedResponse).proxyTo).toEqual('https://jsonplaceholder.typicode.com')

      const staticResponse = {body: "is a wonderland"}
      expect(enrichResponse(staticResponse).proxyTo).toEqual('STATIC')
    })
  })
})
