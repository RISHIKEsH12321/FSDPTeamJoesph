//This file contains functions that are common in all my pages
function showTutorial(){
    const tutorialType = sessionStorage.getItem("tutorialType");
    console.log("start of function"+tutorialType);
    if(tutorialType == null || tutorialType =="null"){
        window.location.href = "tutorial.html";
    }else{
        document.getElementById("tutorial").innerText = "Tutorial";
        document.getElementById("hint").style.display = "none";
        sessionStorage.removeItem("tutorialType");
    }
    
}

function exit(){
    sessionStorage.clear();
    window.location.href="index.html";
}
