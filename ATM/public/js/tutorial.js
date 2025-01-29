voiceActivated();

function closeTutorial(){
    window.location.href = "home";
}

function transferTutorial(){
    sessionStorage.setItem("tutorialType","transfer");
    window.location.href = "home";
}
function withdrawTutorial(){
    sessionStorage.setItem("tutorialType","withdraw");
    window.location.href = "home";
}
function depositTutorial(){
    sessionStorage.setItem("tutorialType","deposit");
    window.location.href = "home";
}

function exit(){
    sessionStorage.clear();
    window.location.href="index";
}


function voiceActivated(){    
    const tutorialType = sessionStorage.getItem('typeForTutorial');
    console.log(tutorialType)
    const transferBtn = document.getElementById("transferBtn");
    const withdrawBtn = document.getElementById("withdrawBtn");
    const depositBtn = document.getElementById("depositBtn");

    // Check if sessionAmt is null or an empty string
    if (tutorialType === null || tutorialType === '') { 
      // If null or empty, clear sessionStorage
      sessionStorage.removeItem('typeForTutorial'); 
      return;
    } else {     
      sessionStorage.removeItem('typeForTutorial'); 
    }

    switch (tutorialType){
        case "Cash Transfer":
            transferBtn.click();
            break;

        case "Cash Withdraw":
            withdrawBtn.click();
            break;

        case "Cash Deposit":
            depositBtn.click();
            break;
    }


}