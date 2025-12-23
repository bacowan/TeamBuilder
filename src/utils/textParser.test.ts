import { describe, it, expect } from 'vitest'
import {
  textEntriesToString,
  parseTextEntries,
  findMentionContext,
  tokenizeRelation,
  validateRelationEntries,
  createAbstractSyntaxTree
} from './textParser'
import { Student, Tag, RelationEntry, Relation } from '../types'

// Test data
const students: Student[] = [
  { id: 1, name: 'Kakeru', tags: [] },
  { id: 2, name: 'Kazuki', tags: [] },
  { id: 3, name: 'Alice', tags: [] }
]

const tags: Tag[] = [
  { id: 1, name: 'Frontend' },
  { id: 2, name: 'Backend' },
  { id: 3, name: 'FullStack' }
]

describe('textEntriesToString', () => {
  it('should convert student mention to string', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('@Kakeru')
  })

  it('should convert tag mention to string', () => {
    const entries: RelationEntry[] = [
      { type: 'TAG', id: 1 }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('@Frontend')
  })

  it('should convert text entry to string', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'Hello' }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('Hello')
  })

  it('should convert mixed entries to string', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT (' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'TAG', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('NOT (@Kakeru AND @Frontend)')
  })

  it('should return empty string for non-existent student', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 999 }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('')
  })

  it('should return empty string for non-existent tag', () => {
    const entries: RelationEntry[] = [
      { type: 'TAG', id: 999 }
    ]
    expect(textEntriesToString(entries, students, tags)).toBe('')
  })
})

describe('parseTextEntries', () => {
  it('should parse simple text', () => {
    const result = parseTextEntries('hello', students, tags)
    expect(result).toEqual([{ type: 'TEXT', value: 'hello' }])
  })

  it('should parse student mention', () => {
    const result = parseTextEntries('@Kakeru', students, tags)
    expect(result).toEqual([{ type: 'STUDENT', id: 1 }])
  })

  it('should parse tag mention', () => {
    const result = parseTextEntries('@Frontend', students, tags)
    expect(result).toEqual([{ type: 'TAG', id: 1 }])
  })

  it('should parse unknown mention as text', () => {
    const result = parseTextEntries('@Unknown', students, tags)
    expect(result).toEqual([{ type: 'TEXT', value: '@Unknown' }])
  })

  it('should parse mixed content', () => {
    const result = parseTextEntries('NOT @Kakeru AND @Frontend', students, tags)
    expect(result).toEqual([
      { type: 'TEXT', value: 'NOT ' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'TAG', id: 1 }
    ])
  })

  it('should parse mentions with parentheses', () => {
    const result = parseTextEntries('(@Kakeru)', students, tags)
    expect(result).toEqual([
      { type: 'TEXT', value: '(' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ])
  })

  it('should parse complex expression', () => {
    const result = parseTextEntries('NOT (@Kakeru AND @Kazuki)', students, tags)
    expect(result).toEqual([
      { type: 'TEXT', value: 'NOT (' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'STUDENT', id: 2 },
      { type: 'TEXT', value: ')' }
    ])
  })

  it('should handle multiple consecutive mentions', () => {
    const result = parseTextEntries('@Kakeru@Kazuki', students, tags)
    expect(result).toEqual([
      { type: 'STUDENT', id: 1 },
      { type: 'STUDENT', id: 2 }
    ])
  })

  it('should return text entry for empty string', () => {
    const result = parseTextEntries('', students, tags)
    expect(result).toEqual([{ type: 'TEXT', value: '' }])
  })
})

describe('findMentionContext', () => {
  it('should find mention context at end of string', () => {
    const result = findMentionContext('@Kak', 4)
    expect(result).toEqual({
      atIndex: 0,
      searchTerm: 'kak'
    })
  })

  it('should find mention context in middle of string', () => {
    const result = findMentionContext('hello @Kak world', 10)
    expect(result).toEqual({
      atIndex: 6,
      searchTerm: 'kak'
    })
  })

  it('should return null when no @ found', () => {
    const result = findMentionContext('hello', 5)
    expect(result).toBeNull()
  })

  it('should return null when space after @', () => {
    const result = findMentionContext('@ Kakeru', 8)
    expect(result).toBeNull()
  })

  it('should handle @ at start', () => {
    const result = findMentionContext('@', 1)
    expect(result).toEqual({
      atIndex: 0,
      searchTerm: ''
    })
  })
})

describe('tokenizeRelation', () => {
  it('should tokenize simple student mention', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'STUDENT', id: 1 }
    ])
  })

  it('should tokenize AND operator', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'STUDENT', id: 2 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'STUDENT', id: 1 },
      { type: 'AND' },
      { type: 'STUDENT', id: 2 }
    ])
  })

  it('should tokenize OR operator', () => {
    const entries: RelationEntry[] = [
      { type: 'TAG', id: 1 },
      { type: 'TEXT', value: ' OR ' },
      { type: 'TAG', id: 2 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'TAG', id: 1 },
      { type: 'OR' },
      { type: 'TAG', id: 2 }
    ])
  })

  it('should tokenize NOT operator', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT ' },
      { type: 'STUDENT', id: 1 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'NOT' },
      { type: 'STUDENT', id: 1 }
    ])
  })

  it('should tokenize parentheses', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '(' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: '(' },
      { type: 'STUDENT', id: 1 },
      { type: ')' }
    ])
  })

  it('should tokenize complex expression', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT (' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'STUDENT', id: 2 },
      { type: 'TEXT', value: ')' }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'NOT' },
      { type: '(' },
      { type: 'STUDENT', id: 1 },
      { type: 'AND' },
      { type: 'STUDENT', id: 2 },
      { type: ')' }
    ])
  })

  it('should handle case-insensitive operators', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' and ' },
      { type: 'STUDENT', id: 2 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'STUDENT', id: 1 },
      { type: 'AND' },
      { type: 'STUDENT', id: 2 }
    ])
  })

  it('should return null for invalid text', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'invalid' }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toBeNull()
  })

  it('should tokenize parentheses attached to operators', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT(' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'NOT' },
      { type: '(' },
      { type: 'STUDENT', id: 1 },
      { type: ')' }
    ])
  })

  it('should handle multiple spaces', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: '   AND   ' },
      { type: 'STUDENT', id: 2 }
    ]
    const result = tokenizeRelation(entries)
    expect(result).toEqual([
      { type: 'STUDENT', id: 1 },
      { type: 'AND' },
      { type: 'STUDENT', id: 2 }
    ])
  })
})

