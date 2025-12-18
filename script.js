// JavaScript code will go here

// Data
let students = [];

// DOM elements
const studentNameInput = document.getElementById('student-name');
const addStudentBtn = document.getElementById('add-student-btn');
const studentsList = document.getElementById('students-list');
const resetBtn = document.getElementById('reset-btn');

// Load from localStorage
function loadData() {
    students = JSON.parse(localStorage.getItem('students')) || [];
    updateStudentsList();
}

// Save to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Update students list
function updateStudentsList() {
    studentsList.innerHTML = students.map(name => `<li>${name}</li>`).join('');
}

// Add student
addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name && !students.includes(name)) {
        students.push(name);
        saveData();
        updateStudentsList();
        studentNameInput.value = '';
    }
});

// Reset
resetBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Initialize
loadData();