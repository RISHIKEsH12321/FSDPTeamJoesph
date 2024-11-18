// const { user } = require("../../dbConfig");

// createFaceID.js
document.addEventListener('DOMContentLoaded', () => {
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let faceDescriptor;
    let knownEmbeddings = [];
    let knownUserIDs = [];
    let scanningInterval;

    async function loadModels() {
        try {
            // Update to use loadFromUri instead of loadFromDisk for browser environment
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/model');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/model');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/model');
            console.log("Models loaded successfully!");
        } catch (error) {
            console.error("Error loading models:", error);
            alert("Failed to load models.");
        }
    }

    async function startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (error) {
            console.error("Error starting webcam:", error);
            alert("Failed to start webcam.");
        }
    }

    async function scanFace() {
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
            faceDescriptor = detections.descriptor;
            matchFace();
        } else {
            alert("No face detected!");
        }
    }

    async function matchFace() {
        if (!faceDescriptor) return;
        // console.log("Current", faceDescriptor)

        let bestMatch = null;
        let bestMatchDistance = Infinity;
        // console.log("First", knownEmbeddings[0]);
        // console.log("Second", knownEmbeddings[1]);
        


        knownEmbeddings.forEach((embedding, index) => {
            console.log(`Comparing with embedding [${index}]`);
            const distance = faceapi.euclideanDistance(faceDescriptor, embedding);
            console.log(`Distance: ${distance}`);
            if (distance < bestMatchDistance) {
                bestMatchDistance = distance;
                bestMatch = knownUserIDs[index];
            }
        });
        console.log("Best match:", bestMatch, "Distance:", bestMatchDistance);
        
        console.log("knownUserIDs", knownUserIDs);

        console.log("Bestmatch", bestMatch);
        console.log("bestMatchDistance", bestMatchDistance);
        if (bestMatch && bestMatchDistance < 0.3) { // Adjusted threshold
            loginUser(bestMatch);
        } else {
            alert("No matching face found.");
        }
    }

    function loginUser(userID) {
        fetch('/loginWithFace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ faceEmbedding: JSON.stringify(faceDescriptor), userID:userID   })
        })
        .then(response => response.json())
        .then(data => {
            if (data.userID) {
                console.log("LOGGED IN WITH user id: " + data.userID)
                document.getElementById('loginInfo').innerText = `Welcome back, User ID: ${data.userID}`;
            } else {
                alert("Error: No user ID returned.");
            }
        })
        .catch(err => {
            console.error("Error logging in:", err);
            alert("Failed to log in.");
        });
    }

    // Fetch known faces from backend
    fetch('/getStoredFaceDescriptors')
        .then(response => response.json())
        .then(data => {
            data.forEach(face => {
                knownEmbeddings.push(new Float32Array(JSON.parse(face.face_embedding)));
                knownUserIDs.push(face.userID);
            });
        })
        .catch(err => {
            console.error("Error fetching faces:", err);
            alert("Failed to fetch stored faces.");
        });

    document.getElementById('startScanBtn').addEventListener('click', () => {
        // Check if already scanning
        if (scanningInterval) {
            clearInterval(scanningInterval);
        }

        startWebcam();
        scanningInterval = setInterval(scanFace, 100); // Continuously scan
    });

    // document.getElementById('stopScanBtn').addEventListener('click', () => {
    //     // Stop scanning
    //     if (scanningInterval) {
    //         clearInterval(scanningInterval);
    //         console.log("Face scanning stopped.");
    //     }
    // });

    loadModels();
});