describe('validateRelationEntries', () => {
  it('should validate simple student mention', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should validate AND expression', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'STUDENT', id: 2 }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should validate OR expression', () => {
    const entries: RelationEntry[] = [
      { type: 'TAG', id: 1 },
      { type: 'TEXT', value: ' OR ' },
      { type: 'TAG', id: 2 }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should validate NOT expression', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT ' },
      { type: 'STUDENT', id: 1 }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should validate complex expression with parentheses', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'NOT (' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND ' },
      { type: 'STUDENT', id: 2 },
      { type: 'TEXT', value: ')' }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should invalidate invalid text', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'invalid' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate AND at start', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'AND ' },
      { type: 'STUDENT', id: 1 }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate OR at start', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: 'OR ' },
      { type: 'STUDENT', id: 1 }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate AND at end', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate consecutive ANDs', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND AND ' },
      { type: 'STUDENT', id: 2 }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate NOT after student', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' NOT' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate unmatched opening parenthesis', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '(' },
      { type: 'STUDENT', id: 1 }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should invalidate unmatched closing parenthesis', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should validate nested parentheses', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '((' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: '))' }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should validate complex nested expression', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '(' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' OR ' },
      { type: 'STUDENT', id: 2 },
      { type: 'TEXT', value: ') AND (' },
      { type: 'TAG', id: 1 },
      { type: 'TEXT', value: ' OR ' },
      { type: 'TAG', id: 2 },
      { type: 'TEXT', value: ')' }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should invalidate AND after opening parenthesis', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '(AND ' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })

  it('should validate NOT after opening parenthesis', () => {
    const entries: RelationEntry[] = [
      { type: 'TEXT', value: '(NOT ' },
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ')' }
    ]
    expect(validateRelationEntries(entries)).toBe(true)
  })

  it('should invalidate NOT at end', () => {
    const entries: RelationEntry[] = [
      { type: 'STUDENT', id: 1 },
      { type: 'TEXT', value: ' AND NOT' }
    ]
    expect(validateRelationEntries(entries)).toBe(false)
  })
})

describe('createAbstractSyntaxTree', () => {
  it('should create AST for single student', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [{ type: 'STUDENT', id: 1 }]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'STUDENT',
      id: 1
    })
  })

  it('should create AST for AND expression', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'STUDENT', id: 1 },
          { type: 'TEXT', value: ' AND ' },
          { type: 'STUDENT', id: 2 }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'AND',
      left: { type: 'STUDENT', id: 1 },
      right: { type: 'STUDENT', id: 2 }
    })
  })

  it('should create AST for OR expression', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'TAG', id: 1 },
          { type: 'TEXT', value: ' OR ' },
          { type: 'TAG', id: 2 }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'OR',
      left: { type: 'TAG', id: 1 },
      right: { type: 'TAG', id: 2 }
    })
  })

  it('should create AST for NOT expression', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'TEXT', value: 'NOT ' },
          { type: 'STUDENT', id: 1 }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'NOT',
      child: { type: 'STUDENT', id: 1 }
    })
  })

  it('should create AST with parentheses', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'TEXT', value: '(' },
          { type: 'STUDENT', id: 1 },
          { type: 'TEXT', value: ')' }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'STUDENT',
      id: 1
    })
  })

  it('should create AST for complex expression', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'TEXT', value: 'NOT (' },
          { type: 'STUDENT', id: 1 },
          { type: 'TEXT', value: ' AND ' },
          { type: 'STUDENT', id: 2 },
          { type: 'TEXT', value: ')' }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'NOT',
      child: {
        type: 'AND',
        left: { type: 'STUDENT', id: 1 },
        right: { type: 'STUDENT', id: 2 }
      }
    })
  })

  it('should create AST for multiple relations combined with AND', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [{ type: 'STUDENT', id: 1 }]
      },
      {
        id: 2,
        priority: 2,
        entries: [{ type: 'STUDENT', id: 2 }]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'AND',
      left: { type: 'STUDENT', id: 1 },
      right: { type: 'STUDENT', id: 2 }
    })
  })

  it('should respect operator precedence (AND before OR)', () => {
    const relations: Relation[] = [
      {
        id: 1,
        priority: 1,
        entries: [
          { type: 'STUDENT', id: 1 },
          { type: 'TEXT', value: ' OR ' },
          { type: 'STUDENT', id: 2 },
          { type: 'TEXT', value: ' AND ' },
          { type: 'STUDENT', id: 3 }
        ]
      }
    ]
    const result = createAbstractSyntaxTree(relations)
    expect(result).toEqual({
      type: 'OR',
      left: { type: 'STUDENT', id: 1 },
      right: {
        type: 'AND',
        left: { type: 'STUDENT', id: 2 },
        right: { type: 'STUDENT', id: 3 }
      }
    })
  })
})
