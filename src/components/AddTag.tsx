import { Student } from '../types'

interface AddTagProps {
  students: Student[]
  selectedStudentId: string
  onSelectedStudentChange: (id: string) => void
  tagInput: string
  onTagInputChange: (tag: string) => void
}

function AddTag({ students, selectedStudentId, onSelectedStudentChange, tagInput, onTagInputChange }: AddTagProps) {
  return (
    <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Tag to Student</h2>
      <div className="flex flex-col gap-2">
        <select
          value={selectedStudentId}
          onChange={(e) => onSelectedStudentChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            placeholder="Enter tag"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md">
            Add Tag
          </button>
        </div>
      </div>
    </section>
  )
}

export default AddTag
