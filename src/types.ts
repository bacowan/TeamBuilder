export interface Student {
  id: number
  name: string
  tags: string[]
}

export interface Suggestion {
  type: 'student' | 'tag'
  value: string
  studentName?: string
}

export type RelationEntry = 
  { type: 'text'; value: string }
  | { type: 'tag'; value: string}