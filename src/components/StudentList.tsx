import { Student, Tag } from '../types'
import StudentItem from './StudentItem'

interface StudentListProps {
  students: Student[]
  tags: Tag[]
  onUpdateStudentName: (id: number, newName: string) => void
  onDeleteStudent: (id: number) => void
  onAddTag: (id: number, tagName: string) => void
  onRemoveTag: (id: number, tagId: number) => void
}

function StudentList({ students, tags, onUpdateStudentName, onDeleteStudent, onAddTag, onRemoveTag }: StudentListProps) {
  return (
    <ul className="space-y-4">
      {students.map(student => (
        <StudentItem
          key={student.id}
          student={student}
          tags={tags}
          onUpdateStudentName={onUpdateStudentName}
          onDeleteStudent={onDeleteStudent}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      ))}
    </ul>
  )
}

export default StudentList
