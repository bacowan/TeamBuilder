import { useState, useEffect } from 'react'
import Header from './components/Header.tsx'
import AddStudent from './components/AddStudent.tsx'
import StudentList from './components/StudentList.tsx'
import AddRelation from './components/AddRelation.tsx'
import GenerateTeams from './components/GenerateTeams.tsx'
import { Student } from './types'

function App() {
  const [students, setStudents] = useState<Student[]>(() =>
    JSON.parse(localStorage.getItem('students') || '[]') as Student[]
  )
  const [studentName, setStudentName] = useState('')
  const [relationInput, setRelationInput] = useState('')
  const [numTeams, setNumTeams] = useState('')

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  const addStudent = () => {
    const name = studentName.trim()
    if (name) {
      setStudents(prev => {
        const id = prev.length ? Math.max(...prev.map(s => s.id)) + 1 : 0
        return [...prev, { id, name, tags: [] }]
      })
      setStudentName('')
    }
  }

  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const updateStudentName = (id: number, newName: string) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, name: newName.trim() } : s
    ))
  }

  const addTag = (id: number, tag: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id && !s.tags.includes(tag)) {
        return { ...s, tags: [...s.tags, tag] }
      }
      return s
    }))
  }

  const removeTag = (id: number, tag: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, tags: s.tags.filter(t => t !== tag) }
      }
      return s
    }))
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      localStorage.clear()
      setStudents([])
      setStudentName('')
      setRelationInput('')
      setNumTeams('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Header onReset={handleReset} />

        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Students</h2>

          <AddStudent
            studentName={studentName}
            onStudentNameChange={setStudentName}
            onAddStudent={addStudent}
          />

          <StudentList
            students={students}
            onUpdateStudentName={updateStudentName}
            onDeleteStudent={deleteStudent}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        </section>

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
