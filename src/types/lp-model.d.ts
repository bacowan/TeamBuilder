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

  export class Model {
    constructor()
    addVar(options?: { name?: string; lb?: number; ub?: number; type?: 'continuous' | 'integer' | 'binary'; obj?: number }): Variable
    addVars(names: string[], options?: { lb?: number; ub?: number; type?: 'continuous' | 'integer' | 'binary'; obj?: number }): { [key: string]: Variable }
    addConstr(expr: any, options?: { name?: string; lb?: number; ub?: number; eq?: number }): Constraint
    setObjective(expr: any, sense?: 'minimize' | 'maximize'): void
    solve(solver: any): void
    toLP(): string
    loadLP(lpString: string): void
  }

  export const GREATER_THAN: number
  export const LESS_THAN: number
  export const EQUAL: number
  export const MAXIMIZE: number
  export const MINIMIZE: number
}
