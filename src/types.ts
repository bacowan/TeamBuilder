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
