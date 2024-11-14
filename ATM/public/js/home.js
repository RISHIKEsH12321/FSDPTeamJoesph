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

