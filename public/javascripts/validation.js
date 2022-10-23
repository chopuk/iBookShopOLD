// client side validation

function validateRegistration() {

    const username = document.getElementById('username')
    const password = document.getElementById('password')
    const confirmpassword = document.getElementById('confirmpassword')
    const clientvalidationDiv = document.getElementById('clientvalidationDiv')
    const registrationForm = document.getElementById('registrationForm')

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
            newMessage = document.createElement('p')
            newMessageText = document.createTextNode(message)
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
    const profileForm = document.getElementById('profileForm')

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
            newMessage = document.createElement('p')
            newMessageText = document.createTextNode(message)
            newMessage.appendChild(newMessageText)
            newMessage.className = "m-0 p-0"
            clientvalidationDiv.insertBefore(newMessage,clientvalidationDiv.lastChild)
        })   

        clientvalidationDiv.classList.remove('hide')
    
    } else {
        profileForm.submit() 
    }

}



