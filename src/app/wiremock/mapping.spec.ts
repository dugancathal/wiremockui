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
    describe('when the body is given using jsonBody', () => {
      it('pretty-prints the response body', () => {
        const response = {
          jsonBody: {"myKey": "myValue"}
        }
        expect(enrichResponse(response).body).toEqual(`{\n  "myKey": "myValue"\n}`)
      })
    })
  })
})
