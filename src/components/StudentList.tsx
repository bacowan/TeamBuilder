import { Student } from '../types'
import { useState } from 'react'

interface StudentListProps {
  students: Student[]
  onUpdateStudentName: (id: number, newName: string) => void
  onDeleteStudent: (id: number) => void
  onAddTag: (id: number, tag: string) => void
  onRemoveTag: (id: number, tag: string) => void
}

function StudentList({ students, onUpdateStudentName, onDeleteStudent, onAddTag, onRemoveTag }: StudentListProps) {
  const [tagInputs, setTagInputs] = useState<Record<number, string>>({})

  const handleAddTag = (studentId: number) => {
    const tag = tagInputs[studentId]?.trim()
    if (tag) {
      onAddTag(studentId, tag)
      setTagInputs({ ...tagInputs, [studentId]: '' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, studentId: number) => {
    if (e.key === 'Enter') {
      handleAddTag(studentId)
    }
  }

  return (
    <ul className="space-y-4">
      {students.map(student => (
        <li key={student.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={student.name}
              onChange={(e) => onUpdateStudentName(student.id, e.target.value)}
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
              {student.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => onRemoveTag(student.id, tag)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add tag input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs[student.id] || ''}
              onChange={(e) => setTagInputs({ ...tagInputs, [student.id]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, student.id)}
              placeholder="Add tag..."
              className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
            <button
              onClick={() => handleAddTag(student.id)}
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Add Tag
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default StudentList
