let isEditMode = false;
let editingTaskId = null; // this will store the ID being modified
const token = localStorage.getItem("token")
const linkLocalhost = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
    
    // Fetch all the displays
    fetchAllTasksToDisplay()
    
    // Displays the info of the logged in user
    userInfoHeader()

    // Closes the modal when pressing the X button in the modal
    const closeModalButton = document.querySelector(".button-close-modal")
    closeModalButton.addEventListener('click', () => {
        closeModal()
    })
    
    // This will send the data to the backend
    document.addEventListener('click', (event) => {
        if(event.target.classList.contains("submit-button-new-task")){
            event.preventDefault()


            const taskData = {
                title : document.querySelector("#title").value,
                content : document.querySelector("#content").value,
                status : document.querySelector("#status-task").value,
                dueDate : document.querySelector("#dueDate").value,
                priority : document.querySelector("#priority-task").value
            }

            createNewTask(taskData)
            clearInputModal()
            document.querySelector('#task-grid').innerHTML = ''
            fetchAllTasksToDisplay()
            closeModal()
        }
    })

    // Edit and delete are quite similar, I can make only one function.
    document.addEventListener('click', (event) => {
        if(event.target.classList.contains('delete-btn')) {
            const deleteButton = event.target;

            // this will get the closest 
            const taskItem = deleteButton.closest('.task-card')

            const taskId = taskItem.querySelector('h3').id // id inside the h3 id

            deleteTask(taskId)
            document.querySelector('#task-grid').innerHTML = ''
            fetchAllTasksToDisplay()
        }
    })

    // Entering Edit Mode
    document.addEventListener('click', async (event) =>{
        if(event.target.classList.contains('btn-edit')){
            const editButton = event.target;

            isEditMode = true
            document.querySelector('.button-modal').classList.add('btn-update')
            document.querySelector('.button-modal').classList.remove('submit-button-new-task');
            const taskItem = editButton.closest('.task-card')

            const taskId = taskItem.querySelector('h3').id

            editingTaskId = taskId

            await getSpecificTask(taskId)
        }
    })

    document.addEventListener('click', async(event) => {
        
        if(event.target.classList.contains('btn-update')){
            event.preventDefault()

            const taskData = {
                title : document.querySelector("#title").value,
                content : document.querySelector("#content").value,
                status : document.querySelector("#status-task").value,
                dueDate : document.querySelector("#dueDate").value,
                priority : document.querySelector("#priority-task").value
            }

            await updateTask(taskData, editingTaskId)
            clearInputModal()
            editingTaskId = null;
            document.querySelector('#task-grid').innerHTML = ''
            fetchAllTasksToDisplay()
            closeModal()
        }
    })

    // Set minimum date on due date input.
    const dueDateInput = document.querySelector("#dueDate");
    const today = new Date().toISOString().split("T")[0]; // format to YYYY-MM-DD
    dueDateInput.min = today
})

const fetchAllTasksToDisplay = () => {   
    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`;
        return
    }

    fetch(`${linkLocalhost}/tasks`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`Unauthorized: ${response.status}`)
            }
            return response.json()
        })
        .then((tasks) => {
            const listElement = document.getElementById("task-grid")
            if(tasks.length > 0) {
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

const createNewTask = async (taskData) => {
    try{
        console.log(taskData)
        const response = await fetch(`${linkLocalhost}/tasks`, {
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

const deleteTask = async (taskId) => {
    try{
        const response = await fetch(`${linkLocalhost}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        if(!response.ok) {
            throw new Error("Failed to delete task");
        }

    } catch (error) {
        console.log(`Error deleting task with id:${taskId} => ${error}`)
    }
}

