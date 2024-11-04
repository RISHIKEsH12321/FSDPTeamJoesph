//This file contains functions that are common in all my pages
function showTutorial(){
    const tutorialType = localStorage.getItem("tutorialType");
    console.log("start of function"+tutorialType);
    if(tutorialType == null || tutorialType =="null"){
        window.location.href = "tutorial.html";
    }else{
        document.getElementById("tutorial").innerText = "Tutorial";
        document.getElementById("hint").style.display = "none";
        localStorage.removeItem("tutorialType");
    }
    
}

function exit(){
    localStorage.clear();
    window.location.href="index.html";
}