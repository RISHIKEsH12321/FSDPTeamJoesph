
function showHelp() {
    const helpPopup = document.getElementById("helpOptions");
    helpPopup.style.display = "block";
}

function toggleHelp() {
    const helpPopup = document.getElementById("helpOptions");
    helpPopup.style.display = "none";
}

function showDescription(option) {
    const detailedInfo = document.getElementById("detailedInfo");
    const title = document.getElementById("infoTitle");
    const content = document.getElementById("infoContent");

    switch(option) {
        case 'cardRetained':
            title.innerText = "Card Retained";
            content.innerText = "If your card is retained, it may be due to suspicious activity detected by the ATM, an expired card, or multiple incorrect PIN attempts. Please contact your bank for assistance.";
            break;
        case 'transactionFailed':
            title.innerText = "Transaction Failed";
            content.innerText = "Transaction failures can occur due to insufficient funds, system errors, or network issues. Verify your balance and try again or contact support.";
            break;
        case 'accountBalance':
            title.innerText = "Account Balance Issue";
            content.innerText = "If you notice an incorrect balance, it may take a few minutes for the ATM to refresh. If the problem persists, please contact customer support.";
            break;
        case 'incorrectPIN':
            title.innerText = "Incorrect PIN";
            content.innerText = "After three incorrect PIN entries, your card may be blocked for security reasons. Please contact us to reset it, unlock it through the OCBC Bank app, or visit one of our branches for help.";
            break;
        case 'technicalError':
            title.innerText = "Technical Error";
            content.innerText = "Technical errors can happen for various reasons. Try again after a few minutes, and if the issue continues, please reach out to support.";
            break;
        case 'cashNotDispensed':
            title.innerText = "Cash Not Dispensed";
            content.innerText = "If cash is not dispensed, it may be due to insufficient funds in the ATM, technical issues, or other factors. Please check your account balance and contact customer support if the problem persists.";
            break;
        default:
            title.innerText = ""; 
            content.innerText = ""; 
    }

    detailedInfo.style.display = "block"; 
}

function hideDetails() {
    const detailedInfo = document.getElementById("detailedInfo");
    detailedInfo.style.display = "none";
}

function openContactForm() {
    const contactFormModal = document.getElementById("contactFormModal");
    const timestampField = document.getElementById("timestamp");
    const contactForm = document.getElementById("contactForm");

    contactForm.reset();

    const currentDate = new Date();
    timestampField.value = currentDate.toLocaleString();

    contactFormModal.style.display = "block";
}

function closeContactForm() {
    const contactFormModal = document.getElementById("contactFormModal");
    contactFormModal.style.display = "none";
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:\+?\d{1,3}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}$/;
    return phoneRegex.test(phoneNumber);
}


function showHelp() {
    const helpPopup = document.getElementById("helpOptions");
    helpPopup.style.display = "block";
}

function toggleHelp() {
    const helpPopup = document.getElementById("helpOptions");
    helpPopup.style.display = "none";
}

function showDescription(option) {
    const detailedInfo = document.getElementById("detailedInfo");
    const title = document.getElementById("infoTitle");
    const content = document.getElementById("infoContent");

    switch(option) {
        case 'cardRetained':
            title.innerText = "Card Retained";
            content.innerText = "If your card is retained, it may be due to suspicious activity detected by the ATM, an expired card, or multiple incorrect PIN attempts. Please contact your bank for assistance.";
            break;
        case 'transactionFailed':
            title.innerText = "Transaction Failed";
            content.innerText = "Transaction failures can occur due to insufficient funds, system errors, or network issues. Verify your balance and try again or contact support.";
            break;
        case 'accountBalance':
            title.innerText = "Account Balance Issue";
            content.innerText = "If you notice an incorrect balance, it may take a few minutes for the ATM to refresh. If the problem persists, please contact customer support.";
            break;
        case 'incorrectPIN':
            title.innerText = "Incorrect PIN";
            content.innerText = "After three incorrect PIN entries, your card may be blocked for security reasons. Please contact us to reset it, unlock it through the OCBC Bank app, or visit one of our branches for help.";
            break;
        case 'technicalError':
            title.innerText = "Technical Error";
            content.innerText = "Technical errors can happen for various reasons. Try again after a few minutes, and if the issue continues, please reach out to support.";
            break;
        case 'cashNotDispensed':
            title.innerText = "Cash Not Dispensed";
            content.innerText = "If cash is not dispensed, it may be due to insufficient funds in the ATM, technical issues, or other factors. Please check your account balance and contact customer support if the problem persists.";
            break;
        default:
            title.innerText = ""; 
            content.innerText = ""; 
    }

    detailedInfo.style.display = "block"; 
}

function hideDetails() {
    const detailedInfo = document.getElementById("detailedInfo");
    detailedInfo.style.display = "none";
}

function openContactForm() {
    const contactFormModal = document.getElementById("contactFormModal");
    const timestampField = document.getElementById("timestamp");
    const contactForm = document.getElementById("contactForm");

    contactForm.reset();

    const currentDate = new Date();
    timestampField.value = currentDate.toLocaleString();

    contactFormModal.style.display = "block";
}

function closeContactForm() {
    const contactFormModal = document.getElementById("contactFormModal");
    contactFormModal.style.display = "none";
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:\+?\d{1,3}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}$/;
    return phoneRegex.test(phoneNumber);
}

// Handle form submission
document.getElementById("contactForm").onsubmit = function(e) {
    e.preventDefault();  // Prevent the default form submission

    const phoneNumber = document.getElementById("phoneNumber").value;
    const phoneError = document.getElementById("phoneError");

    phoneError.textContent = "";  // Reset error message

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
        phoneError.textContent = "Please enter a valid 10-digit phone number.";
        phoneError.style.color = "red";
        return;  // Stop form submission if the phone number is invalid
    }

    // Create the report object with form data
    const report = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phoneNumber: phoneNumber,
        problemDescription: document.getElementById("problemDescription").value,
        timestamp: document.getElementById("timestamp").value
    };

    // Send the data to the backend via a POST request
    fetch('http://localhost:3000/submit-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Display success message
        document.getElementById("contactForm").reset();  // Reset the form
        closeContactForm();  // Close the modal
    })
    .catch(error => {
        console.error('Error:', error);  // Log any errors
    });
};


