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