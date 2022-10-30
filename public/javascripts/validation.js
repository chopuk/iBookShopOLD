// Client side validation to improve user experience
// and prevent unnecessary trips to the server

// Of course, the server side will perform the same validations for security reasons

function validateRegistration() {

    const username = document.getElementById('username')
    const password = document.getElementById('password')
    const confirmpassword = document.getElementById('confirmpassword')
    const clientvalidationDiv = document.getElementById('clientvalidationDiv')
    const registrationForm = document.getElementById('register-form')

    registrationForm.addEventListener('focus', () => {
        document.activeElement.classList.remove('invalid')
    }, true)

    const messages = []
    
    if ( username.value.length < 6 ) {
        messages.push('Username must be at least 6 characters')
        username.classList.add('invalid')
    } 

    if ( password.value !== confirmpassword.value) {
        messages.push('Passwords must match')
        password.classList.add('invalid')
        confirmpassword.classList.add('invalid')
    } 
    
    if (messages.length > 0) {

        messages.forEach ( message => {
            const newMessage = document.createElement('p')
            const newMessageText = document.createTextNode(message)
            newMessage.appendChild(newMessageText)
            newMessage.className = "m-0 p-0"
            clientvalidationDiv.insertBefore(newMessage,clientvalidationDiv.lastChild)
        })   

        clientvalidationDiv.classList.remove('hide')
    
    } else {
        registrationForm.submit() 
    }

}

function validateProfile() {
 
    const password = document.getElementById('password')
    const confirmpassword = document.getElementById('confirmpassword')
    const clientvalidationDiv = document.getElementById('clientvalidationDiv')
    const profileForm = document.getElementById('profile-form')

    profileForm.addEventListener('focus', () => {
        document.activeElement.classList.remove('invalid')
    }, true)

    const messages = []

    if (password.value.length > 0) {
        if ( password.value !== confirmpassword.value) {
            messages.push('Passwords must match')
            password.classList.add('invalid')
            confirmpassword.classList.add('invalid')
        }
    }
    
    if (messages.length > 0) {

        messages.forEach ( message => {
            const newMessage = document.createElement('p')
            const newMessageText = document.createTextNode(message)
            newMessage.appendChild(newMessageText)
            newMessage.className = "m-0 p-0"
            clientvalidationDiv.insertBefore(newMessage,clientvalidationDiv.lastChild)
        })   

        clientvalidationDiv.classList.remove('hide')

    } else {
        profileForm.submit() 
    }

}



