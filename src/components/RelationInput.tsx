import { Student, Tag } from "../types"
import { MentionsInput, Mention } from 'react-mentions-ts'
import RelationSuggestion from "./RelationSuggestion"

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
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="">
            <Mention
                trigger="@"
                data={students.map(student => ({ id: student.id, display: student.name }))}
                renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) =>
                    <RelationSuggestion/>
                }
            />
            <Mention
                trigger="#"
                data={tags.map(tag => ({ id: tag.id, display: tag.name }))}
                renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) =>
                    <RelationSuggestion/>
                }
            />
        </MentionsInput>
    );
}

export default RelationInput;