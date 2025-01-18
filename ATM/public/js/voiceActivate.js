/*
const toggle_conversion = document.getElementById("toggle_conversion"); // Single button
const convert_text = document.getElementById("convert_text");

const openPopupButton = document.getElementById('open-popup');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popup-overlay');
const startRecordingButton = document.getElementById('start-recording');

openPopupButton.addEventListener('click', () => {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
});

popupOverlay.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});

startRecordingButton.addEventListener('click', () => {
    console.log('Start recording functionality triggered!');
    // Add your recording logic here
});

let speech = false; // Control flag
let recognition;
let finalTranscript = ''; // Store the final transcript

toggle_conversion.addEventListener('click', function() {
    if (!speech) {
        // Start speech recognition
        speech = true;
        toggle_conversion.textContent = "Stop Conversion"; // Update button text
        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.interimResults = true;
        //recognition.continuous = true; // Keep listening even during pauses

        finalTranscript = ''; // Reset the transcript

        recognition.addEventListener('result', (e) => {
            const interimTranscript = Array.from(e.results)
                .map(result => result[0].transcript)
                .join('');

            convert_text.innerHTML = finalTranscript + interimTranscript;

            if (e.results[0].isFinal) {
                finalTranscript += interimTranscript + ' ';
            }
        });

        recognition.addEventListener('end', () => {
            if (speech) {
                recognition.start(); // Restart automatically during speech mode
            }
        });

        recognition.start();
    } else {
        // Stop speech recognition
        speech = false;
        toggle_conversion.textContent = "Start Conversion"; // Update button text
        if (recognition) {
            recognition.stop(); // Stop recognition if active
        }

        // Send the final transcript to the server
        if (finalTranscript.trim()) {
            fetch('/voice-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: finalTranscript.trim() }),
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Server Response:", result);
                })
                .catch(error => {
                    console.error("Error sending voice input:", error);
                });
        }
    }
});
*/


/*
startRecordingButton.addEventListener('click', () => {
    if (!speech) {
        // Start speech recognition
        speech = true;
        isRecording = true; // Set recording state
        startRecordingButton.innerHTML = stopSVG; // Change to stop icon
        console.log("Recording started...");
        //speakText("Please Start.");

        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.interimResults = true;

        finalTranscript = ''; // Reset the transcript

        recognition.addEventListener('result', (e) => {
            const interimTranscript = Array.from(e.results)
                .map(result => result[0].transcript)
                .join('');

            // convert_text.innerHTML = finalTranscript + interimTranscript;

            if (e.results[0].isFinal) {
                finalTranscript += interimTranscript + ' ';
            }
        });

        recognition.addEventListener('end', () => {
            if (speech) {
                recognition.start(); // Restart automatically during speech mode
            }
        });

        recognition.start();
    } else {
        // Stop speech recognition
        speech = false;
        isRecording = false; // Clear recording state
        startRecordingButton.innerHTML = startSVG; // Change to start icon
        console.log("Recording stopped...");
        console.log(finalTranscript.trim())
        if (recognition) {
            recognition.stop(); // Stop recognition if active
        }

        // Send the final transcript to the server
        if (finalTranscript.trim()) {
            fetch('/voice-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: finalTranscript.trim() }),
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Server Response:", result);
                })
                .catch(error => {
                    console.error("Error sending voice input:", error);
                });
        }
    }
});

function speakText(text) {
    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text); // Create an utterance
        utterance.lang = 'en-US'; // Set the language (change as needed)
        utterance.rate = 1; // Set the speaking rate (1 is normal speed)
        utterance.pitch = 1; // Set the pitch (1 is normal pitch)
        utterance.volume = 1; // Set the volume (0 to 1)
        
        // Speak the text
        window.speechSynthesis.speak(utterance);

        // Optional: Handle events
        utterance.onstart = () => console.log("Speech started");
        utterance.onend = () => console.log("Speech ended");
        utterance.onerror = (event) => console.error("Speech error:", event.error);
    } else {
        console.error("Text-to-Speech not supported in this browser.");
    }
}
*/

const toggle_conversion = document.getElementById("toggle_conversion"); // Single button
const convert_text = document.getElementById("convert_text");

const openPopupButton = document.getElementById('open-popup');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popup-overlay');
const startRecordingButton = document.getElementById('start-recording');

let speech = false; // Control flag for text conversion
let isRecording = false; // State to track recording
let recognition;
let finalTranscript = ''; // Store the final transcript

const startSVG = `
  <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
    <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"/>
    <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"/>
  </svg>`;

const stopSVG = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" 
      stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

openPopupButton.addEventListener('click', () => {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
});

popupOverlay.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});


