// This module will handle the API calls only
const API = "https://donezoid.onrender.com";
const token = localStorage.getItem("tokenDonezoid")

const header = () => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
})

export async function fetchAllTasksToDisplay(filteredTasks = 'all') {
    const taskGrid = document.querySelector('#task-grid')
    taskGrid.innerHTML = '' // cleans the taskGrid before any fetch happens

    // Check if token exists.
    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`; // Send to login if not registered
        return
    }

    const loaderSentence = document.getElementById('loader');
    loaderSentence?.classList.remove('hidden')
    // Fetch all the tasks

    try {
        const response = await fetch(`${API}/tasks`, {
            method: "GET",
            headers: header()
        });

        if(!response.ok) throw new Error("Failed to fetch tasks");

        let tasksData = await response.json()

        if(tasksData.length > 0) {

            switch(filteredTasks) {
                case 'today':
                    const today = new Date()
                    tasksData = tasksData.filter(task => isSameDay(new Date(task.dueDate), today))
                    break;
                case 'upcoming':
                    let inThreeDays = new Date()
                    inThreeDays.setDate(inThreeDays.getDate() + 3)
                    const inThreeDaysString = inThreeDays.toISOString().split('T')[0]
                    console.log("Upcoming tasks before:", inThreeDaysString);
                    tasksData = tasksData.filter(task => formattingDateToCompare(task.dueDate) < inThreeDaysString)
                    break;
                case 'important':
                    tasksData = tasksData.filter(task => task.priority === 'High')
                    break;
                case 'completed':
                    tasksData = tasksData.filter(task => task.status === 'Done')
                    break;
            }

            displayTaskCards(taskGrid, tasksData)
        }
        addTaskCard(taskGrid)

    } catch (error) {
        console.error(`Error fetching tasks: ${error}`)
        alert("You must be logged in to view tasks");
        window.location.href = `login.html`;
    } finally {
        loaderSentence?.classList.remove('hidden') // hide the loader anyway
    }
}

const displayTaskCards = (parentGrid, tasks) => {
    // Sorting by dates

    const tasksNewlyOrganized = null;
    console.log(typeof tasks)
    if(!tasksNewlyOrganized){
        tasks.sort((a, b) =>  new Date(a.dueDate) - new Date(b.dueDate)) // because dueDate is a string
        // if nothing is passed the display is chronologically and all tasks
    } else if (tasksNewlyOrganized === 'Today') {
        console.log('ready t flter today tass')
    }

    console.log(typeof tasks)
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

const isSameDay = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

const formattingDateToCompare = (date) => {
    return new Date(date).toISOString().split('T')[0]
}

export const createNewTask = async (taskData) => {
    try{
        const response = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: header(),
            body: JSON.stringify(taskData)
        });

        if(!response.ok) throw new Error("Failed to create task");

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