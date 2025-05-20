// This module will handle the API calls only

const API = "https://donezoid.onrender.com";
const token = localStorage.getItem("tokenDonezoid")

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
    fetch(`${API}/tasks`, {
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