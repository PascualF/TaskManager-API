document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token")
    
    const linkConnection = 'http://localhost:3000'

    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`;
        return
    }
    fetch(`${linkConnection}/tasks`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("Response status:", response.status)
            console.log(localStorage)
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


    userInfoHeader()
})

const addTaskCard = (parentGrid) => {
    const addCard = document.createElement("li");
    addCard.classList.add("task-card")
    addCard.classList.add("adding-task-card")
    addCard.textContent = "➕ Add Task"
    parentGrid.appendChild(addCard)
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
            <h3>${task.title}</h3>
            <p class="task-desc">${task.content}</p>
            <p class="task-due">Due: ${readableDate || "No due date-"}</p>
            <div class="buttons-actions-card">
                <button class="btn-edit">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
            <span class="status-badge ${task.status}">${task.status}</span>
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