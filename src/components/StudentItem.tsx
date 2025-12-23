import { Student, Tag } from '../types'
import { useState, useRef, useEffect } from 'react'

interface StudentItemProps {
  student: Student
  tags: Tag[]
  onUpdateStudentName: (id: number, newName: string) => void
  onDeleteStudent: (id: number) => void
  onAddTag: (id: number, tagName: string) => void
  onRemoveTag: (id: number, tagId: number) => void
}

function StudentItem({ student, tags, onUpdateStudentName, onDeleteStudent, onAddTag, onRemoveTag }: StudentItemProps) {
  const [tagInput, setTagInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLFormElement>(null)

  // Filter tags that are not already assigned to this student
  const availableTags = tags.filter(tag => !student.tags.includes(tag.id))

  // Further filter based on search input
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagInput.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddTag = (tagName?: string) => {
    const name = (tagName || tagInput).trim()
    if (name) {
      onAddTag(student.id, name)
      setTagInput('')
      setShowDropdown(false)
    }
  }

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddTag()
  }

  const handleTagClick = (tagName: string) => {
    handleAddTag(tagName)
  }

  // Helper to get tag name by ID
  const getTagName = (tagId: number): string => {
    return tags.find(t => t.id === tagId)?.name || ''
  }

  return (
    <li className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex gap-2 items-center mb-2">
        <input
          type="text"
          value={student.name}
          onChange={(e) => {
            // Remove spaces from input
            const value = e.target.value.replace(/\s/g, '')
            onUpdateStudentName(student.id, value)
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={() => onDeleteStudent(student.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          Delete
        </button>
      </div>

      {/* Tags display */}
      {student.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {student.tags.map((tagId) => (
            <span
              key={tagId}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {getTagName(tagId)}
              <button
                onClick={() => onRemoveTag(student.id, tagId)}
                className="hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add tag input */}
      <form onSubmit={handleTagSubmit} className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Add tag..."
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
          <button
            type="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Add Tag
          </button>
        </div>

        {/* Dropdown for existing tags */}
        {showDropdown && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </form>
    </li>
  )
}

export default StudentItem
