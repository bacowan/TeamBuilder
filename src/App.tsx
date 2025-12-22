import { useState, useEffect } from 'react'
import Header from './components/Header.tsx'
import AddStudent from './components/AddStudent.tsx'
import StudentList from './components/StudentList.tsx'
import AddRelation from './components/AddRelation.tsx'
import RelationList from './components/RelationList.tsx'
import GenerateTeams from './components/GenerateTeams.tsx'
import { Student, Tag, RelationEntry, Relation } from './types'

function App() {
  const [students, setStudents] = useState<Student[]>(() =>
    JSON.parse(localStorage.getItem('students') || '[]') as Student[]
  )
  const [tags, setTags] = useState<Tag[]>(() =>
    JSON.parse(localStorage.getItem('tags') || '[]') as Tag[]
  )
  const [relations, setRelations] = useState<Relation[]>(() =>
    JSON.parse(localStorage.getItem('relations') || '[]') as Relation[]
  )
  const [studentName, setStudentName] = useState('')
  const [relationInput, setRelationInput] = useState<RelationEntry[]>([])
  const [numTeams, setNumTeams] = useState('')

  // Save to localStorage whenever students or tags change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags))
  }, [tags])

  useEffect(() => {
    localStorage.setItem('relations', JSON.stringify(relations))
  }, [relations])

  // Clean up unused tags whenever students change
  useEffect(() => {
    const usedTagIds = new Set(students.flatMap(s => s.tags))
    setTags(prevTags => prevTags.filter(tag => usedTagIds.has(tag.id)))
  }, [JSON.stringify(students)])

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

  const addTag = (studentId: number, tagName: string) => {
    const trimmedName = tagName.trim()
    if (!trimmedName) return

    // Find or create tag
    let tag = tags.find(t => t.name === trimmedName)
    if (!tag) {
      const newTagId = tags.length ? Math.max(...tags.map(t => t.id)) + 1 : 0
      tag = { id: newTagId, name: trimmedName }
      setTags(prev => [...prev, tag!])
    }

    // Add tag ID to student
    setStudents(prev => prev.map(s => {
      if (s.id === studentId && !s.tags.includes(tag!.id)) {
        return { ...s, tags: [...s.tags, tag!.id] }
      }
      return s
    }))
  }

  const removeTag = (studentId: number, tagId: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, tags: s.tags.filter(t => t !== tagId) }
      }
      return s
    }))
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      localStorage.clear()
      setStudents([])
      setTags([])
      setRelations([])
      setStudentName('')
      setRelationInput([])
      setNumTeams('')
    }
  }

  const handleAddRelation = () => {
    if (relationInput.length > 0) {
      setRelations(prev => {
        const id = prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 0
        return [...prev, { id, entries: relationInput }]
      })
      setRelationInput([])
    }
  }

  const updateRelation = (id: number, entries: RelationEntry[]) => {
    setRelations(prev => prev.map(r =>
      r.id === id ? { ...r, entries } : r
    ))
  }

  const deleteRelation = (id: number) => {
    setRelations(prev => prev.filter(r => r.id !== id))
  }

  const handleGenerateTeams = () => {
    // TODO: Implement team generation logic
    console.log('Generate teams:', numTeams)
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
            tags={tags}
            onUpdateStudentName={updateStudentName}
            onDeleteStudent={deleteStudent}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        </section>

        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Relations</h2>

          <AddRelation
            relationInput={relationInput}
            onRelationInputChange={setRelationInput}
            students={students}
            tags={tags}
            onAddRelation={handleAddRelation}
          />

          {relations.length > 0 && (
            <div className="mt-4">
              <RelationList
                relations={relations}
                students={students}
                tags={tags}
                onUpdateRelation={updateRelation}
                onDeleteRelation={deleteRelation}
              />
            </div>
          )}
        </section>

        <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate Teams</h2>
          <GenerateTeams
            numTeams={numTeams}
            onNumTeamsChange={setNumTeams}
            onGenerateTeams={handleGenerateTeams}
          />
        </section>
      </div>
    </div>
  )
}

export default App
