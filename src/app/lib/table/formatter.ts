export type Formatter = (any) => string

export const identity: Formatter = (val) => val