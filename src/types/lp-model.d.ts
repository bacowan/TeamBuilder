declare module 'lp-model' {
  export interface Variable {
    name: string
    value?: number
    lb?: number
    ub?: number
    type?: 'continuous' | 'integer' | 'binary'
  }

  export interface Constraint {
    name?: string
    lb?: number
    ub?: number
    eq?: number
  }

  type Expression = ([number, Variable] | Variable | number)[];


  export class Model {
    constructor()
    addVar(options?: { name?: string; lb?: number; ub?: number; vtype?: 'CONTINUOUS' | 'INTEGER' | 'BINARY'; obj?: number }): Variable
    addVars(names: string[], options?: { lb?: number; ub?: number; vtype?: 'CONTINUOUS' | 'INTEGER' | 'BINARY'; obj?: number }): { [key: string]: Variable }
    addConstr(expression: Expression, operator: "<=" | "<" | "=" | ">" | ">=", rhs: number | Expression): Constraint
    setObjective(expr: any, sense?: 'MAXIMIZE' | 'MINIMIZE'): void
    solve(solver: any): Promise
    toLP(): string
    loadLP(lpString: string): void
    toLPFormat(): string
  }

  export const GREATER_THAN: number
  export const LESS_THAN: number
  export const EQUAL: number
  export const MAXIMIZE: number
  export const MINIMIZE: number
}
