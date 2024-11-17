document.addEventListener('DOMContentLoaded', () => {
    let faceDescriptor; // Stores the face embedding
    console.log(1);

    // Load models for face-api.js
    async function loadModels() {
        // Update to use loadFromUri instead of loadFromDisk for browser environment
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/model');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/model');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/model');
        console.log("Models loaded successfully!");
    }
    

    // Start the webcam and show the video
    async function startWebcam() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    }

    // Detect faces, landmarks, and generate embeddings
    async function scanFace() {
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        console.log(detections);  // Log detections to ensure that face detection is working
        if (detections) {
            canvas.style.display = 'block';
            faceapi.matchDimensions(canvas, video);
            console.log(1); 
            const resizedDetections = faceapi.resizeResults(detections, video);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            console.log(2); 
            faceDescriptor = detections.descriptor;
            console.log(faceDescriptor);  // Log the face descriptor
            saveFaceBtn.style.display = 'inline';
            console.log('Save Face button should be visible now.');
        } else {
            alert("No face detected! Please try again.");
        }
    }
    

    // Save face embedding to the database
    async function saveFace() {
        console.log(1);
        const userID = document.getElementById('userID').value;
        if (!userID || !faceDescriptor) {
            alert("Please enter a valid User ID and scan your face.");
            return;
        }

        const faceEmbedding = JSON.stringify(Array.from(faceDescriptor)); // Convert the face descriptor to an array

        const response = await fetch('/addfacetouser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: userID, faceEmbedding: faceEmbedding })
        });

        if (response.ok) {
            alert("Face saved successfully!");
        } else {
            alert("Error saving face. Please try again.");
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
