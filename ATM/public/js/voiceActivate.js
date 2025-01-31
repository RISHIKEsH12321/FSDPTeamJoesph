const toggle_conversion = document.getElementById("toggle_conversion"); // Single button
const convert_text = document.getElementById("convert_text");

const openPopupButton = document.getElementById('open-popup');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popup-overlay');
const startRecordingButton = document.getElementById('start-recording');

// Get the canvas element and its context (Voice Modulation)
const canvas = document.getElementById("soundCanvas");
const ctx = canvas.getContext("2d");

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
        // speakText("Please start speaking.");
        speechSynthesis.cancel();
        // Wait for speakText to finish before starting recording
        const utterance = new SpeechSynthesisUtterance("Please start speaking.");
        utterance.lang = 'en-US';
        utterance.onend = () => {
            console.log("Speech finished. Starting recording...");
            speech = true; // Set speech to true
            startRecordingButton.innerHTML = stopSVG; // Change to stop icon
            voiceModulation();
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
                //console.log("Server Response:", result);
                //console.log(result);
                console.log(JSON.parse(result));
                const jsonResult = JSON.parse(result);

                if (jsonResult.task === "Nothing") {
                    //console.log("Server response is 'Nothing'.");
                    const nothingUtterance = new SpeechSynthesisUtterance("Voice was not recognised or the action is not valid.");
                    nothingUtterance.lang = 'en-US';
                    window.speechSynthesis.speak(nothingUtterance);
                } else {
                    // Handle other server responses
                    handleServerResponse(jsonResult);
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
    console.log(response);
    if (!response || !response.task) {
        console.error("Invalid response from server.");
        return;
    }

    // Store amounts in session storage if applicable
    if (response.amount) {
        sessionStorage.setItem('amount', response.amount);
    }

    // Check and navigate based on the response task
    switch (response.task) {
        case "Withdraw":
            window.location.href = '/withdrawal'
            break;
        
        case "Deposit":
            sessionStorage.setItem('typeOfAccount', response.type);
            window.location.href = '/deposit';        
            break;
        
        case "Transfer":
            window.location.href = '/transferFunds';
            break;
        
        case "Report":
            window.location.href = '/graph1';
            break;
        
        case "Exit":
            window.location.href = '/index';
            break;
        
        case "ViewTutorials":
            window.location.href = '/tutorial';
            break;
        
        case "ActivateTutorial":
            sessionStorage.setItem('typeForTutorial', response.type);
            window.location.href = '/tutorial';
            //console.log("Activating tutorial is not yet implemented.");
            break;
        
        case "RegisterFaceID":
            window.location.href = '/addface';
            break;
        
        case "ReportProblem":
            openContactForm();
            break;
        
        default:
            console.warn("Unrecognized response action:", response);
            break;
    }
}


function openContactForm() {
    const contactFormModal = document.getElementById("contactFormModal");
    const timestampField = document.getElementById("timestamp");
    const contactForm = document.getElementById("contactForm");

    contactForm.reset();

    const currentDate = new Date();
    timestampField.value = currentDate.toLocaleString();

    contactFormModal.style.display = "block";
}

// Create a function to start the audio context and draw the visualizer
function voiceModulation() {
    // Initialize audio context and analyser on button click
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // FFT size (controls frequency data resolution)
    const bufferLength = analyser.frequencyBinCount; // Number of frequency bins

    // Create an array to store the frequency data
    const dataArray = new Uint8Array(bufferLength);

    // Set up microphone input and connect to the analyser
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            drawVisualizer(analyser, dataArray, bufferLength); // Start drawing the visualizer
        })
        .catch(err => {
            console.error("Error accessing microphone: ", err);
        });

    // Function to draw the visualizer
    function drawVisualizer(analyser, dataArray, bufferLength) {
        // Request a new animation frame
        requestAnimationFrame(() => drawVisualizer(analyser, dataArray, bufferLength));

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get the frequency data
        analyser.getByteFrequencyData(dataArray);

        // Calculate the center of the canvas (the baseline)
        const centerY = canvas.height / 2;

        // Set a threshold for the sound intensity
        const threshold = 200; // Minimum value for bar height

        // Draw the frequency data as bars
        const barWidth = (canvas.width / bufferLength) * 2.5; // Bar width
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // Only draw the bar if it exceeds the threshold
            if (barHeight > threshold) {
                // Set the bar color (gradient effect)
                const red = barHeight + 100 * (i / bufferLength);
                const green = 250 * (i / bufferLength);
                const blue = 50;

                // Modulate bars above and below the baseline
                ctx.fillStyle = `rgb(${red},${green},${blue})`;
                ctx.fillRect(x, centerY - barHeight, barWidth, barHeight * 2); // Modulation in both directions
            }

            x += barWidth + 1; // Increment x position for next bar
        }
    }
};
