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

export function setupEventListeners() {

    let currentEditId = null;

    // Closes the modal when pressing the X button
    document.querySelector(".button-close-modal").addEventListener('click', closeModal)

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

        // Get a task and update // Edit task
        if(target.classList.contains("btn-edit")) {
            const taskId = target.dataset.id
            const task = await getSpecificTask(taskId);
            currentEditId = taskId
            populateFormWithData(task); // populate the form with the data to be updated
            showModal(true)
        }  
        
        document.querySelector('.button-modal').addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = getTaskInputData();

            if(currentEditId) {
                await updateTask(taskData, currentEditId)
            } else {
                await createNewTask(taskData)
            } 

            clearInputModal()
            closeModal()
            await fetchAllTasksToDisplay()
        })
        
    })
}

const getTaskInputData = () => {
    return {
        title : document.querySelector("#title").value,
        content : document.querySelector("#content").value,
        status : document.querySelector("#status-task").value,
        dueDate : document.querySelector("#dueDate").value,
        priority : document.querySelector("#priority-task").value
    }
}

const populateFormWithData = (task) => {
        document.querySelector("#title").value = task.title,
        document.querySelector("#content").value = task.content,
        document.querySelector("#status-task").value = task.status,
        document.querySelector("#dueDate").value = task.dueDate,
        document.querySelector("#priority-task").value = task.priority
}
