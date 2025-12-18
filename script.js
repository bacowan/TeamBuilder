// JavaScript code will go here

// Data
let students = [];
let studentIdCounter = 0;

// DOM elements
const studentNameInput = document.getElementById('student-name');
const addStudentBtn = document.getElementById('add-student-btn');
const studentsList = document.getElementById('students-list');
const resetBtn = document.getElementById('reset-btn');
const studentSelect = document.getElementById('student-select');

// Load from localStorage
function loadData() {
    students = JSON.parse(localStorage.getItem('students')) || [];
    studentIdCounter = students.length ? Math.max(...students.map(s => s.id)) + 1 : 0;
    updateStudentsList();
    updateStudentSelect();
}

// Save to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Update students list
function updateStudentsList() {
    studentsList.innerHTML = students.map(s => `
        <li data-id="${s.id}">
            <input type="text" value="${s.name}" class="student-input">
            <button class="delete-btn">Delete</button>
        </li>
    `).join('');
    updateStudents();
}

// Update student select
function updateStudentSelect() {
    studentSelect.innerHTML = '<option value="">Select student</option>';
    students.forEach(s => {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.name;
        studentSelect.appendChild(option);
    });
}

// Update students (for all places that depend on students)
function updateStudents() {
    updateStudentSelect();
}

// Add student
addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name) {
        const id = studentIdCounter++;
        students.push({ id, name });
        saveData();
        updateStudentsList();
        studentNameInput.value = '';
    }
});

// Handle students list events
studentsList.addEventListener('input', (e) => {
    if (e.target.classList.contains('student-input')) {
        const li = e.target.closest('li');
        const id = parseInt(li.dataset.id);
        const student = students.find(s => s.id === id);
        if (student) {
            student.name = e.target.value.trim();
            saveData();
            updateStudents();
        }
    }
});

studentsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const li = e.target.closest('li');
        const id = parseInt(li.dataset.id);
        students = students.filter(s => s.id !== id);
        saveData();
        updateStudentsList();
    }
});

// Reset
resetBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Initialize
loadData();