const accountId = 4;
let accountData = []; //store data
let userID = 0;



document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch data

        
        userID = getUserIDFromLocalStorage();
        editGreeting(userID);

console.log(accountId);
        const accountRes = await fetch(`/home/${accountId}`);
        
        accountData = await accountRes.json();
        console.log(accountData);
        sessionStorage.setItem('name', accountData[0].name);
        sessionStorage.setItem('myAccNo', accountData[0].accountNumber);
        console.log(sessionStorage.getItem('name'));
        console.log(sessionStorage.getItem('myAccNo'));


    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
});


document.getElementById("moreService").style.cssText = "display: none !important";
document.getElementById("deposit").style.cssText = "display: none !important";
window.onload = function() {
    const tutorialType = sessionStorage.getItem("tutorialType");
    console.log(tutorialType);

    if(tutorialType == "transfer"){
        document.getElementById("tutorial").innerText = "Cancel Tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <div id="tHint">
            <dotlottie-player src="https://lottie.host/3348f5de-ddd5-4e7e-b178-884390a270fb/sVIIw5skUM.json" background="transparent" speed="2" style="width: 240px; height: 240px;" loop autoplay></dotlottie-player>
            <h4>Click on More services</h4>
        </div>`
    }
    else if(tutorialType == "withdraw"){
        document.getElementById("tutorial").innerText = "Cancel tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <div id="wHint">
            <dotlottie-player src="https://lottie.host/a8941040-8f8e-4289-b3a3-7097e111597c/buuzWAWsDB.json" background="transparent" speed="2" style="width: 240px; height: 240px;" loop autoplay></dotlottie-player>
            <h4>Select or put an amount to withdraw</h4>
        </div>` 
    }
    else if(tutorialType == "deposit"){
        document.getElementById("tutorial").innerText = "Cancel tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <div id="dHint">
            <dotlottie-player src="https://lottie.host/3348f5de-ddd5-4e7e-b178-884390a270fb/sVIIw5skUM.json" background="transparent" speed="2" style="width: 240px; height: 240px;" loop autoplay></dotlottie-player>
            <h4>Click on Deposit cash</h4>
        </div>`
    }
};

function showMoreService() {
    tutorialType = sessionStorage.getItem("tutorialType");
    console.log("start of function"+tutorialType);
    document.getElementById("home").style.cssText = "display: none !important";
    document.getElementById("moreService").style.display = "block";
    if(tutorialType == null){
        document.getElementById("home").style.cssText = "display: none !important";
        document.getElementById("moreService").style.display = "block";
    }
    else if(tutorialType == "transfer"){
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <div id="tHint">
            <dotlottie-player src="https://lottie.host/3348f5de-ddd5-4e7e-b178-884390a270fb/sVIIw5skUM.json" background="transparent" speed="2" style="width: 240px; height: 240px;" loop autoplay></dotlottie-player>
            <h4>Select transfer funds</h4>
        </div>` 
    }else{
        showTutorial()
    }

    tHint = document.getElementById("tHint")
    tHint.style.position = "absolute";
    tHint.style.top = "60%";
    tHint.style.left = "10%"; 
}

function moreDeposit(){
    event.preventDefault();
    document.getElementById("home").style.cssText = "display: none !important";
    document.getElementById("deposit").style.display = "block";
    document.getElementById("headerContainer2").style.cssText = "opacity:0";


    const wHint = document.getElementById("wHint");
    wHint.innerHTML=
    `
        <dotlottie-player src="https://lottie.host/a8941040-8f8e-4289-b3a3-7097e111597c/buuzWAWsDB.json" background="transparent" speed="2" style="width: 240px; height: 240px;" loop autoplay></dotlottie-player>
        <h4>Confirm amount to withdraw</h4>
    `
    wHint.style.left = "60%";
}

function gotoFundsTransfer(){
    window.location.href="transferFunds";
}

function gotoDeposit(){
    window.location.href="deposit";
}



function getUserIDFromLocalStorage() {    
    const userDetails = localStorage.getItem('userdetails');
    if (userDetails) {
        try {
            const user = JSON.parse(userDetails);
            return user.userID || null;
        } catch (error) {
            console.error("Error parsing user details from localStorage:", error);
            return null;
        }
    } else {
        console.warn("No user details found in localStorage.");
        return null;
    }
}

function editGreeting(userID){
    const greeting = document.getElementById("greeting");
    switch (userID) {
        case 1:
            greeting.innerText = "Hello Rishikesh!";
            break;
        case 2:
            greeting.innerText = "Hello Lily!";
            break;
        default:
            greeting.innerText = "Hello!";
            break;
    }
}

async function sendWithdrawNotification(amount){
    console.log("Amount withdrawed: " + amount);
    const emailResponse = await fetch(`/accountEmail/${accountId}`)
    if (!emailResponse.ok) {
        throw new Error("Network response was not ok");
    }
    let email = await emailResponse.json(); 
    try{
        await fetch('/withdrawalNotification',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.email,
                amount: amount
            })
        })
    }catch(error){
        console.error("Error sending email:", error);
    };
    window.location.href="processing"; //process
}

