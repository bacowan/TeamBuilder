// Data structures
let students = [];
let tags = new Set();
let constraints = [];

// DOM elements
const studentNameInput = document.getElementById('student-name');
const addStudentBtn = document.getElementById('add-student-btn');
const studentSelect = document.getElementById('student-select');
const tagInput = document.getElementById('tag-input');
const addTagBtn = document.getElementById('add-tag-btn');
const existingTagsDiv = document.getElementById('existing-tags');
const leftOperandSelect = document.getElementById('left-operand');
const operatorSelect = document.getElementById('operator');
const rightOperandSelect = document.getElementById('right-operand');
const importanceInput = document.getElementById('importance');
const addRelationBtn = document.getElementById('add-relation-btn');
const relationsListDiv = document.getElementById('relations-list');
const numTeamsInput = document.getElementById('num-teams');
const generateBtn = document.getElementById('generate-btn');
const teamsOutputDiv = document.getElementById('teams-output');

// Add student
addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name && !students.find(s => s.name === name)) {
        students.push({ name, tags: [] });
        updateStudentSelect();
        updateOperands();
        studentNameInput.value = '';
    }
});

// Add tag to student
addTagBtn.addEventListener('click', () => {
    const studentName = studentSelect.value;
    const tag = tagInput.value.trim();
    if (studentName && tag) {
        const student = students.find(s => s.name === studentName);
        if (student && !student.tags.includes(tag)) {
            student.tags.push(tag);
            tags.add(tag);
            updateExistingTags();
            updateOperands();
            tagInput.value = '';
        }
    }
});

// Update student select
function updateStudentSelect() {
    studentSelect.innerHTML = '<option value="">Select student</option>';
    students.forEach(s => {
        const option = document.createElement('option');
        option.value = s.name;
        option.textContent = s.name;
        studentSelect.appendChild(option);
    });
}

// Update existing tags
function updateExistingTags() {
    existingTagsDiv.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        span.addEventListener('click', () => {
            tagInput.value = tag;
        });
        existingTagsDiv.appendChild(span);
    });
}

// Update operands for relations
function updateOperands() {
    const selects = [leftOperandSelect, rightOperandSelect];
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select</option>';
        students.forEach(s => {
            const option = document.createElement('option');
            option.value = s.name;
            option.textContent = s.name;
            select.appendChild(option);
        });
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = '#' + tag;
            option.textContent = '#' + tag;
            select.appendChild(option);
        });
    });
}

// Add relation
addRelationBtn.addEventListener('click', () => {
    const left = leftOperandSelect.value;
    const op = operatorSelect.value;
    const right = rightOperandSelect.value;
    const imp = parseInt(importanceInput.value);
    if (left && right && imp) {
        constraints.push({ left, right, type: op, importance: imp });
        updateRelationsList();
        leftOperandSelect.value = '';
        rightOperandSelect.value = '';
        importanceInput.value = '';
    }
});

// Update relations list
function updateRelationsList() {
    relationsListDiv.innerHTML = '';
    constraints.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'relation-item';
        div.textContent = `${c.left} ${c.type === 'with' ? 'should be with' : 'should not be with'} ${c.right} (importance: ${c.importance})`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            constraints.splice(i, 1);
            updateRelationsList();
        });
        div.appendChild(removeBtn);
        relationsListDiv.appendChild(div);
    });
}

// Generate teams
generateBtn.addEventListener('click', () => {
    const numTeams = parseInt(numTeamsInput.value);
    if (numTeams && students.length) {
        const teams = generateTeams(numTeams);
        displayTeams(teams);
    }
});

// Generate teams function
function generateTeams(numTeams) {
    if (!students.length) return [];
    const studentNames = students.map(s => s.name);
    let bestTeams = null;
    let maxScore = -1;

    function backtrack(assignment, index) {
        if (index === studentNames.length) {
            const score = calculateScore(assignment, numTeams);
            if (score > maxScore) {
                maxScore = score;
                bestTeams = assignment.map(team => [...team]);
            }
            return;
        }
        for (let t = 0; t < numTeams; t++) {
            assignment[t].push(studentNames[index]);
            backtrack(assignment, index + 1);
            assignment[t].pop();
        }
    }

    const assignment = Array.from({ length: numTeams }, () => []);
    backtrack(assignment, 0);
    return bestTeams || assignment; // fallback to random if no constraints
}

function calculateScore(assignment, numTeams) {
    let score = 0;
    constraints.forEach(c => {
        const pairs = getPairs(c.left, c.right);
        pairs.forEach(([s1, s2]) => {
            const t1 = getTeam(s1, assignment);
            const t2 = getTeam(s2, assignment);
            const same = t1 === t2;
            if ((c.type === 'with' && same) || (c.type === 'without' && !same)) {
                score += c.importance;
            }
        });
    });
    return score;
}

function getPairs(left, right) {
    const pairs = [];
    const leftStudents = getMatchingStudents(left);
    const rightStudents = getMatchingStudents(right);
    leftStudents.forEach(s1 => {
        rightStudents.forEach(s2 => {
            if (s1 !== s2) {
                pairs.push([s1, s2].sort()); // sort to avoid duplicates
            }
        });
    });
    return [...new Set(pairs.map(p => p.join(',')))].map(p => p.split(',')); // unique pairs
}

function getMatchingStudents(operand) {
    if (operand.startsWith('#')) {
        const tag = operand.slice(1);
        return students.filter(s => s.tags.includes(tag)).map(s => s.name);
    } else {
        return [operand];
    }
}

function getTeam(student, assignment) {
    for (let t = 0; t < assignment.length; t++) {
        if (assignment[t].includes(student)) return t;
    }
    return -1;
}

// Display teams
function displayTeams(teams) {
    teamsOutputDiv.innerHTML = '';
    teams.forEach((team, i) => {
        const div = document.createElement('div');
        div.className = 'team';
        div.innerHTML = `<h3>Team ${i + 1}</h3><ul>${team.map(name => `<li>${name}</li>`).join('')}</ul>`;
        teamsOutputDiv.appendChild(div);
    });
}

// Initial updates
updateStudentSelect();
updateExistingTags();
updateOperands();
updateRelationsList();