interface AddStudentProps {
  studentName: string
  onStudentNameChange: (name: string) => void
  onAddStudent: () => void
}

function AddStudent({ studentName, onStudentNameChange, onAddStudent }: AddStudentProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddStudent()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces from input
    const value = e.target.value.replace(/\s/g, '')
    onStudentNameChange(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={studentName}
        onChange={handleChange}
        placeholder="Enter student name (no spaces)"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
      >
        Add Student
      </button>
    </form>
  )
}

export default AddStudent