const getSpecificTask = async (taskId) => {
    try {
        fetch(`${linkLocalhost}/tasks/${taskId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(!response.ok) {
                throw new Error(`Unauthorized: ${response.status}`)
            }
            return response.json()
        }).then((task) => {
            // Here showModal and populate with details
            showModal()
            const dateFormattedToGb = new Date(task.dueDate).toLocaleDateString("en-US")
            document.querySelector("#title").value = task.title;
            document.querySelector("#content").value = task.content;
            document.querySelector("#dueDate").value = dateFormattedToGb;
        }).catch(error => {
            console.error(`Error fetching tasks: ${error}`)
            alert("You must be logged in to view tasks");
            window.location.href = `login.html`;
        })

    } catch (error) {
        console.log(`Error getting task with id: ${taskId} => ${error}`)
    }
}

const updateTask = async(taskData, taskId) => {
    try{
        console.log(taskData, taskId)

        const response = await fetch(`${linkLocalhost}/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })

        if(!response.ok){
            throw new Error('Failed to update task.')
        }

        console.log(`Task updated successfully.`);
    } catch (error) {
        console.log(`Failed updating the task => ${error}`)
    }
}

const addTaskCard = (parentGrid) => {
    const addCard = document.createElement("li");
    addCard.classList.add("task-card")
    addCard.classList.add("adding-task-card")
    addCard.textContent = "➕ Add Task"

    addCard.addEventListener('click', () => {
        document.querySelector('.button-modal').classList.add('submit-button-new-task')
        showModal()
    })
    
    parentGrid.appendChild(addCard)
}

const showModal = () => {
    const containerModal = document.querySelector(".container-modal");
    containerModal.classList.remove("modal-hidden")
    
    const buttonSubmitOrEdit = document.querySelector(".button-modal")

    if(!isEditMode) {
        clearInputModal()
        buttonSubmitOrEdit.innerHTML = `Submit New Task`
    } else {
        buttonSubmitOrEdit.innerHTML = `Update Task`
    } 
}

const closeModal = () => {
    const containerModal = document.querySelector(".container-modal");
    containerModal.classList.add("modal-hidden")

    const buttonModal = document.querySelector('.button-modal');
    buttonModal.classList.remove('submit-button-new-task');
    buttonModal.classList.remove('btn-update');

    isEditMode = false
    editingTaskId = null;
}

// Title / Description / Due Date / Edit and Delete buttons / Status Badge - Progress, Done, etc....
const displayTaskCards = (parentGrid, tasks) => {
    tasks.forEach((task) => {
        const liTaskItem = document.createElement("li");
        liTaskItem.classList.add("task-card")

        const readableDate = formattingDate(task.dueDate)
        console.log(task._id, task.title)
        liTaskItem.innerHTML = `
            <h3 id=${task._id}>${task.title}</h3>
            <p class="task-desc">${task.content}</p>
            <p class="task-due">Due: ${readableDate || "No due date-"}</p>
            <div class="buttons-actions-card">
                <button class="btn-edit">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
            <span class="status-badge ${task.status}">${task.status}</span>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
        `;
        
        parentGrid.appendChild(liTaskItem)
    })
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

const userInfoHeader = () => {
    const divDropdownMenu = document.querySelector(".dropdown-content")
    const userName = JSON.parse(localStorage.getItem("user")).name
    const buttonHoverNameOrLogin = document.querySelector(".dropdown-button")

    if(!userName){
        buttonHoverNameOrLogin.textContent = 'Login';
    } else {
        divDropdownMenu.innerHTML = ''
        buttonHoverNameOrLogin.textContent = userName;
        const dropdownArrayUserExist = ['Options', 'Dark Mode', 'Logout']
        dropdownArrayUserExist.map((optionDropdown) => {
            divDropdownMenu.innerHTML += `<a href="#" class="${optionDropdown}">${optionDropdown}</a>`
        })
    }
}

const clearInputModal = () => {
    document.querySelector("#title").value = "";
    document.querySelector("#content").value = "";
    document.querySelector("#status-task").value = "To Do";
    document.querySelector("#dueDate").value = "";
    document.querySelector("#priority-task").value = "Low";

}
