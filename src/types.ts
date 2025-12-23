export interface Tag {
  id: number
  name: string
}

export interface Student {
  id: number
  name: string
  tags: number[] // Array of tag IDs
}

export interface Suggestion {
  type: 'STUDENT' | 'TAG'
  id: number
  name: string
  studentName?: string
}

export type RelationEntry =
  | { type: 'TEXT'; value: string }
  | { type: 'STUDENT'; id: number }
  | { type: 'TAG'; id: number }

export interface Relation {
  id: number
  entries: RelationEntry[]
  priority: number
}

export type TokenizedRelationEntry =
  | { type: 'STUDENT'; id: number }
  | { type: 'TAG'; id: number }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'NOT' }
  | { type: '(' }
  | { type: ')' }

export type TokenType =
  | 'STUDENT'
  | 'TAG'
  | 'AND'
  | 'OR'
  | 'NOT'
  | '('
  | ')'

export type ASTNode = {
    type: 'AND' | 'OR'
    left: ASTNode
    right: ASTNode
  }
  | {
    type: 'NOT'
    child: ASTNode
  }
  | {
    type: 'STUDENT';
    id: number
  }
  | {
    type: 'TRUE'
  }

export interface Team {
  students: string[]
}