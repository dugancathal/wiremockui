import { Row } from '../table/table'

export type RowStringer = (row) => string

export const rowFilter = (rows: Row[], tokenizer: RowStringer, searchTokens: (string | RegExp)[]) => {
  return rows.filter(row => {
    const formattedCells = row.map(cell => cell.formatter(cell.value))
    return searchTokens.every(search => !!tokenizer(formattedCells).match(search))
  })
}