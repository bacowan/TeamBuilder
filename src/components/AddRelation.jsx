function AddRelation({ relationInput, onRelationInputChange }) {
  return (
    <section className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Relation</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={relationInput}
          onChange={(e) => onRelationInputChange(e.target.value)}
          placeholder="Enter relation"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
          Add Relation
        </button>
      </div>
    </section>
  )
}

export default AddRelation
