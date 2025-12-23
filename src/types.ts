export interface Tag {
  id: string
  name: string
}

export interface Student {
  id: string
  name: string
  tags: string[] // Array of tag IDs
}

export interface Suggestion {
  type: 'STUDENT' | 'TAG'
  id: string
  name: string
  studentName?: string
}

export type RelationEntry =
  | { type: 'TEXT'; value: string }
  | { type: 'STUDENT'; id: string }
  | { type: 'TAG'; id: string }

export interface Relation {
  id: string
  entries: RelationEntry[]
  priority: number
}

export type TokenizedRelationEntry =
  | { type: 'STUDENT'; id: string }
  | { type: 'TAG'; id: string }
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

export type ASTNode = ({
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
  }
  | {
    type: 'TRUE'
  }) & { id: string }

export interface Team {
  students: string[]
}