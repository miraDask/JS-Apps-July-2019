(function () {
    window.onload = loadStudents;

    const idCollection = [];
    const facultyNumbersCollection = [];
    const elements = {
        id: document.getElementById('id'),
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        facultyNumber: document.getElementById('facultyNumber'),
        grade: document.getElementById('grade'),
        table: document.getElementById('results'),
        tbody: document.getElementsByTagName('tbody')[0],
        btnSubmit: document.getElementById('submit')
    }

    const url = 'https://baas.kinvey.com/appdata/kid_BkL3yFobr/students';
    const authorizationString = 'Z3Vlc3Q6Z3Vlc3Q=';
    const headers = {
        'Authorization': `Basic ${authorizationString}`,
        'Content-Type': 'application/json'
    };

    elements.btnSubmit.addEventListener('click', registerStudent);

    function loadStudents() {
        elements.tbody.innerHTML = '';

        fetch(url, {
                method: 'GET',
                headers,
            })
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => a.id - b.id);
                data.forEach(student => {
                    const {
                        id,
                        firstName,
                        lastName,
                        facultyNumber,
                        grade
                    } = student;
                    idCollection.push(student.id);
                    facultyNumbersCollection.push(student.facultyNumber);
                    studentTr = createTableRow(id, firstName, lastName, facultyNumber, grade);
                    elements.tbody.appendChild(studentTr);
                });
            })
            .catch(alert);
    }

    async function registerStudent(event) {
        event.preventDefault();
        const student = getStudentInfo();
        const fieldIsEmpty = !student.id ||
            !student.firstName ||
            !student.lastName ||
            !student.facultyNumber ||
            !student.grade;

        if (idCollection.some(id => id === student.id)) {
            alert(`Student with id: ${student.id} already exists!`);
        } else if (facultyNumbersCollection.some(fn => fn === student.facultyNumber)) {
            alert(`Student with faculty number: ${student.facultyNumber} already exists!`);
        } else if (fieldIsEmpty) {
            alert('You must fill all input fields');
        } else {
            await fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(student)
                })
                .then(response => response.json())
                .catch(alert)

            clearInputFields();
            await loadStudents();
        }
    }

    function getStudentInfo() {
        const id = elements.id.value;
        const firstName = elements.firstName.value;
        const lastName = elements.lastName.value;
        const facultyNumber = elements.facultyNumber.value;
        const grade = elements.grade.value;

        return {
            id,
            firstName,
            lastName,
            facultyNumber,
            grade
        }
    }

    function clearInputFields() {
        elements.id.value = '';
        elements.firstName.value = '';
        elements.lastName.value = '';
        elements.facultyNumber.value = '';
        elements.grade.value = '';
    }

    function createTableRow(id, firstName, lastName, facultyNumber, grade) {
        const tr = document.createElement('tr');
        const tdId = document.createElement('td');
        tdId.textContent = id;
        const tdFirstName = document.createElement('td');
        tdFirstName.textContent = firstName;
        const tdLastName = document.createElement('td');
        tdLastName.textContent = lastName;
        const tdFacultyNumber = document.createElement('td');
        tdFacultyNumber.textContent = facultyNumber;
        const tdGrade = document.createElement('td');
        tdGrade.textContent = grade;

        tr.appendChild(tdId);
        tr.appendChild(tdFirstName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdFacultyNumber);
        tr.appendChild(tdGrade);

        return tr;
    }
})()