let isEditMode = false;
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
        document.querySelector('.button-modal').classList.remove('submit-button-new-task')
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

    document.addEventListener('click', async (event) =>{
        if(event.target.classList.contains('btn-edit')){
            const editButton = event.target;

            const taskItem = editButton.closest('.task-card')

            const taskId = taskItem.querySelector('h3').id

            getSpecificTask(taskId)

        }
    })

    document.addEventListener('click', async(event) => {
        if(event.target.classList.contains('btn-update')){
            console.log('can start updating')
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
            console.log('This is the printing')
            console.log(task)
            // Here showModal and populate with details
            showModal()
            document.querySelector("#title").value = task.title;
            document.querySelector("#content").value = task.content;
        }).catch(error => {
            console.error(`Error fetching tasks: ${error}`)
            alert("You must be logged in to view tasks");
            window.location.href = `login.html`;
        })

    } catch (error) {
        console.log(`Error getting task with id: ${taskId} => ${error}`)
    }
}

const updateTask = (taskData) => {
    try{
        console.log(taskData)

        /* const response = fetch(`${linkLocalhost}/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })

        if(!response.ok){
            throw new Error('Failed to update task.')
        } */
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
        buttonSubmitOrEdit.classList.add('update-button')
    } 
}

const closeModal = () => {
    const containerModal = document.querySelector(".container-modal");
    containerModal.classList.add("modal-hidden")
}

// Title / Description / Due Date / Edit and Delete buttons / Status Badge - Progress, Done, etc....
const displayTaskCards = (parentGrid, tasks) => {
    tasks.forEach((task) => {
        const liTaskItem = document.createElement("li");
        liTaskItem.classList.add("task-card")

        const dateFormatted = new Date(task.dueDate)
        const readableDate = dateFormatted.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

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
    document.querySelector("#dueDate").value = "";
}
