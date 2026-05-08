

const API_URL = "/tasks";

let tasks = [];

// FETCH TASKS
async function fetchTasks() {

    try {

        const res = await fetch(API_URL);

        const data = await res.json();

        tasks = data;

        displayTasks();

    } catch (err) {

        console.error("Fetch error:", err);
    }
}

// ADD TASK
async function addTask() {

    const name =
        document.getElementById("taskName").value.trim();

    const deadline =
        document.getElementById("deadline").value;

    const priority =
        parseInt(document.getElementById("priority").value);

    if (!name || !deadline) {

        alert("Please fill all fields!");

        return;
    }

    try {

        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                deadline,
                priority
            })
        });

        document.getElementById("taskName").value = "";

        document.getElementById("deadline").value = "";

        fetchTasks();

    } catch (err) {

        console.error("Add error:", err);
    }
}

// DELETE SINGLE TASK
async function deleteTask(id) {

    try {

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        fetchTasks();

    } catch (err) {

        console.error("Delete error:", err);
    }
}

// DELETE ALL TASKS
async function clearTasks() {

    const confirmDelete =
        confirm("Are you sure you want to delete all tasks?");

    if (!confirmDelete) return;

    try {

        await fetch(API_URL, {
            method: "DELETE"
        });

        fetchTasks();

        alert("✔ All tasks cleared successfully.");

    } catch (err) {

        console.error("Clear error:", err);
    }
}

// TOGGLE DONE
async function toggleDone(id, current) {

    try {

        await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                done: !current
            })
        });

        fetchTasks();

    } catch (err) {

        console.error("Toggle error:", err);
    }
}

// DISPLAY TASKS
function displayTasks() {

    const container =
        document.getElementById("taskContainer");

    container.innerHTML = "";

    if (tasks.length === 0) {

        container.innerHTML =
            "<p class='empty'>No tasks added yet</p>";

        return;
    }

    tasks.forEach(task => {

        const div = document.createElement("div");

        const priorityClass =

            task.priority === 3 ? "high" :

            task.priority === 2 ? "medium" :

            "low";

        div.className =
            `task ${priorityClass} ${task.done ? "done" : ""}`;

        div.innerHTML = `

            <strong>${task.name}</strong>

            <div style="font-size: 13px; color:#94a3b8;">
                Deadline: ${task.deadline?.slice(0,10)}
            </div>

            <div style="font-size: 12px; color:#64748b;">
                ${
                    task.priority === 3
                    ? "High importance"

                    : task.priority === 2
                    ? "Medium importance"

                    : "Low importance"
                }
            </div>

            <div class="task-buttons">

                <button onclick="toggleDone('${task._id}', ${task.done})">

                    ${task.done ? "Undo" : "Done"}

                </button>

                <button onclick="deleteTask('${task._id}')">

                    Delete

                </button>

            </div>
        `;

        container.appendChild(div);
    });
}

// PRIORITIZATION
function prioritizeTasks() {

    tasks.sort((a, b) => {

        if (b.priority !== a.priority) {

            return b.priority - a.priority;
        }

        return new Date(a.deadline) - new Date(b.deadline);
    });

    displayTasks();

    alert("✔ Tasks prioritized using adaptive AI logic.");
}

// AI ADVICE
async function generateAIAdvice() {

    const button =
        document.getElementById("aiButton");

    button.disabled = true;

    button.innerText = "Generating...";

    const workload =
        document.getElementById("tasksInput").value;

    const mood =
        document.getElementById("moodInput").value;

    if (!workload.trim()) {

        alert("Please enter your tasks/workload first.");

        button.disabled = false;

        button.innerText =
            "✨ Generate AI Advice";

        return;
    }

    document.getElementById("ai-response")
        .innerHTML =
        "Generating AI insights...";

    const advice =
        await getAIAdvice(workload, mood);

    document.getElementById("ai-response")
        .innerHTML = advice;

    button.disabled = false;

    button.innerText =
        "✨ Generate AI Advice";
}

// GET AI ADVICE
async function getAIAdvice(tasks, mood) {

    try {

        const response = await fetch(

            "/ai",

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

        if (!response.ok) {

            throw new Error("API failed");
        }

        const data = await response.json();

        return data.advice;

    } catch (error) {

        console.log("AI Error:", error);

        if (mood === "Stressed") {

            return `
            ✔ Focus only on urgent tasks first.<br><br>
            ✔ Avoid multitasking during stressful periods.<br><br>
            ✔ Take short breaks every 45 minutes.<br><br>
            ✔ Break large work into smaller milestones.
            `;
        }

        else if (mood === "Tired") {

            return `
            ✔ Start with smaller easier tasks first.<br><br>
            ✔ Use shorter focus sessions today.<br><br>
            ✔ Stay hydrated and avoid burnout.<br><br>
            ✔ Schedule difficult work later if needed.
            `;
        }

        else if (mood === "Overwhelmed") {

            return `
            ✔ Prioritize top 3 important tasks only.<br><br>
            ✔ Reduce unnecessary workload temporarily.<br><br>
            ✔ Focus on one task at a time.<br><br>
            ✔ Use structured time blocks for clarity.
            `;
        }

        else {

            return `
            ✔ Use deep work sessions for productivity.<br><br>
            ✔ Minimize distractions during focus periods.<br><br>
            ✔ Maintain balanced work-rest cycles.<br><br>
            ✔ Track completed tasks for motivation.
            `;
        }
    }
}

// INITIAL LOAD
fetchTasks();
```
