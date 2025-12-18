interface AddStudentProps {
  studentName: string
  onStudentNameChange: (name: string) => void
  onAddStudent: () => void
}

function AddStudent({ studentName, onStudentNameChange, onAddStudent }: AddStudentProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddStudent()
    }
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={studentName}
        onChange={(e) => onStudentNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
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
  )
}

export default AddStudent
