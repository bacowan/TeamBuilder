import { Student, Tag } from "../types"
import { MentionsInput, Mention } from 'react-mentions-ts'
import RelationSuggestion from "./RelationSuggestion"
import { useState } from "react"

interface RelationInputProps {
  value: string
  onChange: (value: string) => void
  students: Student[]
  tags: Tag[]
  placeholder: string
}

function RelationInput({ value, onChange, students, tags, placeholder }: RelationInputProps) {

    return (
        <MentionsInput
            singleLine
            value={value}
            onMentionsChange={(event) => onChange(event.value)}
            placeholder={placeholder}>
            <Mention
                trigger="@"
                data={students.map(student => ({ id: student.id, display: student.name }))}
                renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) =>
                    <RelationSuggestion suggestion={suggestion.display ?? ""} focused={focused} key={suggestion.id} />
                }
                displayTransform={(id, display) => `@${display}`}
            />
            <Mention
                trigger="#"
                data={tags.map(tag => ({ id: tag.id, display: tag.name }))}
                renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) =>
                    <RelationSuggestion suggestion={suggestion.display ?? ""} focused={focused} key={suggestion.id} />
                }
                displayTransform={(id, display) => `#${display}`}
            />
        </MentionsInput>
    );
}

export default RelationInput;