// This will handle every opening; closing and resetting of the modal.

const containerModal = document.querySelector(".container-modal");
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector("#content")
const statusInput = document.querySelector("#status-task")
const dueDateInput = document.querySelector("#dueDate")
const priorityInput = document.querySelector("#priority-task")

export const showModal = (isEditMode) => {

    containerModal.classList.remove("modal-hidden")
    
    titleInput.focus()

    const buttonSubmitOrEdit = document.querySelector(".button-modal")
    
    if(!isEditMode){
        buttonSubmitOrEdit.innerHTML = 'Submit Task'
    } else {
        buttonSubmitOrEdit.innerHTML = 'Update Task'
    }
}

export const closeModal = () => {
    containerModal.classList.add("modal-hidden")
}

export const clearInputModal = () => {
    titleInput.value = "";
    contentInput.value = "";
    statusInput.value = "To Do";
    dueDateInput.value = "";
    priorityInput.value = "Low";
}