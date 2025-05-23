// This module will handle the eventListeners

import { 
    createNewTask, 
    deleteTask, 
    updateTask, 
    getSpecificTask, 
    fetchAllTasksToDisplay
} from './taskService.js'

import { 
    showModal, 
    closeModal, 
    clearInputModal 
} from './modal.js'

const userIdLocal = JSON.parse(localStorage.getItem("userDonezoid")).userId

export function setupEventListeners() {

    let currentEditId = null;

    // Closes the modal when pressing the X button
    document.querySelector(".button-close-modal").addEventListener('click', closeModal)

    // Only one eventListener for the submit/update button
    document.querySelector('.button-modal').addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = getTaskInputData();

            console.log(taskData)

            if(currentEditId) {
                await updateTask(taskData, currentEditId)
            } else {
                await createNewTask(taskData)
            } 

            clearInputModal()
            closeModal()
            await fetchAllTasksToDisplay()
        })

    // Handles any event listener
    document.addEventListener('click', async (event) => {
        const target = event.target;

        // Open modal for the submit thing
        if(target.classList.contains("adding-task-card")){
            currentEditId = null;
            showModal(false);
        }

        // Deleting a task
        if(target.classList.contains("delete-btn")){
            const taskId = target.dataset.id
            await deleteTask(taskId)
            await fetchAllTasksToDisplay()
        }       

        // Get a task populate
        if(target.classList.contains("btn-edit")) {
            const taskId = target.dataset.id
            const task = await getSpecificTask(taskId);
            currentEditId = taskId
            populateFormWithData(task); // populate the form with the data to be updated
            showModal(true)
        }

        // This is the main filtered chrono list
        if(target.classList.contains("all-tasks")) {
            fetchAllTasksToDisplay('all')
        }

        // This is the filteres for current today tasks
        if(target.classList.contains("today-tasks")) {
            fetchAllTasksToDisplay('today')
        }

        // This is the filteres for upcoming tasks (within next 3 days)
        if(target.classList.contains("upcoming-tasks")) {
            fetchAllTasksToDisplay('upcoming')
        }

        // This will filter for important tasks
        if(target.classList.contains("important-tasks")) {
            fetchAllTasksToDisplay('important')
        }

        // // For completed tasks
        if(target.classList.contains("completed-tasks")) {
            fetchAllTasksToDisplay('completed')
        }
    })
}

const getTaskInputData = () => {
    return {
        title : document.querySelector("#title").value,
        content : document.querySelector("#content").value,
        status : document.querySelector("#status-task").value,
        dueDate : document.querySelector("#dueDate").value,
        priority : document.querySelector("#priority-task").value,
        userId: userIdLocal
    }
}

const populateFormWithData = (task) => {
    document.querySelector("#title").value = task.title,
    document.querySelector("#content").value = task.content,
    document.querySelector("#status-task").value = task.status,
    document.querySelector("#dueDate").value = task.dueDate,
    document.querySelector("#priority-task").value = task.priority
}
