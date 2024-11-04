const tutorialType = localStorage.getItem("tutorialType");
console.log(tutorialType);
window.onload = function() {
    const tutorialType = localStorage.getItem("tutorialType");
    if(tutorialType == "transfer"){
        document.getElementById("tutorial").innerText = "Cancel Tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/829a7c71-6811-40dd-903b-e7d3bb4a7f95/YuxzimIdBK.json" background="transparent" speed="2" style="width: 160px; height: 160px;" loop autoplay></dotlottie-player>
        <h4>Select an Account</h4>`
    }
    else{
        document.getElementById("tutorial").innerText = "Tutorial";
    }
    document.getElementById("page2").style.cssText = "display: none !important";
    document.getElementById("page3").style.cssText = "display: none !important";
}

function page2(){
    document.getElementById("title").textContent = "Bank transfer to"
    document.getElementById("page1").style.cssText = "display: none !important";
    document.getElementById("page2").style.cssText = "display: block !important";
    if(tutorialType == "transfer"){
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/829a7c71-6811-40dd-903b-e7d3bb4a7f95/YuxzimIdBK.json" background="transparent" speed="2" style="width: 160px; height: 160px;" loop autoplay></dotlottie-player>
        <h4>Enter account number and amount of money to transfer</h4>`
    }
}

function page3(){
    event.preventDefault();
    document.getElementById("title").textContent = "Transfer confirmation"
    document.getElementById("page2").style.cssText = "display: none !important";
    document.getElementById("page3").style.cssText = "display: block !important";
    if(tutorialType == "transfer"){
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/829a7c71-6811-40dd-903b-e7d3bb4a7f95/YuxzimIdBK.json" background="transparent" speed="2" style="width: 160px; height: 160px;" loop autoplay></dotlottie-player>
        <h4>Check details are correct before confirming</h4>`
    }
}

function exit(){
    localStorage.clear();
    window.location.href="index.html";
}