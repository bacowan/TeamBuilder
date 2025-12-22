import { RelationEntry, Student, Tag, Relation, ParsedRelation, ParsedRelationEntry } from '../types'

// Convert text entries to string
export const textEntriesToString = (
  entries: RelationEntry[],
  students: Student[],
  tags: Tag[]
): string => {
  return entries.map(entry => {
    if (entry.type === 'student') {
      const student = students.find(s => s.id === entry.id)
      return student ? `@${student.name}` : ''
    }
    if (entry.type === 'tag') {
      const tag = tags.find(t => t.id === entry.id)
      return tag ? `@${tag.name}` : ''
    }
    return entry.value
  }).join('')
}

// Parse string into text entries
export const parseTextEntries = (
  text: string,
  students: Student[],
  tags: Tag[]
): RelationEntry[] => {
  const entries: RelationEntry[] = []
  // Match @ followed by non-space characters until we hit space, special char, or end
  const mentionRegex = /@(\S+?)(?=\s|$|[()[\]{}|&!]|@)/g
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

    // Try to match student or tag by name
    const mentionName = match[1]
    const student = students.find(s => s.name === mentionName)
    const tag = tags.find(t => t.name === mentionName)

    if (student) {
      entries.push({ type: 'student', id: student.id })
    } else if (tag) {
      entries.push({ type: 'tag', id: tag.id })
    } else {
      // Unknown mention, treat as text
      entries.push({ type: 'text', value: `@${mentionName}` })
    }

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

// Parse relation into validated relation with tokens (AND, OR, NOT, parens)
// Returns null if the relation is invalid
export const parseRelation = (relation: Relation): ParsedRelation | null => {
  const res: ParsedRelation = {
    id: relation.id,
    entries: [],
    priority: relation.priority
  }

  for (const entry of relation.entries) {
    if (entry.type === "text") {
      let i = 0;
      let text = "";
      while (i < entry.value.length) {
        // parenthesis
        if (entry.value[i] === "(" || entry.value[i] === ")") {
          if (text.toUpperCase() === "AND") {
            res.entries.push({ type: 'AND' });
          } else if (text.toUpperCase() === "OR") {
            res.entries.push({ type: 'OR' });
          } else if (text.toUpperCase() === "NOT") {
            res.entries.push({ type: 'NOT' });
          } else if (text.length > 0) {
            // invalid token before parenthesis
            return null;
          }
          res.entries.push({ type: entry.value[i] });
        }
        // word terminator
        else if (/\s/.test(entry.value[i]) || i === entry.value.length - 1) {
          if (text.toUpperCase() === "AND") {
            res.entries.push({ type: 'AND' });
          } else if (text.toUpperCase() === "OR") {
            res.entries.push({ type: 'OR' });
          } else if (text.toUpperCase() === "NOT") {
            res.entries.push({ type: 'NOT' });
          } else {
            // invalid token
            return null;
          }
          text = "";
        }
        else {
          text += entry.value[i];
        }

      }
    }
    else {
      res.entries.push(entry);
    }
  }
  return res;
}

// Validate relation entries using parseRelation
export const validateRelationEntries = (entries: Relation): boolean => {
  const parsed = parseRelation(entries);
  if (parsed === null) {
    return false;
  }

  let openParenthesis = 0;
  let previousEntryType: "student" | "tag" | "AND" | "OR" | "NOT" | "(" | ")" | null = null;
  for (const entry of parsed.entries) {
    if (entry.type === "(") {
      openParenthesis++;
    }
    else if (entry.type === ")") {
      if (openParenthesis === 0) {
        return false; // Unmatched closing parenthesis
      }
      openParenthesis--;
    }
    else if (entry.type === "AND" || entry.type === "OR") {
      if (previousEntryType === null || previousEntryType === "AND" || previousEntryType === "OR" || previousEntryType === "NOT" || previousEntryType === "(") {
        return false; // AND/OR cannot be first or follow AND/OR/NOT/(
      }
    }
    else if (entry.type === "NOT") {
      if (previousEntryType === "student" || previousEntryType === "tag" || previousEntryType === ")") {
        return false; // NOT cannot follow student/tag/)
      }
    }

    previousEntryType = entry.type;
  }

  if (openParenthesis !== 0 || previousEntryType === "AND" || previousEntryType === "OR" || previousEntryType === "NOT") {
    return false;
  }

  return true;
}