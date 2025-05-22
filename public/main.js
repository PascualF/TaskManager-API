import { fetchAllTasksToDisplay } from './taskService.js';
import { setupEventListeners } from './eventHandlers.js'

document.addEventListener("DOMContentLoaded", () => {
    
    // Fetch all the displays
    fetchAllTasksToDisplay()
    
    // Calls The event listeneners in the main entry page
    setupEventListeners()

    // Displays the info of the logged in user
    userInfoHeader()

    // Set minimum date on due date input.
    const dueDateInput = document.querySelector("#dueDate");
    const today = new Date().toISOString().split("T")[0]; // format to YYYY-MM-DD
    dueDateInput.min = today
})

const userInfoHeader = () => {
    const divDropdownMenu = document.querySelector(".dropdown-content")
    const userName = JSON.parse(localStorage.getItem("userDonezoid")).name
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
