
document.addEventListener("DOMContentLoaded", () => {
    fetch("/tasks")
        .then(response => response.json())
        .then((tasks) => {
            const listElement = document.getElementById("task-list")
            tasks.forEach((task) => {
                const liItem = document.createElement("li");
                liItem.textContent = task.title;
                liItem.classList.add("task-card")
                listElement.appendChild(liItem)
            })

        })
        .catch(error => console.error(`Error fetching tasks: ${error}`))
})