function addTypingIndicator() {
    const messages = document.getElementById('messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing';
    typingIndicator.textContent = '...typing';
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight; 
  }

// Function to add a message to the chat
function addMessage(content, isUser = false) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    messageDiv.textContent = content;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
  }
  
  // Event listener to toggle the chatbox visibility
  document.getElementById('chatbot-logo').addEventListener('click', () => {
    const chatbotWrapper = document.getElementById('chatbot-wrapper');
    // Toggle chatbox visibility
    const isHidden = chatbotWrapper.style.display = (chatbotWrapper.style.display === 'none' || chatbotWrapper.style.display === '')
    chatbotWrapper.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
        addMessage("Hello! Welcome to the virtual ATM assistant. I can help you for withdrawing money and translating lanaguage page.",false);
        addMessage("Simply type \"withdraw\" with the amount to withdraw.",false);
        addMessage("Simply type \"translate to\" with the lanaguage that you want.",false);
    }else{
        // If chatbot is being closed, clear all messages
        document.getElementById('messages').innerHTML = "";
    }
        
        

    
  });
 
  // Map language names to language codes
const languageMap = {
    "English": "EN",
    "Chinese": "ZH",
    "Spanish": "ES",
    "French": "FR",
    "German": "DE",
    "Russian": "RU",
    "Korean": "KO",
    // Add more languages if necessary
};
/*
  // Function to send a message
  async function sendMessage() {
    const chatInput = document.getElementById("chat-input");
    const userInput = chatInput.value.trim();

    if (!userInput) return;

    addMessage(userInput, true);
    chatInput.value = "";

    addTypingIndicator(); // Add typing indicator before the bot responds

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await response.json();
      const typingMessage = document.querySelector('.typing');
      if (typingMessage) typingMessage.remove(); // Remove the typing indicator
      addMessage(data.response, false);

      // Ensure the chat scrolls to the bottom after the message is added
      const messages = document.getElementById('messages');
      messages.scrollTop = messages.scrollHeight;

      // Check if the user's message is a translation request
      const match = userInput.toLowerCase().match(/translate to (\w+)/);
      if (match) {
          const languageName = match[1];
          const targetLang = languageMap[languageName.charAt(0).toUpperCase() + languageName.slice(1)];

          if (targetLang) {
              // Store the selected language in sessionStorage
              sessionStorage.setItem('selectedLang', targetLang);
              
              // Translate the page immediately
              const textElements = getTextElements(); // Get all text on the page
              translateText(textElements, targetLang); // Translate the page text

              // Optionally, you can add a message confirming the translation
              addMessage(`The page is being translated to ${languageName}.`, false);
          } else {
              addMessage("Sorry, I don't support that language yet.", false);
          }
      }

      // Check if the response contains a withdrawal confirmation
      if(data.response.includes("Withdrawing")|| data.response.includes("Dispensing")){
        //Get the amount varaible
        const withdrawMatch = userInput.match(/withdraw\s+\$?(\d+)/i);
        if (withdrawMatch) {
            const amount = withdrawMatch[1]; // Extracted amount
            console.log(`User wants to withdraw: $${amount}`);
            setTimeout(() => {
                withdraw(amount);
            }, 2500);
           
        }
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage("Sorry, something went wrong.", false);
    }
  }
*/
// Function to send a message
async function sendMessage() {
    const chatInput = document.getElementById("chat-input");
    const userInput = chatInput.value.trim();

    if (!userInput) return;

    addMessage(userInput, true);
    chatInput.value = "";

    addTypingIndicator(); // Add typing indicator before the bot responds

    try {
        // Check if the user is asking for nearest ATM
        if (containsATMKeywords(userInput)) {
            // Get the user's current location using geolocation API
            navigator.geolocation.getCurrentPosition(async function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("Lat" + lat + "Lon"+ lon);

                try {
                    // Fetch the nearest ATM information from the backend
                    const response = await fetch(`/nearest-atm?lat=${lat}&lon=${lon}`);
                    const data = await response.json();

                    // If a QR code is returned, show the QR code to the user
                    if (data.url) {
                        const typingMessage = document.querySelector('.typing');
                        if (typingMessage) typingMessage.remove(); // Remove typing indicator
                        addMessage("Here is the nearest ATM:", false);
                        const qrCodeImg = document.createElement('img');
                        qrCodeImg.src = data.url;
                        qrCodeImg.style.width = '150px'; // Set a size for the QR code
                        document.getElementById('messages').appendChild(qrCodeImg);

                        // Scroll to the bottom of the chat to show the QR code
                        const messages = document.getElementById('messages');
                        messages.scrollTop = messages.scrollHeight;
                    } else {
                        if (typingMessage) typingMessage.remove(); // Remove typing indicator
                        addMessage("Sorry, I couldn't find an ATM for that brand nearby.", false);
                    }
                } catch (error) {
                    console.error("Error:", error);
                    addMessage("Sorry, I couldn't retrieve the nearest ATM at this moment.", false);
                }
            });
        } else {
            // If it's not an ATM-related request, continue the normal chat process
            const response = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userInput }),
            });

            const data = await response.json();
            const typingMessage = document.querySelector('.typing');
            if (typingMessage) typingMessage.remove(); // Remove typing indicator
            addMessage(data.response, false);

            // Ensure the chat scrolls to the bottom after the message is added
            const messages = document.getElementById('messages');
            messages.scrollTop = messages.scrollHeight;

            // Translation logic (if user asks to translate)
            const match = userInput.toLowerCase().match(/translate to (\w+)/);
            if (match) {
                const languageName = match[1];
                const targetLang = languageMap[languageName.charAt(0).toUpperCase() + languageName.slice(1)];

                if (targetLang) {
                    // Store the selected language in sessionStorage
                    sessionStorage.setItem('selectedLang', targetLang);
                    
                    // Translate the page immediately
                    const textElements = getTextElements(); // Get all text on the page
                    translateText(textElements, targetLang); // Translate the page text

                    // Optionally, you can add a message confirming the translation
                    addMessage(`The page is being translated to ${languageName}.`, false);
                } else {
                    addMessage("Sorry, I don't support that language yet.", false);
                }
            }

            // Withdrawal logic (if user asks to withdraw)
            if (data.response.includes("Withdrawing") || data.response.includes("Dispensing")) {
                // Get the amount from the user's message
                const withdrawMatch = userInput.match(/withdraw\s+\$?(\d+)/i);
                if (withdrawMatch) {
                    const amount = withdrawMatch[1]; // Extracted amount
                    console.log(`User wants to withdraw: $${amount}`);
                    setTimeout(() => {
                        withdraw(amount);
                    }, 2500);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
        addMessage("Sorry, something went wrong.", false);
    }
}

