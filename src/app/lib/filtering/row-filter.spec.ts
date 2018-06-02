import { cell, Row } from '../table/table'
import { rowFilter } from './row-filter'

describe('Row filtering', () => {
  const rows = [
    [cell('Hi'), cell('Mom')],
    [cell('Bye'), cell('Dad')],
  ]

  it('returns rows that match a single criteria', () => {
    expect(rowFilter(rows, (row) => JSON.stringify(row), ['Hi'])).toEqual([rows[0]])
  })

  it('allows matching rows with RegExp', () => {
    expect(rowFilter(rows, (row) => JSON.stringify(row), [/hi/i])).toEqual([rows[0]])
  })

  it('matches rows that match ALL of the search criteria', () => {
    expect(rowFilter(rows, (row) => JSON.stringify(row), ['Hi', /bye/i])).toEqual([])
    expect(rowFilter(rows, (row) => JSON.stringify(row), ['Hi', /m/i])).toEqual([rows[0]])
  })

  it('matches on the formatted values of the cells', () => {
    const rows = [
      [cell('Hi', (cell) => cell.toLowerCase())]
    ]

    expect(rowFilter(rows, (row) => JSON.stringify(row), ['hi'])).toEqual([rows[0]])
  })
})