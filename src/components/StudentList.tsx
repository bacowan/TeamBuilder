import { Student, Tag } from '../types'
import StudentItem from './StudentItem'

interface StudentListProps {
  students: Student[]
  tags: Tag[]
  onUpdateStudentName: (id: string, newName: string) => void
  onDeleteStudent: (id: string) => void
  onAddTag: (id: string, tagName: string) => void
  onRemoveTag: (id: string, tagId: string) => void
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
