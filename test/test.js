// Copy of functions for testing
function getMatchingStudents(operand, students) {
    if (operand.startsWith('#')) {
        const tag = operand.slice(1);
        return students.filter(s => s.tags.includes(tag)).map(s => s.name);
    } else {
        return [operand];
    }
}

function getPairs(left, right, students) {
    const pairs = [];
    const leftStudents = getMatchingStudents(left, students);
    const rightStudents = getMatchingStudents(right, students);
    leftStudents.forEach(s1 => {
        rightStudents.forEach(s2 => {
            if (s1 !== s2) {
                pairs.push([s1, s2].sort()); // sort to avoid duplicates
            }
        });
    });
    return [...new Set(pairs.map(p => p.join(',')))].map(p => p.split(',')); // unique pairs
}

function getTeam(student, assignment) {
    for (let t = 0; t < assignment.length; t++) {
        if (assignment[t].includes(student)) return t;
    }
    return -1;
}

function calculateScore(assignment, numTeams, constraints, students) {
    let score = 0;
    constraints.forEach(c => {
        const pairs = getPairs(c.left, c.right, students);
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

// Tests
console.log('Testing getMatchingStudents...');
const students = [
    { name: 'Alice', tags: ['math'] },
    { name: 'Bob', tags: ['science'] },
    { name: 'Charlie', tags: ['math', 'science'] }
];
console.assert(getMatchingStudents('Alice', students).join() === 'Alice');
console.assert(getMatchingStudents('#math', students).sort().join() === 'Alice,Charlie');
console.log('getMatchingStudents tests passed.');

console.log('Testing getPairs...');
console.assert(getPairs('Alice', 'Bob', students).length === 1);
console.assert(getPairs('#math', '#science', students).length === 3); // Alice-Charlie, Bob-Charlie, but wait, pairs are unique sorted
// Actually, since sort, and unique, but for #math and #science, pairs: Alice-Charlie, Charlie-Alice (same), Bob-Charlie, Charlie-Bob
// But since sorted, ['Alice','Charlie'], ['Bob','Charlie']
// Wait, Charlie-Alice becomes Alice-Charlie, Bob-Charlie
// So 2 pairs
// Wait, leftStudents: Alice,Charlie; right: Bob,Charlie
// pairs: Alice-Bob, Alice-Charlie, Charlie-Bob, Charlie-Charlie (skip)
// Then sort each: ['Alice','Bob'], ['Alice','Charlie'], ['Bob','Charlie'], ['Charlie','Charlie'] skip
// Then unique: all different
// Yes, 3 pairs
console.assert(getPairs('#math', '#science', students).length === 3);
console.log('getPairs tests passed.');

console.log('Testing calculateScore...');
const assignment = [['Alice', 'Bob'], ['Charlie']];
const constraints = [
    { left: 'Alice', right: 'Bob', type: 'with', importance: 5 },
    { left: 'Alice', right: 'Charlie', type: 'without', importance: 3 }
];
const score = calculateScore(assignment, 2, constraints, students);
console.assert(score === 8); // Alice and Bob together +5, Alice and Charlie apart +3
console.log('calculateScore tests passed.');

console.log('All tests passed!');