import { Team } from "../types"

interface GenerateTeamsProps {
  generatedTeams: Team[]
  numTeams: string
  onNumTeamsChange: (numTeams: string) => void
  onGenerateTeams: () => void
}

function GenerateTeams({ generatedTeams, numTeams, onNumTeamsChange, onGenerateTeams }: GenerateTeamsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerateTeams()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          value={numTeams}
          onChange={(e) => onNumTeamsChange(e.target.value)}
          placeholder="Number of teams"
          min="1"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-md">
          Generate Teams
        </button>
      </form>

      {generatedTeams.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {generatedTeams.map((team, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Team {index + 1}</h3>
              <ul className="space-y-1">
                {team.students.map(studentId => (
                  <li key={studentId} className="text-gray-700">{studentId}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenerateTeams
