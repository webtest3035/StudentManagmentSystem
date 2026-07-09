const apiUrl = "http://localhost:3000/students";

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

}


function getTabel(input) {


    let rows = input.map((student, index) =>
        `<tr>
                    <td>${ index + 1}</td>
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
}