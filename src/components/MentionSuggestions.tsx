import { Suggestion } from '../types'

interface MentionSuggestionsProps {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (suggestion: Suggestion) => void
}

function MentionSuggestions({ suggestions, selectedIndex, onSelect }: MentionSuggestionsProps) {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.type}-${suggestion.value}`}
          onClick={() => onSelect(suggestion)}
          className={`px-4 py-2 cursor-pointer ${
            index === selectedIndex
              ? 'bg-blue-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded ${
              suggestion.type === 'student'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {suggestion.type}
            </span>
            <span className="font-medium">{suggestion.value}</span>
          </div>
          {suggestion.studentName && (
            <div className="text-xs text-gray-500 ml-16">
              Students: {suggestion.studentName}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MentionSuggestions
