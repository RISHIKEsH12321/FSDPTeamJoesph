const tutorialType = sessionStorage.getItem("tutorialType");
console.log(tutorialType);
window.onload = function() {
    const tutorialType = sessionStorage.getItem("tutorialType");
    if(tutorialType == "transfer"){
        document.getElementById("tutorial").innerText = "Cancel Tutorial";
        const hintDiv = document.getElementById("hint");
        hintDiv.innerHTML=`
        <dotlottie-player src="https://lottie.host/3348f5de-ddd5-4e7e-b178-884390a270fb/sVIIw5skUM.json" background="transparent" speed="2" style="width: 240px; height: 240px; margin: 0px auto;" loop autoplay></dotlottie-player>
        <h4 style="text-align: center;">Select an Account</h4>`
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
    sessionStorage.clear();
    window.location.href="index";
}


const transferForm = document.getElementById("transferSubmit");
transferForm.addEventListener("click",async()=>{
    //Add function to update text and sql database
    const accNo = document.getElementById("AccountNo").value;
    const amount = document.getElementById("amt").value;
    console.log(accNo + "," + amount);
    try {
        const response = await fetch(`/transferFunds/${accNo}`);
        const result = await response.json();

        document.getElementById("name").textContent = sessionStorage.getItem("name");
        document.getElementById("myAccNo").textContent = sessionStorage.getItem("myAccNo");
        document.getElementById("toName").textContent = result[0].name;
        document.getElementById("toAccNo").textContent = result[0].accountNumber;
        document.getElementById("amount").textContent = amount;
    }catch (error) {
        console.error('Error fetching posts:', error);
    }

});
