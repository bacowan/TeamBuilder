import { useState, useEffect } from 'react'
import Header from './components/Header'
import AddStudent from './components/AddStudent'
import StudentList from './components/StudentList'
import AddTag from './components/AddTag'
import AddRelation from './components/AddRelation'
import GenerateTeams from './components/GenerateTeams'

function App() {
  const [students, setStudents] = useState([])
  const [studentName, setStudentName] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [relationInput, setRelationInput] = useState('')
  const [numTeams, setNumTeams] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students')) || []
    setStudents(savedStudents)
  }, [])

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  const addStudent = () => {
    const name = studentName.trim()
    if (name) {
      const id = students.length ? Math.max(...students.map(s => s.id)) + 1 : 0
      setStudents([...students, { id, name }])
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
        <Header onReset={handleReset} />

        <AddStudent
          studentName={studentName}
          onStudentNameChange={setStudentName}
          onAddStudent={addStudent}
          onKeyDown={handleKeyDown}
        />

        <StudentList
          students={students}
          onUpdateStudentName={updateStudentName}
          onDeleteStudent={deleteStudent}
        />

        <AddTag
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectedStudentChange={setSelectedStudentId}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
        />

        <AddRelation
          relationInput={relationInput}
          onRelationInputChange={setRelationInput}
        />

        <GenerateTeams
          numTeams={numTeams}
          onNumTeamsChange={setNumTeams}
        />
      </div>
    </div>
  )
}

export default App
