import { RelationEntry, Student, Tag, Suggestion } from '../types'
import { useState, useRef, useEffect } from 'react'
import MentionSuggestions from './MentionSuggestions'
import { textEntriesToString, parseTextEntries, findMentionContext } from '../utils/textParser'

interface MentionInputProps {
  value: RelationEntry[]
  onChange: (value: RelationEntry[]) => void
  students: Student[]
  tags: Tag[]
  placeholder?: string
  className?: string
}

function MentionInput({ value, onChange, students, tags, placeholder, className }: MentionInputProps) {
  const [displayValue, setDisplayValue] = useState(textEntriesToString(value, students, tags))
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync displayValue with value changes from parent
  useEffect(() => {
    setDisplayValue(textEntriesToString(value, students, tags))
  }, [JSON.stringify(value), JSON.stringify(students), JSON.stringify(tags)])

  // Update suggestions when input changes
  useEffect(() => {
    const context = findMentionContext(displayValue, cursorPosition)

    if (!context) {
      setShowSuggestions(false)
      return
    }

    const { searchTerm } = context
    const filtered: Suggestion[] = []

    // Add matching students
    students.forEach(student => {
      if (student.name.toLowerCase().includes(searchTerm)) {
        filtered.push({
          type: 'student',
          id: student.id,
          name: student.name
        })
      }
    })

    // Add matching tags
    tags.forEach(tag => {
      if (tag.name.toLowerCase().includes(searchTerm)) {
        // Find which student(s) have this tag
        const studentNames = students
          .filter(s => s.tags.includes(tag.id))
          .map(s => s.name)
          .join(', ')

        filtered.push({
          type: 'tag',
          id: tag.id,
          name: tag.name,
          studentName: studentNames
        })
      }
    })

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
    setSelectedIndex(0)
  }, [displayValue, cursorPosition, JSON.stringify(students), JSON.stringify(tags)])

  const insertMention = (suggestion: Suggestion) => {
    const context = findMentionContext(displayValue, cursorPosition)
    if (!context) return

    const { atIndex } = context
    const before = displayValue.slice(0, atIndex)

    // Find the end of the current mention (space, special char, or end of string)
    const afterCursor = displayValue.slice(cursorPosition)
    const endMatch = afterCursor.match(/^[^\s()[\]{}|&!@]*/)
    const mentionEndOffset = endMatch ? endMatch[0].length : 0
    const after = displayValue.slice(cursorPosition + mentionEndOffset)

    const mention = `@${suggestion.name}`
    const newText = before + mention + ' ' + after

    setDisplayValue(newText)
    onChange(parseTextEntries(newText, students, tags))
    setShowSuggestions(false)

    // Set cursor after the inserted mention
    setTimeout(() => {
      const newPosition = atIndex + mention.length + 1
      inputRef.current?.setSelectionRange(newPosition, newPosition)
      setCursorPosition(newPosition)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (suggestions.length > 0) {
          e.preventDefault()
          insertMention(suggestions[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    onChange(parseTextEntries(newValue, students, tags))
    setCursorPosition(e.target.selectionStart || 0)
  }

  const handleClick = () => {
    setCursorPosition(inputRef.current?.selectionStart || 0)
  }

  return (
    <div className={`flex-1 relative ${className || ''}`}>
      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px] pointer-events-none">
        {value.map((entry, index) => {
          if (entry.type === 'student') {
            const student = students.find(s => s.id === entry.id)
            return (
              <span key={index} className="text-blue-600">
                @{student?.name || ''}
              </span>
            )
          }
          if (entry.type === 'tag') {
            const tag = tags.find(t => t.id === entry.id)
            return (
              <span key={index} className="text-blue-600">
                @{tag?.name || ''}
              </span>
            )
          }
          return <span key={index}>{entry.value}</span>
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onKeyUp={handleClick}
        placeholder={placeholder}
        className="absolute inset-0 w-full px-4 py-2 border border-transparent rounded-lg focus:outline-none cursor-text bg-transparent"
        style={{ color: 'transparent', caretColor: 'black' }}
      />

      {showSuggestions && (
        <MentionSuggestions
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={insertMention}
        />
      )}
    </div>
  )
}

export default MentionInput
