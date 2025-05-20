const registerFormElement = document.querySelector("#register-form");
const loginFormElement = document.querySelector("#login-form");
const linkConnection = 'https://donezoid.onrender.com'

if(registerFormElement) {
    registerFormElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent automatic refresh

    // Gets the value of each input when submitting
    const registerFormData = {
        name : document.querySelector("#name").value,
        email : document.querySelector("#email").value,
        password : document.querySelector("#password").value
    }

    try {
        // Sending to the backend. to register new user, including the header for token checking.
        const response = await fetch(`${linkConnection}/users/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerFormData)
        })
        const result = await response.json()
        if(response.ok) {
            localStorage.setItem("tokenDonezoid", result.token)
            localStorage.setItem("userDonezoid", JSON.stringify(result.user))
            alert("Registered successfully!")
            window.location.href = `/app.html`
        } else {
            alert(result.msg || "Something went wrong")
        }
    } catch (error){
        console.log(error);
        alert("Error connecting to server")
    }
})
}

if(loginFormElement) {
    loginFormElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginFormData = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value
        }

        try{
            const response = await fetch(`${linkConnection}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginFormData)
            })

            const result = await response.json()
            console.log(result.user)
            if(response.ok) {
                localStorage.setItem("tokenDonezoid", result.token)
                localStorage.setItem("userDonezoid", JSON.stringify(result.user))
                /* localStorage.setItem("user", JSON.stringify(result.user)) */
                alert("Login successfully!")
                window.location.href = `app.html`
            } else {
                alert(result.msg || "Something went wrong")
            }
        } catch (error) {
            console.log(error);
            alert("Error login in")
        }  
    })
}
