const atmId = 1;
voiceActivated();

/**
 * Calls the backend to update the ATM notes after a withdrawal.
 * @param {Object} notes - An object containing the count of 5, 10, 50, and 100 dollar notes to withdraw.
 * @param {number} atmId - The ID of the ATM where the withdrawal is happening.
 */
async function updateATMNotes(notes, atmId) {
    try {
        const response = await fetch("/ATM-increase", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                atmId,
                notes,
            }),
        });

        if (response.ok) {
            console.log("ATM notes updated successfully.");
        } else {
            console.error("Failed to update ATM notes:", response.statusText);
            alert("Error updating ATM notes. Please try again.");
        }
    } catch (error) {
        console.error("Error connecting to ATM API:", error);
        alert("Error connecting to the server. Please try again later.");
    }
}

// Modified withdraw function
function withdraw(amount) {
    
    const notes = calculateNotes(amount);

    console.log(`Dispensing ${notes[5]} $5 notes, ${notes[10]} $10 notes, ${notes[50]} $50 notes, ${notes[100]} $100 notes.`);

    // Call the backend to update ATM notes
    updateATMNotes(notes, atmId);

    // Redirect to processing page
    window.location.href = "/processing";
}

// Modified withdrawSpecific function
function withdrawSpecific(event) {
    event.preventDefault();
    // let amount = 0;

    // const sessionAmt = sessionStorage.getItem('amount');
    // if (sessionAmt!= null){
    //     amount = Number(sessionAmt);
    //     sessionStorage.setItem('amount', null);
    // }else{
    //     amount = parseInt(document.getElementById("amt").value, 10);
    // }
    
    // const amount = parseInt(document.getElementById("amt").value, 10);

    // Validate amount is a multiple of 5
    if (amount % 5 !== 0) {
        alert("Please enter an amount that is a multiple of 5.");
        return;
    }

    const notes = calculateNotes(amount);

    console.log(`Dispensing ${notes[5]} $5 notes, ${notes[10]} $10 notes, ${notes[50]} $50 notes, ${notes[100]} $100 notes.`);

    // Call the backend to update ATM notes
    updateATMNotes(notes, atmId);

    // Redirect to processing page
    window.location.href = "/processing";
}

/**
 * Calculates the number of notes for a given amount.
 * @param {number} amount - The amount to withdraw.
 * @returns {Object} - An object with the count of 5, 10, 50, and 100 dollar notes.
 */
function calculateNotes(amount) {
    const notes = { 5: 0, 10: 0, 50: 0, 100: 0 };
    const denominations = [100, 50, 10, 5];

    for (const denom of denominations) {
        notes[denom] = Math.floor(amount / denom);
        amount %= denom;
    }

    return notes;
}


function voiceActivated(){
    let amount = 0;
    const sessionAmt = sessionStorage.getItem('amount');
    
    // Check if sessionAmt is null or an empty string
    if (sessionAmt === null || sessionAmt === '') { 
      // If null or empty, set amount to 0 and clear sessionStorage
      amount = 0;
      sessionStorage.removeItem('amount'); 
      return;
    } else {
      // If sessionAmt has a value, parse it to a number
      amount = Number(sessionAmt);
      // Clear sessionStorage after retrieving the value
      sessionStorage.removeItem('amount'); 
    }

    // Validate amount is a multiple of 5
    if (amount % 5 !== 0) {
        // alert("Please enter an amount that is a multiple of 5.");
        const noVoiceUtterance = new SpeechSynthesisUtterance("Please manually enter an amount that is a multiple of 5.");
        noVoiceUtterance.lang = 'en-US';
        window.speechSynthesis.speak(noVoiceUtterance);
        return;
    }

    const notes = calculateNotes(amount);

    console.log(`Dispensing ${notes[5]} $5 notes, ${notes[10]} $10 notes, ${notes[50]} $50 notes, ${notes[100]} $100 notes.`);

    // Call the backend to update ATM notes
    updateATMNotes(notes, atmId);

    // Redirect to processing page
    //window.location.href = "/processing";
}