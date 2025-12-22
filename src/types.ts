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

export type ParsedRelationEntry =
  | { type: 'student'; id: number }
  | { type: 'tag'; id: number }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'NOT' }
  | { type: 'LEFT_PAREN' }
  | { type: 'RIGHT_PAREN' }

export interface Relation {
  id: number
  entries: RelationEntry[]
  priority: number
}

export interface ParsedRelation {
  id: number
  entries: ParsedRelationEntry[]
  priority: number
}