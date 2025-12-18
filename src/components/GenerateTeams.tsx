interface GenerateTeamsProps {
  numTeams: string
  onNumTeamsChange: (numTeams: string) => void
}

function GenerateTeams({ numTeams, onNumTeamsChange }: GenerateTeamsProps) {
  return (
    <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate Teams</h2>
      <div className="flex gap-2">
        <input
          type="number"
          value={numTeams}
          onChange={(e) => onNumTeamsChange(e.target.value)}
          placeholder="Number of teams"
          min="1"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-md">
          Generate Teams
        </button>
      </div>
    </section>
  )
}

export default GenerateTeams
