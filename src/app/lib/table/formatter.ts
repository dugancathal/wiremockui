export interface stringable {
  toString(): string
}
export type Formatter = (any) => stringable

export const identity: Formatter = (val) => val