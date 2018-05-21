import { Formatter, identity } from './formatter';

export interface Cell {
  formatter: Formatter
  value: any
}

export type Row = Cell[]

export const cell = (value) => ({value, formatter: identity});
