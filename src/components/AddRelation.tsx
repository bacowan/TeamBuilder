import { RelationEntry, Student, Tag, Suggestion } from '../types'
import { useState, useRef, useEffect } from 'react'
import MentionSuggestions from './MentionSuggestions'
import { textEntriesToString, parseTextEntries, findMentionContext } from '../utils/textParser'

interface AddRelationProps {
  relationInput: RelationEntry[]
  onRelationInputChange: (relation: RelationEntry[]) => void
  students: Student[]
  tags: Tag[]
}

function AddRelation({ relationInput, onRelationInputChange, students, tags }: AddRelationProps) {
  const [displayValue, setDisplayValue] = useState(textEntriesToString(relationInput, students, tags))
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync displayValue with relationInput changes from parent
  useEffect(() => {
    setDisplayValue(textEntriesToString(relationInput, students, tags))
  }, [JSON.stringify(relationInput), JSON.stringify(students), JSON.stringify(tags)])

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
    const after = displayValue.slice(cursorPosition)
    const mention = `@${suggestion.name}`
    const newText = before + mention + ' ' + after

    setDisplayValue(newText)
    onRelationInputChange(parseTextEntries(newText, students, tags))
    setShowSuggestions(false)

    // Set cursor after the inserted mention
    setTimeout(() => {
      const newPosition = atIndex + mention.length + 1
      inputRef.current?.setSelectionRange(newPosition, newPosition)
      setCursorPosition(newPosition)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    onRelationInputChange(parseTextEntries(newValue, students, tags))
    setCursorPosition(e.target.selectionStart || 0)
  }

  const handleClick = () => {
    setCursorPosition(inputRef.current?.selectionStart || 0)
  }

  return (
    <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Relation</h2>
      <p className="text-sm text-gray-600 mb-3">
        Type @ to mention students or tags. Use AND, OR, NOT to create relations.
      </p>
      <div className="relative flex gap-2">
        <div className="flex-1 relative">
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px] pointer-events-none">
            {relationInput.map((entry, index) => {
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
            placeholder="e.g., NOT (@Kakeru AND @Kazuki)"
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
        <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
          Add Relation
        </button>
      </div>
    </section>
  )
}

export default AddRelation
