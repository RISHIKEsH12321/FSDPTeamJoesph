
// Ensure the "complete" div is hidden on page load
window.onload=function(){
    document.getElementById('complete').style.cssText = "display: none !important";
    // Function to toggle visibility between "process" and "complete" divs
    setTimeout(function() {
        // Hide the "process" div and show the "complete" div
        document.getElementById('process').style.cssText = "display: none !important";
        document.getElementById('complete').style.display = 'flex';

        // Hide the "complete" div after 2 seconds
        setTimeout(function() {
            exit()
        }, 2000);
    }, 3000);
}

function exit(){
    sessionStorage.clear();
    window.location.href="index";
}