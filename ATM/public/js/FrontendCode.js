const radioButton1 = document.getElementById("radio1");
const radioButton2 = document.getElementById("radio2");
const continueButton = document.getElementById("continue");
const display = document.getElementById('display');
const keys = document.querySelectorAll('.key');
const continueButton2 = document.getElementById("Continue");
const withdraw = document.getElementById("WithdrawDiv");
const deposit = document.getElementById("DepoDiv");
let enteredAmount = "";
const userId = "12345";
const WithdrawContButton = document.getElementById("Continue2");

if (withdraw != null) {
    withdraw.addEventListener("click", () => {
        radioButton1.checked = true;
        localStorage.setItem("transactionType", radioButton1.value);
    });
}

if (deposit != null) {
    deposit.addEventListener("click", () => {
        radioButton2.checked = true;
        localStorage.setItem("transactionType", radioButton2.value);
    });
}

if (continueButton != null) {
    continueButton.addEventListener("click", function (event) {

        event.preventDefault();

        if (radioButton1.checked) {
            window.location.href = "/Withdraw.html";
        }
        else if (radioButton2.checked) {
            window.location.href = "/Deposit.html";
        }
    });
}

if (WithdrawContButton != null) {
    WithdrawContButton.addEventListener("click", function (event) {
        window.location.href = "/ChooseNote.html"
    })
}

if (keys != null) {
    display.value = "$";

    keys.forEach((key) => {
        key.addEventListener("click", function () {
            const value = this.getAttribute("data-value");

            if (this.id === "delete") {
                if (enteredAmount.length > 0) {
                    enteredAmount = enteredAmount.slice(0, -1); // Remove last digit
                    display.value = "$" + enteredAmount;
                }
            } else {
                enteredAmount += value; // Add the pressed key's value to enteredAmount
                display.value = "$" + enteredAmount;
            }
        });
    });
}

// Add event listener for the "Continue" button from ChooseNote page
if (continueButton) {
    continueButton.addEventListener("click", function () {
        const amount = enteredAmount || "0";
        const transactionType = localStorage.getItem("transactionType");

        console.log(`Amount: $${amount}`);
        console.log(`Transaction Type: ${transactionType}`);

        // Send request to initiate 2FA (send OTP)
        fetch("/api/initiate2fa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: "12345", // Replace with the actual user ID dynamically
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // Notify user that OTP is sent

                // Prompt for OTP after initiating 2FA
                const userOtp = prompt("Enter the OTP sent to your email:");

                if (userOtp) {
                    // Send the OTP to the backend for verification
                    fetch("/api/verifyOtp", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: "user-email@example.com", // Dynamically set to the user's email
                            otp: userOtp,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                alert("OTP verified successfully! Redirecting...");
                                window.location.href = "/Home.html"; // Redirect after successful OTP verification
                            } else {
                                alert(data.message); // Show OTP verification failure message
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                            alert("An error occurred while verifying OTP");
                        });
                } else {
                    alert("OTP input cancelled.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while initiating 2FA");
            });

        display.value = "$";
        enteredAmount = ""; // Reset the entered amount
    });
}
