const { link } = require("../routes/userRoute")

const token = localStorage.getItem("token")
const linkConnection = 'http://localhost:3000'


document.addEventListener("DOMContentLoaded", () => {
    if(!token) {
        alert("You must log in first.");
        window.location.href = `/login.html`;
        return 
    }

    fetch("/tasks", {
        method: "GET",
        header: {
            "Authorization": `Bearer ${token}`, // The token is sent here.
            "Content-Type": "application/json"
        }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error("Unauthorized")
            }
            return response.json()
        })
        .then((tasks) => {
            const listElement = document.getElementById("task-grid")
            tasks.forEach((task) => {
                const liItem = document.createElement("li");
                liItem.textContent = task.title;
                liItem.classList.add("task-card")
                listElement.appendChild(liItem)
            })

        })
        .catch(error => {
            console.error(`Error fetching tasks: ${error}`)
            alert("You must be logged in to view tasks");
            window.location.href = `/login.html`;
    })
})