function closeTutorial(){
    window.location.href = "home.html";
}

function transferTutorial(){
    localStorage.setItem("tutorialType","transfer");
    window.location.href = "home.html";
}
function withdrawTutorial(){
    localStorage.setItem("tutorialType","withdraw");
    window.location.href = "home.html";
}
function depositTutorial(){
    localStorage.setItem("tutorialType","deposit");
    window.location.href = "home.html";
}

function exit(){
    localStorage.clear();
    window.location.href="index.html";
}