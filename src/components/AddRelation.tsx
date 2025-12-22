import { RelationEntry, Student, Tag } from '../types'
import MentionInput from './MentionInput'
import { validateRelationEntries } from '../utils/textParser'

interface AddRelationProps {
  relationInput: RelationEntry[]
  onRelationInputChange: (relation: RelationEntry[]) => void
  priority: number
  onPriorityChange: (priority: number) => void
  students: Student[]
  tags: Tag[]
  onAddRelation: () => void
}

function AddRelation({ relationInput, onRelationInputChange, priority, onPriorityChange, students, tags, onAddRelation }: AddRelationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddRelation()
  }

  const isValid = validateRelationEntries(relationInput)
  const hasContent = relationInput.length > 0

  return (
    <>
      <p className="text-sm text-gray-600 mb-3">
        Type @ to mention students or tags. Use AND, OR, NOT to create relations.
      </p>
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="priority-input" className="text-xs text-gray-600">Priority</label>
          <input
            id="priority-input"
            type="number"
            value={priority}
            onChange={(e) => onPriorityChange(parseInt(e.target.value) || 1)}
            placeholder="Priority"
            min="1"
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-gray-600">Relation</label>
          <MentionInput
            value={relationInput}
            onChange={onRelationInputChange}
            students={students}
            tags={tags}
            placeholder="e.g., NOT (@Kakeru AND @Kazuki)"
          />
          {hasContent && !isValid && (
            <p className="text-xs text-red-600 mt-1">Invalid relation: only @ mentions of students/tags are allowed</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid || !hasContent}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md self-end disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Relation
        </button>
      </form>
    </>
  )
}

export default AddRelation
