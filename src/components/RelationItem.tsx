import { Relation, Student, Tag } from '../types'
import { validateRelation } from '../utils/teamGenerator'
import RelationInput from './RelationInput'

interface RelationItemProps {
  relation: Relation
  students: Student[]
  tags: Tag[]
  onUpdateRelation: (id: string, value: string, priority: number) => void
  onDeleteRelation: (id: string) => void
}

function RelationItem({ relation, students, tags, onUpdateRelation, onDeleteRelation }: RelationItemProps) {
  const isValid = validateRelation(relation.value)

  return (
    <li className={`border rounded-lg p-4 ${isValid ? 'border-gray-200 bg-gray-50' : 'border-red-300 bg-red-50'}`}>
      <div className="flex gap-2 items-start">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            value={relation.priority}
            onChange={(e) => onUpdateRelation(relation.id, relation.value, parseInt(e.target.value) || 1)}
            placeholder="Priority"
            min="1"
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <RelationInput
            value={relation.value}
            onChange={(value) => onUpdateRelation(relation.id,value, relation.priority)}
            students={students}
            tags={tags}
            placeholder="e.g., NOT (@Kakeru AND @Kazuki)"
          />
          {!isValid && (
            <p className="text-xs text-red-600">Invalid relation: only @ mentions of students/tags are allowed</p>
          )}
        </div>
        <button
          onClick={() => onDeleteRelation(relation.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default RelationItem
