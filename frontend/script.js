let tasks = [];

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
    displayTasks();
}

function clearTasks() {
    tasks = [];
    displayTasks();
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

function editTask(index) {
    let newName = prompt("Edit task name:", tasks[index].name);
    if (newName) {
        tasks[index].name = newName;
        displayTasks();
    }
}

function displayTasks() {
    let container = document.getElementById("taskContainer");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = "<p class='empty'>No tasks added yet</p>";
        return;
    }

    tasks.forEach((task, index) => {
        let div = document.createElement("div");

        let priorityClass =
            task.priority === 3 ? "high" :
            task.priority === 2 ? "medium" : "low";

        div.className = `task ${priorityClass} ${task.done ? "done" : ""}`;

        div.innerHTML = `
            <div>
                <strong>${task.name}</strong><br>
                Deadline: ${task.deadline}<br>
                <small>${task.priority === 3 ? "High importance" :
                         task.priority === 2 ? "Medium importance" :
                         "Low importance"}</small>
                
                <div class="task-buttons">
                    <button onclick="toggleDone(${index})">
                        ${task.done ? "Undo" : "Done"}
                    </button>
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}