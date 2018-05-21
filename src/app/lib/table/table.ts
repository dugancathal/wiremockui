import { Formatter, identity } from './formatter';

export interface Cell {
  formatter: Formatter
  value: any

  [key: string]: any
}

export type Row = Cell[]

export const cell = (value, formatter = identity, props = {}) => ({...props, value, formatter});
