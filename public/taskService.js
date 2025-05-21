// This module will handle the API calls only
const API = "https://donezoid.onrender.com";
const token = localStorage.getItem("tokenDonezoid")

const header = () => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
})

export async function fetchAllTasksToDisplay() {

    // Check if token exists.
    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`; // Send to login if not registered
        return
    }

    document.getElementById('loader')?.classList.remove('hidden')
    // Fetch all the tasks
    await fetch(`${API}/tasks`, {
        method: "GET",
        headers: header()
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`Unauthorized: ${response.status}`)
            }
            return response.json()
        })
        .then((tasks) => {
            const listElement = document.getElementById("task-grid")
            document.querySelector('#task-grid').innerHTML = ''
            if(tasks.length > 0) {
                document.getElementById('loader')?.classList.add('hidden')
                displayTaskCards(listElement, tasks)
                addTaskCard(listElement)
                
            } else {
                const noTasksAvailable = document.createElement("h2")
                noTasksAvailable.textContent = 'Create some tasks...'
                listElement.appendChild(noTasksAvailable)
            }
        })
        .catch(error => {
            console.error(`Error fetching tasks: ${error}`)
            alert("You must be logged in to view tasks");
            window.location.href = `login.html`;
    })
}

const displayTaskCards = (parentGrid, tasks) => {
    tasks.forEach((task) => {
        const liTaskItem = document.createElement("li");
        liTaskItem.classList.add("task-card")

        const readableDate = formattingDate(task.dueDate)
        console.log(task._id, task.title)
        liTaskItem.innerHTML = `
            <h3 id=${task._id} data-id=${task._id}>${task.title}</h3>
            <p class="task-desc">${task.content}</p>
            <p class="task-due">Due: ${readableDate || "No due date-"}</p>
            <div class="buttons-actions-card">
                <button class="btn-edit" data-id=${task._id}>Edit</button>
                <button class="delete-btn" data-id=${task._id}>Delete</button>
            </div>
            <span class="status-badge ${task.status}">${task.status}</span>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
        `;
        
        parentGrid.appendChild(liTaskItem)
    })
}

const addTaskCard = (parentGrid) => {
    const addCard = document.createElement("li");
    addCard.classList.add("task-card")
    addCard.classList.add("adding-task-card")
    addCard.textContent = "➕ Add Task"
    
    parentGrid.appendChild(addCard)
}

const formattingDate = (date) => {
    const dateFormatted = new Date(date)
    
    return (
        dateFormatted.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    )
}

export const createNewTask = async (taskData) => {
    try{
        console.log(taskData)
        const response = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        });

        if(!response.ok) {
            throw new Error("Failed to create task");
        }
        const newTask = await response.json()
        console.log(`New task created ${newTask}`)

    }catch(error){
        console.log(`Error creating new task: ${error}`)
    }
}

export const getSpecificTask = async (taskId) => {
    try {
        const response = await fetch(`${API}/tasks/${taskId}`, {
            method: "GET",
            headers: header()
        })

        if(!response.ok) throw new Error('Failed to update task.')

        return response.json()

    } catch (error) {
        console.log(`Error getting task with id: ${taskId} => ${error}`)
    }
}

export const updateTask = async(taskData, taskId) => {
    try{
        console.log(taskData, taskId)

        const response = await fetch(`${API}/tasks/${taskId}`, {
            method: "PATCH",
            headers: header(),
            body: JSON.stringify(taskData)
        })

        if(!response.ok) throw new Error('Failed to update task.')

        console.log(`Task updated successfully.`);
    } catch (error) {
        console.log(`Failed updating the task => ${error}`)
    }
}

export const deleteTask = async (taskId) => {
    try{
        const response = await fetch(`${API}/tasks/${taskId}`, {
            method: "DELETE",
            headers: header()
        })

        if(!response.ok) throw new Error("Failed to delete task");

    } catch (error) {
        console.log(`Error deleting task with id:${taskId} => ${error}`)
    }
}