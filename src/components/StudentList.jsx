function StudentList({ students, onUpdateStudentName, onDeleteStudent }) {
  return (
    <ul className="space-y-2">
      {students.map(student => (
        <li key={student.id} className="flex gap-2 items-center">
          <input
            type="text"
            value={student.name}
            onChange={(e) => onUpdateStudentName(student.id, e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => onDeleteStudent(student.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default StudentList
