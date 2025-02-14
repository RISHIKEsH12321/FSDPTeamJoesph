let timeout;
let warningTimeout;
let countdown;
const warningTime = 10000; // Show warning after 10 sec of inactivity
const logoutTime = 20000; // Logout after 20 sec of inactivity
const countdownStart = 10; // Countdown from 5 seconds
let countdownValue = countdownStart;

function resetTimer() {
    clearTimeout(warningTimeout);
    clearTimeout(timeout);
    clearInterval(countdown);

    document.getElementById("timeout-warning").style.display = "none"; // Hide warning
    countdownValue = countdownStart; // Reset countdown text

    // Show warning and start countdown
    warningTimeout = setTimeout(() => {
        document.getElementById("timeout-warning").style.display = "block";
        startCountdown();
    }, warningTime);

    // Logout after timeout
    timeout = setTimeout(() => {
        window.location.href = "index.html"; // Redirect to logout page
    }, logoutTime);
}

function startCountdown() {
    document.getElementById("timeout-warning").innerText = `Session will expire in ${countdownValue} seconds...`;
    countdown = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
            document.getElementById("timeout-warning").innerText = `Session will expire in ${countdownValue} seconds...`;
        } else {
            clearInterval(countdown);
        }
    }, 1000);
}

// Detect user activity
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);
document.addEventListener("click", resetTimer);

resetTimer(); // Start the timer when the page loads
