import { Relation, Student, Tag } from '../types'
import RelationItem from './RelationItem'

interface RelationListProps {
  relations: Relation[]
  students: Student[]
  tags: Tag[]
  onUpdateRelation: (id: string, value: string, priority: number) => void
  onDeleteRelation: (id: string) => void
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
