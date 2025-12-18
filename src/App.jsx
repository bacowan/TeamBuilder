import { useState, useEffect } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [studentIdCounter, setStudentIdCounter] = useState(0)
  const [studentName, setStudentName] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [relationInput, setRelationInput] = useState('')
  const [numTeams, setNumTeams] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students')) || []
    setStudents(savedStudents)
    setStudentIdCounter(
      savedStudents.length ? Math.max(...savedStudents.map(s => s.id)) + 1 : 0
    )
  }, [])

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  const addStudent = () => {
    const name = studentName.trim()
    if (name) {
      const id = studentIdCounter
      setStudents([...students, { id, name }])
      setStudentIdCounter(studentIdCounter + 1)
      setStudentName('')
    }
  }

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id))
  }

  const updateStudentName = (id, newName) => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, name: newName.trim() } : s
    ))
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      localStorage.clear()
      setStudents([])
      setStudentIdCounter(0)
      setStudentName('')
      setSelectedStudentId('')
      setTagInput('')
      setRelationInput('')
      setNumTeams('')
    }
  }

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') {
      callback()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-800">Team Builder</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Reset
          </button>
        </div>

        {/* Add Student Section */}
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Student</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addStudent)}
              placeholder="Enter student name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addStudent}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
            >
              Add Student
            </button>
          </div>
          <ul className="space-y-2">
            {students.map(student => (
              <li key={student.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) => updateStudentName(student.id, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Add Tag Section */}
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Tag to Student</h2>
          <div className="flex flex-col gap-2">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
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
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                Add Tag
              </button>
            </div>
          </div>
        </section>

        {/* Add Relation Section */}
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Relation</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={relationInput}
              onChange={(e) => setRelationInput(e.target.value)}
              placeholder="Enter relation"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
              Add Relation
            </button>
          </div>
        </section>

        {/* Generate Teams Section */}
        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate Teams</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={numTeams}
              onChange={(e) => setNumTeams(e.target.value)}
              placeholder="Number of teams"
              min="1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-md">
              Generate Teams
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
