document.addEventListener("DOMContentLoaded", () => {
    
    fetchAllTasksToDisplay()
    
    // Displays the info of the logged in user
    userInfoHeader()

    // Closes the modal when pressing the X button in the modal
    const closeModalButton = document.querySelector(".button-close-modal")
    closeModalButton.addEventListener('click', () => {
        closeModal()
    })

    // This will send the data to the backend
    const submitCreateTaskButton = document.querySelector(".submit-button-new-task")
    submitCreateTaskButton.addEventListener('click', (event) => {
        event.preventDefault()

        const taskData = {
            title : document.querySelector("#title").value,
            content : document.querySelector("#content").value,
            status : document.querySelector("#status-task").value,
            dueDate : document.querySelector("#dueDate").value,
            priority : document.querySelector("#priority-task").value
        }

        createNewTask(taskData)
        document.querySelector('#task-grid').innerHTML = ''
        fetchAllTasksToDisplay()
        closeModal()
    })

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

    // Set minimum date on due date input.
    const dueDateInput = document.querySelector("#dueDate");
    const today = new Date().toISOString().split("T")[0]; // format to YYYY-MM-DD
    dueDateInput.min = today
})

const fetchAllTasksToDisplay = () => {
    const token = localStorage.getItem("token")
    
    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`;
        return
    }

    fetch(`http://localhost:3000/tasks`, {
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

const addTaskCard = (parentGrid) => {
    const addCard = document.createElement("li");
    addCard.classList.add("task-card")
    addCard.classList.add("adding-task-card")
    addCard.textContent = "➕ Add Task"

    addCard.addEventListener('click', showModal)

    parentGrid.appendChild(addCard)
}

const showModal = () => {
    const containerModal = document.querySelector(".container-modal");
    containerModal.classList.remove("modal-hidden")
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
        const dateFormatted = new Date(task.dueDate.slice(0,10))
        const readableDate = dateFormatted.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        console.log(readableDate)
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

const createNewTask = async (taskData) => {
    const token = localStorage.getItem("token");

    try{
        console.log(taskData)
        const response = await fetch('http://localhost:3000/tasks', {
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
    const token = localStorage.getItem("token");



    try{
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        console.log(`Error deleting task with id:${taskId} => ${error}`)
    }
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
