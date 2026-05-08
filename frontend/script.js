const API_URL = "https://glorious-rotary-phone-97j95p69g7jg29vp6-5000.app.github.dev/tasks";

let tasks = [];

// Fetch tasks
async function fetchTasks() {
    let res = await fetch(API_URL);
    tasks = await res.json();
    displayTasks();
}

// Add task
async function addTask() {
    let name = document.getElementById("taskName").value.trim();
    let deadline = document.getElementById("deadline").value;
    let priority = parseInt(document.getElementById("priority").value);

    if (!name || !deadline) {
        alert("Please fill all fields!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, deadline, priority })
    });

    document.getElementById("taskName").value = "";
    document.getElementById("deadline").value = "";

    fetchTasks();
}

// Delete
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    fetchTasks();
}

// Toggle done
async function toggleDone(id, current) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: !current })
    });
    fetchTasks();
}

// Display (HER UI STYLE KEPT)
function displayTasks() {
    let container = document.getElementById("taskContainer");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = "<p class='empty'>No tasks added yet</p>";
        return;
    }

    tasks.forEach((task) => {
        let div = document.createElement("div");

        let priorityClass =
            task.priority === 3 ? "high" :
            task.priority === 2 ? "medium" : "low";

        div.className = `task ${priorityClass} ${task.done ? "done" : ""}`;

        div.innerHTML = `
            <strong>${task.name}</strong>

            <div style="font-size: 13px; color:#94a3b8;">
                Deadline: ${task.deadline?.slice(0,10)}
            </div>

            <div style="font-size: 12px; color:#64748b;">
                ${task.priority === 3 ? "High importance":
                    task.priority === 2 ? "Medium importance" :
                    "Low importance"}
            </div>

            <div class="task-buttons">
                <button onclick="toggleDone('${task._id}', ${task.done})">
                    ${task.done ? "Undo" : "Done"}
                </button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;

        container.appendChild(div);
    });
}


// Load on start
fetchTasks();

async function generateAIAdvice() {
    const button =
        document.querySelector(".primary");

    button.disabled = true;

    button.innerText = "Generating...";
    const tasks =
        document.getElementById("tasksInput").value;

    const mood =
        document.getElementById("moodInput").value;

    document.getElementById("ai-response")
        .innerHTML =
        "Generating AI insights...";

    const advice =
        await getAIAdvice(tasks, mood);

    document.getElementById("ai-response")
        .innerHTML = advice;
    button.disabled = false;

    button.innerText =
         "✨ Generate AI Advice";
}
async function getAIAdvice(tasks, mood) {

    try {

        const response = await fetch(
            "http://localhost:5000/ai",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    tasks,
                    mood
                })
            }
        );

        const data = await response.json();

        return data.advice;

    } catch (error) {

        console.log("AI Error:", error);

        if (mood === "Stressed") {

    return `
    ✔ Reduce workload intensity today.

    ✔ Focus only on essential tasks.

    ✔ Include breaks between sessions.

    ✔ Avoid overloading your schedule.
    `;
}

else if (mood === "Tired") {

    return `
    ✔ Start with smaller tasks first.

    ✔ Use shorter focus sessions.

    ✔ Stay hydrated and rested.

    ✔ Maintain consistent progress.
    `;
}

else {

    return `
    ✔ Prioritize important tasks first.

    ✔ Avoid distractions during deep work.

    ✔ Use focused work intervals.

    ✔ Track completed tasks for motivation.
    `;
}
    }
}

