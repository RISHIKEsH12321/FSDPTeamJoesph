const tutorialType = sessionStorage.getItem("tutorialType");
console.log(tutorialType);
window.onload = function() {
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
    if(tutorialType == "deposit"){
        const hintDiv = document.getElementById("hint2");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/829a7c71-6811-40dd-903b-e7d3bb4a7f95/YuxzimIdBK.json" background="transparent" speed="2" style="width: 160px; height: 160px;" loop autoplay></dotlottie-player>
        <h4>Check details are correct before confirming</h4>`
    }
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