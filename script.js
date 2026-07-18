const apiUrl = "https://studentmanagmentsystem-nzwk.onrender.com/students";
const nameInput = document.getElementById("studentName");
const ageInput = document.getElementById("studentAge");
const genderInput = document.getElementById("StudentGenderInput");
const courseInput = document.getElementById("StudentCourseInput");
const addStudent = document.getElementById("addStudent");
const updateStudent = document.getElementById("updateStudent");
const table = document.querySelector("table");
const pagination = document.getElementById("pagination");
const loading = document.getElementById("loading");
let currentPage = 1;
let itemsPerPage = 5;
let allStudents = 0;

displayStudentsData();

async function displayStudentsData() {

    showLoading();

    try {

        let response = await fetch(`${apiUrl}?_page=${currentPage}&_per_page=${itemsPerPage}`);

        if (!response.ok) {
            throw new Error("response is not ok !");
        }

        let result = await response.json();

        let students = result.data;
        allStudents = result.items;

        getTabel(students);
        createPagination();

    }

    catch (error) {
        console.error("Could Not Fetch Data:", error);
    }

    finally {
        hideLoading();
    }

};

addStudent.addEventListener("click", async () => {

    let name = nameInput.value;
    let age = Number(ageInput.value);
    let gender = genderInput.value;
    let course = courseInput.value;

    if (!isInputValid(name, age)) {
        return;
    }

    name = capitalizeName(name);

    let studentInfo = {
        name,
        age,
        gender,
        course
    };

    showLoading();

    try {

        let response = await fetch(apiUrl, {

            method: "post",

            headers: {
                "content-Type": "application/json"
            },

            body: JSON.stringify(studentInfo)
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        await displayStudentsData();

        alert(`${name} Added !`);

        clearForm();
    }

    catch (error) {
        console.error(error);
    }

    finally {
        hideLoading();
    }
});

table.addEventListener("click", (event) => {

    if (event.target.classList.contains("deleteStudent")) {
        deleteStudent(event.target.dataset.id);
    }

    if (event.target.classList.contains("editStudent")) {
        editStudent(event.target.dataset.id);
    }

});

async function deleteStudent(id) {

    let confirmDelete = confirm("Are you sure you want to delete ?");

    if (!confirmDelete) {
        return;
    }

    showLoading();

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        });

        await displayStudentsData();
    }

    catch (error) {
        console.error("Error in Delition:", error);
    }

    finally {
        hideLoading();
    }
};

let editingId = null;

async function editStudent(id) {

    showLoading();

    try {
        let response = await fetch(`${apiUrl}/${id}`);

        if (!response.ok) {
            throw new Error("Update failed");
        }

        let student = await response.json();

        editingId = id;

        document.getElementById("studentName").value = student.name;
        document.getElementById("studentAge").value = student.age;
        document.getElementById("StudentGenderInput").value = student.gender;
        document.getElementById("StudentCourseInput").value = student.course;
        document.getElementById("addStudent").style.display = "none";
        document.getElementById("updateStudent").style.display = "inline-block";
    }

    catch (error) {
        console.error("Could Not Update Data:", error);
    }

    finally {
        hideLoading();
    }
};

updateStudent.addEventListener("click", async () => {

    let name = nameInput.value;
    let age = Number(ageInput.value);
    let gender = genderInput.value;
    let course = courseInput.value;

    if (!isInputValid(name, age)) {
        return;
    }

    name = capitalizeName(name);

    let updateStudent = {
        name,
        age,
        gender,
        course
    };

    showLoading();

    try {
        await fetch(`${apiUrl}/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateStudent)
        })

        await displayStudentsData();

        clearForm();

        alert(`${name} is Updated !`)
    }

    catch (error) {
        console.error("Error in Update:", error);
    }

    finally {
        hideLoading();
    }
});

function isInputValid(name, age) {

    const regex = /^[A-Za-z ]+$/;

    name = name.trim();

    if (name === null || name === undefined || name === "" || !isNaN(name) || !regex.test(name)) {
        alert("Invalid Name !");
        return false;
    }

    if (age <= 0 || !Number.isInteger(age)) {
        alert("Invalid Age !");
        return false;
    }

    return true;
};

function capitalizeName(input) {

    input = input.trim().split(" ");

    let capitalizedWords = [];

    for (let words of input) {
        capitalizedWords.push(words.charAt(0).toUpperCase() + words.slice(1).toLowerCase());
    }

    return capitalizedWords = capitalizedWords.join(" ");

};

function clearForm() {

    document.getElementById("studentName").value = "";
    document.getElementById("studentAge").value = "";
    document.getElementById("StudentGenderInput").selectedIndex = 0;
    document.getElementById("StudentCourseInput").selectedIndex = 0;
    document.getElementById("addStudent").style.display = "inline-block";
    document.getElementById("updateStudent").style.display = "none";
    editingId = null;
};

function getTabel(input) {

    let startIndex = (currentPage - 1) * itemsPerPage;

    let rows = input.map((student, index) =>
        `<tr>
            <td>${startIndex + index + 1}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.course}</td>
            <td>
                <button class="editStudent" data-id="${student.id}">Edit</button>
                <button class="deleteStudent" data-id="${student.id}">Delete</button>
            </td>
        </tr>`).join("");

    document.getElementById("studentsData").innerHTML = rows;
};

function createPagination() {

    let totalPages = Math.ceil(allStudents / itemsPerPage);

    if (currentPage === 1) {

        document.getElementById("previousPage").style.display = "none";
    }
    else {
        document.getElementById("previousPage").style.display = "inline-block";
    }

    if (currentPage === totalPages) {
        document.getElementById("nextPage").style.display = "none";
    }
    else {
        document.getElementById("nextPage").style.display = "inline-block";
    }

};

pagination.addEventListener("click", (event) => {

    if (event.target.id === "previousPage") {
        previous();
    }

    if (event.target.id === "nextPage") {
        next();
    }
});

function next() {

    let totalPages = Math.ceil(allStudents / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayStudentsData();
        pageChange();
        clearForm();
    }
};

function previous() {

    if (currentPage > 1) {
        currentPage--;
        displayStudentsData();
        pageChange();
        clearForm();
    }
};

function pageChange() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};


function showLoading() {
    loading.style.display = "block";
    table.style.display = "none"
}

function hideLoading() {
    loading.style.display = "none";
    table.style.display = "table"
}