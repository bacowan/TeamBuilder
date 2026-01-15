interface RelationSuggestionProps {
    focused: boolean;
    suggestion: string;
}

function RelationSuggestion({focused, suggestion}: RelationSuggestionProps) {
    return (
        <div className={`px-4 py-2 border border-gray-300 cursor-pointer transition-colors ${
            focused ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
        }`}>
            <span className="text-gray-900">{suggestion}</span>
        </div>
    );
}

export default RelationSuggestion;