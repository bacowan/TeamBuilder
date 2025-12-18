import { RelationEntry } from '../types'

// Convert text entries to string
export const textEntriesToString = (entries: RelationEntry[]): string => {
  return entries.map(entry =>
    entry.type === 'tag' ? `@${entry.value}` : entry.value
  ).join('')
}

// Parse string into text entries
export const parseTextEntries = (text: string): RelationEntry[] => {
  const entries: RelationEntry[] = []
  const mentionRegex = /@([\w\s]+?)(?=\s|$|[()[\]{}|&!]|@)/g
  let lastIndex = 0

  let match
  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index)
      if (textBefore) {
        entries.push({ type: 'text', value: textBefore })
      }
    }

    // Add mention
    entries.push({ type: 'tag', value: match[1] })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex)
    if (remaining) {
      entries.push({ type: 'text', value: remaining })
    }
  }

  return entries.length > 0 ? entries : [{ type: 'text', value: text }]
}

// Find @ mention context at cursor position
export const findMentionContext = (text: string, position: number) => {
  const beforeCursor = text.slice(0, position)
  const lastAtIndex = beforeCursor.lastIndexOf('@')

  if (lastAtIndex === -1) return null

  const afterAt = beforeCursor.slice(lastAtIndex + 1)
  // Check if there's a space after @ (which would end the mention)
  if (afterAt.includes(' ')) return null

  return {
    atIndex: lastAtIndex,
    searchTerm: afterAt.toLowerCase()
  }
}
