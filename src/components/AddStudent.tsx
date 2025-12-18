interface AddStudentProps {
  studentName: string
  onStudentNameChange: (name: string) => void
  onAddStudent: () => void
  onKeyDown: (e: React.KeyboardEvent, callback: () => void) => void
}

function AddStudent({ studentName, onStudentNameChange, onAddStudent, onKeyDown }: AddStudentProps) {
  return (
    <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Student</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          onKeyDown={(e) => onKeyDown(e, onAddStudent)}
          placeholder="Enter student name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAddStudent}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
        >
          Add Student
        </button>
      </div>
    </section>
  )
}

export default AddStudent
