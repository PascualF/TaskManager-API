document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token")
    const linkConnection = 'http://localhost:3000'

    console.log("Token from localStorage:", token); // Debugging line

    if(!token) {
        console.log('No token found, redirecting to login');
        alert("You must log in first.");
        window.location.href = `login.html`;
        return
    }

    // Debug the headers being sent
    console.log("Authorization header being sent:", `Bearer ${token}`);

    fetch(`${linkConnection}/tasks`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("Response status: ", response.status)
            if(!response.ok) {
                throw new Error(`Unauthorized: ${response.status}`)
            }
            return response.json()
        })
        .then((tasks) => {
            const listElement = document.getElementById("task-grid")
            
            tasks.forEach((task) => {
                console.log(task)
                const liItem = document.createElement("li");
                liItem.textContent = task.title;
                liItem.classList.add("task-card")
                listElement.appendChild(liItem)
            })

        })
        .catch(error => {
            console.error(`Error fetching tasks: ${error}`)
            alert("You must be logged in to view tasks");
            window.location.href = `login.html`;
    })
})