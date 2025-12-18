interface HeaderProps {
  onReset: () => void
}

function Header({ onReset }: HeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-4xl font-bold text-gray-800">Team Builder</h1>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
      >
        Reset
      </button>
    </div>
  )
}

export default Header
