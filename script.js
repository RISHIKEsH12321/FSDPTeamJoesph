
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
            content.innerText = "If your card is retained, it may be due to suspicious activity detected by the ATM, an expired card, or multiple incorrect PIN attempts. Please contact your bank for assistance or use the emergency feature if it is urgent.";
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
        case 'emergency':
            title.innerText = "Emergency Assistance";
            content.innerText = "[Future Feature]."; 
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
