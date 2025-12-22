import { Relation, Student, Tag, RelationEntry } from '../types'
import RelationItem from './RelationItem'

interface RelationListProps {
  relations: Relation[]
  students: Student[]
  tags: Tag[]
  onUpdateRelation: (id: number, entries: RelationEntry[]) => void
  onDeleteRelation: (id: number) => void
}

function RelationList({ relations, students, tags, onUpdateRelation, onDeleteRelation }: RelationListProps) {
  return (
    <ul className="space-y-4">
      {relations.map(relation => (
        <RelationItem
          key={relation.id}
          relation={relation}
          students={students}
          tags={tags}
          onUpdateRelation={onUpdateRelation}
          onDeleteRelation={onDeleteRelation}
        />
      ))}
    </ul>
  )
}

export default RelationList
