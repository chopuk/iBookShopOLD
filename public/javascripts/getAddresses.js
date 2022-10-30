const dropdown = document.getElementById("selectaddress")
const addressline1 = document.getElementById("addressline1")
const addressline2 = document.getElementById("addressline2")
const addressline3 = document.getElementById("addressline3")
const postcode = document.getElementById("postcode")

const mydropdown = document.getElementById("selectFilter")

// During the registration process, the user inputs a postcode.
// This javascript accesses a remote postcode API and returns
// any matching addresses found. The user will select the appropriate
// address and the form fields will be populated ready for submission.

async function getAddresses() {

    $('.addressDiv').fadeIn(2000)

    const options = {
        method: 'GET'
    }

    const enteredPostcode = document.getElementById("searchPostcode").value
    const postcodeURL = document.getElementById("postcodeURL").innerHTML
    
    const fetchString = `${postcodeURL}?postcode=${enteredPostcode}`

    const response = await fetch(fetchString, options)
    const data = await response.json()
    const addresses = data.result.hits
    dropdown.options.length = 0

    if (addresses.length  === 0 ) {
        const option = new Option("No Addresses Found - Please Input Manually",99)
        option.disabled = true
        option.selected = true
        dropdown.appendChild(option)
        toggleReadOnlyAttribute('')
    } else {   
        const option = new Option("Pick Address",99)
        option.disabled = true
        option.selected = true
        dropdown.appendChild(option)
    }

    addresses.forEach((address, index ) => {
        const option = new Option(address.suggestion,index)
        dropdown.appendChild(option)
    })

}

function updateAddress() {

    const selectedAddress = dropdown.options[dropdown.selectedIndex]
    const splitAddress = selectedAddress.text.split(',')

    addressline1.value = splitAddress[0].trim()
    addressline2.value = splitAddress[1].trim()
    addressline3.value = splitAddress[2].trim()
    postcode.value = splitAddress[3].trim()
    toggleReadOnlyAttribute('readonly')

}

function toggleReadOnlyAttribute(value) {

    if (value === 'readonly') {
        addressline1.setAttribute('readonly', 1)
        addressline2.setAttribute('readonly', 1)
        addressline3.setAttribute('readonly', 1)
        postcode.setAttribute('readonly', 1)
    } else {
        addressline1.removeAttribute('readonly')
        addressline2.removeAttribute('readonly')
        addressline3.removeAttribute('readonly')
        postcode.removeAttribute('readonly')
    }

}