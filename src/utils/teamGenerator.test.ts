import { describe, it, expect } from 'vitest'
import { validateRelation } from './teamGenerator'

describe('validateRelation', () => {
  it('should validate simple student mention', () => {
    expect(validateRelation('@[Kakeru](student-1)')).toBe(true)
  })

  it('should validate AND expression', () => {
    expect(validateRelation('@[Kakeru](student-1) AND @[Kazuki](student-2)')).toBe(true)
  })

  it('should validate OR expression', () => {
    expect(validateRelation('#[Frontend](tag-1) OR #[Backend](tag-2)')).toBe(true)
  })

  it('should validate NOT expression', () => {
    expect(validateRelation('NOT @[Kakeru](student-1)')).toBe(true)
  })

  it('should validate complex expression with parentheses', () => {
    expect(validateRelation('NOT ( @[Kakeru](student-1) AND @[Kazuki](student-2) )')).toBe(true)
  })

  it('should invalidate invalid text', () => {
    expect(validateRelation('invalid')).toBe(false)
  })

  it('should invalidate AND at start', () => {
    expect(validateRelation('AND @[Kakeru](student-1)')).toBe(false)
  })

  it('should invalidate OR at start', () => {
    expect(validateRelation('OR @[Kakeru](student-1)')).toBe(false)
  })

  it('should invalidate AND at end', () => {
    expect(validateRelation('@[Kakeru](student-1) AND')).toBe(false)
  })

  it('should invalidate consecutive ANDs', () => {
    expect(validateRelation('@[Kakeru](student-1) AND AND @[Kazuki](student-2)')).toBe(false)
  })

  it('should invalidate NOT after student', () => {
    expect(validateRelation('@[Kakeru](student-1) NOT')).toBe(false)
  })

  it('should invalidate unmatched opening parenthesis', () => {
    expect(validateRelation('(@[Kakeru](student-1)')).toBe(false)
  })

  it('should invalidate unmatched closing parenthesis', () => {
    expect(validateRelation('@[Kakeru](student-1))')).toBe(false)
  })

  it('should validate nested parentheses', () => {
    expect(validateRelation('( ( @[Kakeru](student-1) ) )')).toBe(true)
  })

  it('should validate complex nested expression', () => {
    expect(validateRelation('( @[Kakeru](student-1) OR @[Kazuki](student-2) ) AND ( #[Frontend](tag-1) OR #[Backend](tag-2) )')).toBe(true)
  })

  it('should invalidate AND after opening parenthesis', () => {
    expect(validateRelation('( AND @[Kakeru](student-1) )')).toBe(false)
  })

  it('should validate NOT after opening parenthesis', () => {
    expect(validateRelation('( NOT @[Kakeru](student-1) )')).toBe(true)
  })

  it('should invalidate NOT at end', () => {
    expect(validateRelation('@[Kakeru](student-1) AND NOT')).toBe(false)
  })
})
