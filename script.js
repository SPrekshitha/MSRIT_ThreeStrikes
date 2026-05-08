// 🔐 PROTECTION
if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please login first");
    window.location.href = "login.html";
}

// 👤 Current logged-in user
let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    alert("User not found");
    window.location.href = "login.html";
}

// 📦 Load tasks for current user
let tasks = JSON.parse(localStorage.getItem(currentUser + "_tasks")) || [];

// 🔄 Display tasks immediately after reload/login
displayTasks();

function saveTasks() {
    localStorage.setItem(currentUser + "_tasks", JSON.stringify(tasks));
}

function addTask() {
    let name = document.getElementById("taskName").value.trim();
    let deadline = document.getElementById("deadline").value;
    let priority = parseInt(document.getElementById("priority").value);

    if (!name || !deadline) {
        alert("Please fill all fields!");
        return;
    }

    tasks.push({
        name,
        deadline,
        priority,
        done: false
    });

    saveTasks();
    displayTasks();

    document.getElementById("taskName").value = "";
    document.getElementById("deadline").value = "";
}

function calculateScore(task) {
    let today = new Date();
    let deadline = new Date(task.deadline);

    let diff = (deadline - today) / (1000 * 60 * 60 * 24);
    let urgency = diff <= 1 ? 3 : diff <= 3 ? 2 : 1;

    return (task.priority * 2) + urgency;
}

function prioritizeTasks() {
    tasks.sort((a, b) => calculateScore(b) - calculateScore(a));

    saveTasks();
    displayTasks();
}

function clearTasks() {
    tasks = [];

    saveTasks();
    displayTasks();
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;

    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);

    saveTasks();
    displayTasks();
}

function editTask(index) {
    let newName = prompt("Edit task name:", tasks[index].name);

    if (newName) {
        tasks[index].name = newName;

        saveTasks();
        displayTasks();
    }
}

function displayTasks() {
    let container = document.getElementById("taskContainer");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = "<p>No tasks added yet</p>";
        return;
    }

    tasks.forEach((task, index) => {
        let div = document.createElement("div");

        let priorityClass =
            task.priority === 3 ? "high" :
            task.priority === 2 ? "medium" : "low";

        div.className = `task ${priorityClass} ${task.done ? "done" : ""}`;

        div.innerHTML = `
            <strong>${task.name}</strong><br>
            Deadline: ${task.deadline}<br>

            <button onclick="toggleDone(${index})">
                ${task.done ? "Undo" : "Done"}
            </button>

            <button onclick="editTask(${index})">Edit</button>

            <button onclick="deleteTask(${index})">Delete</button>
        `;

        container.appendChild(div);
    });
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    alert("Logged out");

    window.location.href = "login.html";
}