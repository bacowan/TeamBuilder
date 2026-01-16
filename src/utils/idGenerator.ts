import {v4 as uuidv4} from 'uuid';

// can't use raw uuids since the solver is picky about names.
// It seems to require that the variable start with a letter and
// be alphanumeric.
const generateId = () => {
    return "a" + uuidv4().replace(/-/g, "");
}
export default generateId;
