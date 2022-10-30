// The cart has a 'remove item' option for each item in the cart.
// Initially a confirmation dialog ( modal ) will be displayed.
// This javascript will get the correct bookId to be deleted
// and change the button acton to include this in the string.

const removeItemModel = document.getElementById('removeItemModel')

if (removeItemModel) {

    removeItemModel.addEventListener('show.bs.modal', event => {

        // button that triggered the modal
        const button = event.relatedTarget
        // Extract the book id from the data attribute
        const bookId = button.getAttribute('data-bs-item')
        // compose the form action string
        const action = '/cart/removeItem/' + bookId
        // update the from action in the document
        document.getElementById("removeItemForm").action = action

    })
}
