const atmId = 1;
//Get The Elements that display the number of notes
const denom5 = document.getElementById("denom5");
const denom10 = document.getElementById("denom10");
const denom50 = document.getElementById("denom50");
const denom100 = document.getElementById("denom100");
const totalAmt = document.getElementById("totalAmt");

//Get the elements for the account type
const currentAccountBtn = document.getElementById("currentAccountBtn");
const savingsAccountBtn = document.getElementById("savingsAccountBtn");
const accoun360Btn = document.getElementById("accoun360Btn");

const tutorialType = sessionStorage.getItem("tutorialType");
console.log(tutorialType);


window.onload = function() {
    voiceActivated();

    const tutorialType = sessionStorage.getItem("tutorialType");
    if(tutorialType == "deposit"){
        document.getElementById("tutorial").innerText = "Cancel Tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/3348f5de-ddd5-4e7e-b178-884390a270fb/sVIIw5skUM.json" background="transparent" speed="2" style="width: 240px; height: 240px; margin: 0px auto;" loop autoplay></dotlottie-player>
        <h4>Select an Account</h4>`
    }
    else{
        document.getElementById("tutorial").innerText = "Tutorial";
    }
    document.getElementById("page2").style.cssText = "display: none !important";
    document.getElementById("page3").style.cssText = "display: none !important";
}

function page2(){  
    document.getElementById("title").textContent = ""
    document.getElementById("page1").style.cssText = "display: none !important";
    document.getElementById("page2").style.cssText = "display: block !important";    
    if(tutorialType == "deposit"){
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=``
    }
}

function page3(){
    event.preventDefault();
    document.getElementById("title").textContent = "Deposit confirmation"
    document.getElementById("page2").style.cssText = "display: none !important";
    document.getElementById("page3").style.cssText = "display: block !important";
    document.getElementById("name").textContent = sessionStorage.getItem("name");
    document.getElementById("myAccNo").textContent = sessionStorage.getItem("myAccNo");
    if(tutorialType == "deposit"){
        const hintDiv = document.getElementById("hint2");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/829a7c71-6811-40dd-903b-e7d3bb4a7f95/YuxzimIdBK.json" background="transparent" speed="2" style="width: 160px; height: 160px;" loop autoplay></dotlottie-player>
        <h4>Check details are correct before confirming</h4>`
    }

    assignRandomNotes();
}

function exit(){
    sessionStorage.clear();
    window.location.href="index";
}

function showTutorial(){
    const tutorialType = sessionStorage.getItem("tutorialType");
    console.log("start of function"+tutorialType);
    if(tutorialType == null || tutorialType =="null"){
        window.location.href = "tutorial";
    }else{
        document.getElementById("tutorial").innerText = "Tutorial";
        document.getElementById("hint").style.display = "none";
        document.getElementById("hint2").style.display = "none";
        sessionStorage.removeItem("tutorialType");
    }
    
}


//Rishi's Code to Reduce the notes from the ATM
function assignRandomNotes(){
    //Get a random number of each note denomination
    const notes = 
    { 
        5: Math.floor(Math.random() * 21), 
        10: Math.floor(Math.random() * 16), 
        50: Math.floor(Math.random() * 11), 
        100: Math.floor(Math.random() * 6) 
    };

    denom5.textContent = "$5: " + notes[5] + " notes";
    denom10.textContent = "$10: " + notes[10] + " notes";
    denom50.textContent = "$50: " + notes[50] + " notes";
    denom100.textContent = "$100: " + notes[100] + " notes";

    totalAmt.textContent = "Total amount: $" + (5*notes[5] + 10*notes[10] + 50*notes[50] + 100*notes[100]);
    totalAmt.dataset.denom5 = notes[5];
    totalAmt.dataset.denom10 = notes[10];
    totalAmt.dataset.denom50 = notes[50];
    totalAmt.dataset.denom100 = notes[100];    
}

async function deposit(){
    //Gets num of notes from totalAmt element's dataset
    const notes = 
    { 
        5: totalAmt.dataset.denom5, 
        10: totalAmt.dataset.denom10, 
        50: totalAmt.dataset.denom50, 
        100: totalAmt.dataset.denom100 
    };

    const success = await updateATMNotes(notes, atmId);

    if(success){
        window.location.href = "/processing";
    }

}

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

        const result = await response.json();

        if (response.ok && result.success) {
            console.log("ATM notes updated successfully.");            
            return true;
        } else {
            console.error("Error updating ATM notes:", result.message);
            if (confirm("Error Depositing. Select 'Ok' to find the nearest ATM to try?")) {
                findNearestATM(); // Runs if user clicks "OK"
                return;
            } 
            else {
                console.log("User declined to find nearest ATM.");
                return false;
            }
        }
    } catch (error) {
        console.error("Error connecting to ATM API:", error);
        alert("Error connecting to the server. Please try again later.");
        return false;
    }
}


async function voiceActivated(){    
    const typeOfAccount = sessionStorage.getItem('typeOfAccount');
    
    // Check if sessionAmt is null or an empty string
    if (typeOfAccount === null || typeOfAccount === '') { 
      // If null or empty, clear sessionStorage
      sessionStorage.removeItem('typeOfAccount'); 
      return;
    } else {
      // Clear sessionStorage after retrieving the value
      sessionStorage.removeItem('typeOfAccount'); 
    }

    console.log(typeOfAccount);
    // Ensure the elements are available before clicking
    setTimeout(() => {
        switch (typeOfAccount) {
            case "Current Account":
                currentAccountBtn.click();
                break;
            case "Savings Account":
                savingsAccountBtn.click();
                break;
            case "360 Account":
                accoun360Btn.click();
                break;
        }
    }, 100); // Small delay to ensure DOM is ready
}