// Function to check if the user's input contains ATM-related keywords
function containsATMKeywords(input) {
    const keywords = ["nearest atm", "find atm", "locate atm", "atm location", "atm nearby", "where is the nearest atm"];
    return keywords.some(keyword => input.toLowerCase().includes(keyword.toLowerCase()));
}

// Function to check if the user's input contains ATM-related keywords
function containsATMKeywords(input) {
    const keywords = ["nearest atm", "find atm", "locate atm", "atm location", "atm nearby", "where is the nearest atm"];
    return keywords.some(keyword => input.toLowerCase().includes(keyword.toLowerCase()));
}

// Event listeners for sending messages
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});



// Modified withdraw function
async function withdraw(amount) {
    
    const notes = calculateNotes(amount);

    console.log(`Dispensing ${notes[5]} $5 notes, ${notes[10]} $10 notes, ${notes[50]} $50 notes, ${notes[100]} $100 notes.`);

    // Call the backend to update ATM notes
    const success = await updateATMNotes(notes, atmId);

    if (success){
        // Redirect to processing page
        window.location.href = "/processing";
    }
}

const atmId = 1;

/**
 * Calls the backend to update the ATM notes after a withdrawal.
 * @param {Object} notes - An object containing the count of 5, 10, 50, and 100 dollar notes to withdraw.
 * @param {number} atmId - The ID of the ATM where the withdrawal is happening.
 */
async function updateATMNotes(notes, atmId) {
    try {
        const response = await fetch("/ATM-decrease", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                atmId,
                notes,
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log("ATM notes updated successfully.");
            // alert("Withdrawal successful!");
            return true;
        } else {
            console.error("Error updating ATM notes:", result.message);
            console.log(result.message)
            if (result.message === "Insufficient notes available in the ATM for the withdrawal.") {                
                // alert("Insufficient funds in the ATM for the requested withdrawal.");
                if (confirm("Insufficient funds. Select 'Ok' to find the nearest ATM?")) {
                    // findNearestATM(); // Runs if user clicks "OK"
                    document.getElementById("locator-modal-button").click();
                    console.log(123)
                    return;
                } 
                else {
                    console.log("User declined to find nearest ATM.");
                    return false;
                }

            } else {
                alert("Error updating ATM notes: " + result.message);
                return false;
            }
        }
    } catch (error) {
        console.error("Error connecting to ATM API:", error);
        alert("Error connecting to the server. Please try again later.");
        return false;
    }
}


function calculateNotes(amount) {
    const notes = { 5: 0, 10: 0, 50: 0, 100: 0 };
    const denominations = [100, 50, 10, 5];

    for (const denom of denominations) {
        notes[denom] = Math.floor(amount / denom);
        amount %= denom;
    }

    return notes;
}

