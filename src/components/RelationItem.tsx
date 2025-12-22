import { Relation, Student, Tag, RelationEntry } from '../types'
import MentionInput from './MentionInput'

interface RelationItemProps {
  relation: Relation
  students: Student[]
  tags: Tag[]
  onUpdateRelation: (id: number, entries: RelationEntry[], priority: number) => void
  onDeleteRelation: (id: number) => void
}

function RelationItem({ relation, students, tags, onUpdateRelation, onDeleteRelation }: RelationItemProps) {
  return (
    <li className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={relation.priority}
          onChange={(e) => onUpdateRelation(relation.id, relation.entries, parseInt(e.target.value) || 1)}
          placeholder="Priority"
          min="1"
          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <MentionInput
          value={relation.entries}
          onChange={(entries) => onUpdateRelation(relation.id, entries, relation.priority)}
          students={students}
          tags={tags}
          placeholder="e.g., NOT (@Kakeru AND @Kazuki)"
          className="bg-white"
        />
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
