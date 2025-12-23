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
  type: 'student' | 'tag'
  id: number
  name: string
  studentName?: string
}

export type RelationEntry =
  | { type: 'text'; value: string }
  | { type: 'student'; id: number }
  | { type: 'tag'; id: number }

export interface Relation {
  id: number
  entries: RelationEntry[]
  priority: number
}

export type TokenizedRelationEntry =
  | { type: 'student'; id: number }
  | { type: 'tag'; id: number }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'NOT' }
  | { type: '(' }
  | { type: ')' }