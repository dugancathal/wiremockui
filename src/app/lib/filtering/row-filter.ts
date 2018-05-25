import { Row } from '../table/table'

export type RowStringer = (row) => string

export const rowFilter = (rows: Row[], tokenizer: RowStringer, searchTokens: (string | RegExp)[]) => {
  return rows.filter(row => searchTokens.some(search => !!tokenizer(row.map(cell => cell.formatter(cell.value))).match(search)))
}