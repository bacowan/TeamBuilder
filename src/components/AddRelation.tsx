import { RelationEntry, Student, Tag } from '../types'
import MentionInput from './MentionInput'

interface AddRelationProps {
  relationInput: RelationEntry[]
  onRelationInputChange: (relation: RelationEntry[]) => void
  students: Student[]
  tags: Tag[]
  onAddRelation: () => void
}

function AddRelation({ relationInput, onRelationInputChange, students, tags, onAddRelation }: AddRelationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddRelation()
  }

  return (
    <>
      <p className="text-sm text-gray-600 mb-3">
        Type @ to mention students or tags. Use AND, OR, NOT to create relations.
      </p>
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <MentionInput
          value={relationInput}
          onChange={onRelationInputChange}
          students={students}
          tags={tags}
          placeholder="e.g., NOT (@Kakeru AND @Kazuki)"
        />
        <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
          Add Relation
        </button>
      </form>
    </>
  )
}

export default AddRelation