startRecordingButton.addEventListener('click', () => {
    if (!speech && !isRecording) {
        // Start speech recognition only after speaking the text
        isRecording = true;
        console.log("Speaking before starting recording...");

        // Speak the text first
        //speakText("Please start speaking.");

        // Wait for speakText to finish before starting recording
        const utterance = new SpeechSynthesisUtterance("Please start speaking.");
        utterance.lang = 'en-US';
        utterance.onend = () => {
            console.log("Speech finished. Starting recording...");
            speech = true; // Set speech to true
            startRecordingButton.innerHTML = stopSVG; // Change to stop icon

            window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.interimResults = true;

            finalTranscript = ''; // Reset the transcript

            recognition.addEventListener('result', (e) => {
                const interimTranscript = Array.from(e.results)
                    .map(result => result[0].transcript)
                    .join('');

                if (e.results[0].isFinal) {
                    finalTranscript += interimTranscript + ' ';
                }
            });

            recognition.addEventListener('end', () => {
                if (speech) {
                    console.log("ended for some reason")
                    recognition.start(); // Restart automatically during speech mode
                }
            });

            recognition.start();
        };

        window.speechSynthesis.speak(utterance);
    } else {
        // Stop speech recognition
        speech = false;
        isRecording = false; // Clear recording state
        startRecordingButton.innerHTML = startSVG; // Change to start icon
        console.log("Recording stopped...");
        console.log(finalTranscript.trim());
        if (recognition) {
            recognition.stop(); // Stop recognition if active
        }

        // Send the final transcript to the server
        if (finalTranscript.trim()) {
            fetch('/voice-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: finalTranscript.trim() }),
            })
            .then(response => response.json())
            .then(result => {
                console.log("Server Response:", result);
                if (result === "Nothing") {
                    console.log("Server response is 'Nothing'.");
                    const nothingUtterance = new SpeechSynthesisUtterance("The server returned 'Nothing'.");
                    nothingUtterance.lang = 'en-US';
                    window.speechSynthesis.speak(nothingUtterance);
                } else {
                    // Handle other server responses
                    console.log("Server response is not 'Nothing':", result);
                    handleServerResponse(result);
                }
        
            })
            .catch(error => {
                console.error("Error sending voice input:", error);
            });
        }else {
            // Speak "No voice detected"
            console.log("No voice detected.");
            const noVoiceUtterance = new SpeechSynthesisUtterance("No voice detected.");
            noVoiceUtterance.lang = 'en-US';
            window.speechSynthesis.speak(noVoiceUtterance);
        }
    }
});

function speakText(text) {
    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text); // Create an utterance
        utterance.lang = 'en-US'; // Set the language (change as needed)
        utterance.rate = 1; // Set the speaking rate (1 is normal speed)
        utterance.pitch = 1; // Set the pitch (1 is normal pitch)
        utterance.volume = 1; // Set the volume (0 to 1)
        
        // Speak the text
        window.speechSynthesis.speak(utterance);

        // Optional: Handle events
        utterance.onstart = () => console.log("Speech started");
        utterance.onend = () => console.log("Speech ended");
        utterance.onerror = (event) => console.error("Speech error:", event.error);
    } else {
        console.error("Text-to-Speech not supported in this browser.");
    }
}


function handleServerResponse(response) {
    if (!response) {
        console.error("Invalid response from server.");
        return;
    }

    // Store amounts in session storage if applicable
    const amountRegex = /\b(\d+)\b/; // Regex to find amounts (numbers)
    const amountMatch = response.match(amountRegex);
    if (amountMatch) {
        const amount = amountMatch[1];
        sessionStorage.setItem('amount', amount);
    }

    // Check and navigate based on the response
    if (response.includes("Withdraw")) {
        window.location.href = '/withdraw';
        
        // const amtElement = document.getElementById('amt');
        // const submitElement = document.getElementById('depositSubmit');
        // if (amtElement && submitElement) {
        //     amtElement.value = sessionStorage.getItem('amount') || '';
        //     submitElement.click();
        // }
    } else if (response.includes("Deposit")) {
        window.location.href = '/deposit';
        const confirmElement = document.getElementById('confirm');
        if (confirmElement) {
            confirmElement.click();
        }
    } else if (response.includes("Transfer")) {
        window.location.href = '/transferFunds';
        const confirmElement = document.getElementById('confirm');
        if (confirmElement) {
            confirmElement.click();
        }
    } else if (response.includes("Report")) {
        window.location.href = '/graph1';
    } else if (response.includes("Exit")) {
        window.location.href = '/index';
    } else if (response.includes("View Tutorials")) {
        window.location.href = '/tutorial';
    } else if (response.includes("Activate Tutorial")) {
        console.log("Activating tutorial is not yet implemented.");
    } else if (response.includes("Register Face ID")) {
        window.location.href = '/addface';
    } else if (response.includes("Report A Problem")) {
        console.log("Reporting a problem is not yet implemented.");
    } else {
        console.warn("Unrecognized response action:", response);
    }
}
