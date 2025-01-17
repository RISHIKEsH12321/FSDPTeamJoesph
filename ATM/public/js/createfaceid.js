document.addEventListener('DOMContentLoaded', () => {
    let faceDescriptor; // Stores the face embedding

    const userID = getUserIDFromLocalStorage();

    console.log(userID);

    // Load models for face-api.js
    async function loadModels() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/model');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/model');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/model');
        console.log("Models loaded successfully!");
        updateSituation("Models loaded successfully!");
    }

    // Start the webcam and show the video
    async function startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
            updateSituation("Webcam started. Please position your face in front of the camera.");
        } catch (error) {
            console.error("Error starting webcam:", error);
            updateSituation("Failed to access the webcam. Please check your device permissions.");
        }
    }

    // Detect faces, landmarks, and generate embeddings
    async function scanFace() {
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
            canvas.style.display = 'block';
            faceapi.matchDimensions(canvas, video);
            const resizedDetections = faceapi.resizeResults(detections, video);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            faceDescriptor = detections.descriptor;
            saveFaceBtn.style.display = 'inline';
            updateSituation("Face detected! You can now save your face.");
        } else {
            updateSituation("No face detected! Please try again.");
        }
    }

    // Save face embedding to the database
    async function saveFace() {
        console.log("saveFace.")

        if (!userID || !faceDescriptor) {
            console.log("Please scan your face first and ensure a valid User ID is available.")
            updateSituation("Please scan your face first and ensure a valid User ID is available.");
            return;
        }

        const faceEmbedding = JSON.stringify(Array.from(faceDescriptor)); // Convert the face descriptor to an array

        try {
            const response = await fetch('/addfacetouser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: userID, faceEmbedding: faceEmbedding })
            });

            if (response.ok) {
                console.log("Face saved successfully!")
                updateSituation("Face saved successfully!");
            } else {
                updateSituation("Error saving face. Please try again.");
            }
        } catch (error) {
            console.error("Error saving face:", error);
            updateSituation("Failed to save face. Please try again later.");
        }
    }

    // Update the situation message
    function updateSituation(message) {
        const situationElement = document.getElementById('situation');
        if (situationElement.innerHTML != "Face saved successfully!"){
            situationElement.innerText = message;
        }
        
    }

    // Retrieve User ID from localStorage
    function getUserIDFromLocalStorage() {
        const userDetails = localStorage.getItem('userdetails');
        if (userDetails) {
            try {
                const user = JSON.parse(userDetails);
                return user.userID || null;
            } catch (error) {
                console.error("Error parsing user details from localStorage:", error);
                return null;
            }
        } else {
            console.warn("No user details found in localStorage.");
            return null;
        }
    }

    // Event Listeners
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startScanBtn = document.getElementById('startScanBtn');
    const saveFaceBtn = document.getElementById('saveFaceBtn');

    startScanBtn.addEventListener('click', () => {
        startWebcam();
        setInterval(scanFace, 100); // Continuously scan for faces
    });

    saveFaceBtn.addEventListener('click', saveFace);

    // Initialize the models and set up the webcam
    loadModels();
});
