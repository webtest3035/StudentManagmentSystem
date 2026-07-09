const apiUrl = "https://studentmanagmentsystem-nzwk.onrender.com/students";
const nameInput = document.getElementById("studentName");
const ageInput = document.getElementById("studentAge");
const genderInput = document.getElementById("StudentGenderInput");
const courseInput = document.getElementById("StudentCourseInput");
const addStudent = document.getElementById("addStudent");
const updateStudent = document.getElementById("updateStudent");

displayStudentsData();

async function displayStudentsData() {

    try {

        let response = await fetch(`${apiUrl}`);

        if (!response.ok) {
            throw new Error("response is not ok !");
        }

        let result = await response.json();

        getTabel(result);

    }

    catch (error) {
        console.error("Could Not Fetch Data:", error);
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


    let rows = input.map((student, index) =>
        `<tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.gender}</td>
                    <td>${student.course}</td>
                    <td>
                        <button class="editStudent" data-id="${student.id}">Edit</button>
                        <button class="deleteStudent" data-id="${student.id}">Delete</button>
                    </td>
             </tr>`
    ).join("");

    document.getElementById("studentsData").innerHTML = rows;
};