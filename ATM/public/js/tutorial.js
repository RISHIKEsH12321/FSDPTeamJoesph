function closeTutorial(){
    window.location.href = "home.html";
}

function transferTutorial(){
    sessionStorage.setItem("tutorialType","transfer");
    window.location.href = "home.html";
}
function withdrawTutorial(){
    sessionStorage.setItem("tutorialType","withdraw");
    window.location.href = "home.html";
}
function depositTutorial(){
    sessionStorage.setItem("tutorialType","deposit");
    window.location.href = "home.html";
}

function exit(){
    sessionStorage.clear();
    window.location.href="index.html";
}