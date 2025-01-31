document.addEventListener('DOMContentLoaded', () => {
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let faceDescriptor;
    let knownEmbeddings = [];
    let knownUserIDs = [];
    let scanningInterval;
    let isLoggedIn = false;  // Flag to track if the user is logged in

    async function loadModels() {
        try {
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
        if (isLoggedIn) return; // Prevent starting the webcam if already logged in
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (error) {
            console.error("Error starting webcam:", error);
            alert("Failed to start webcam.");
        }
    }

    async function scanFace() {
        if (isLoggedIn) return; // Prevent scanning if already logged in
        const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
            faceDescriptor = detections.descriptor;
            matchFace();
        } else {
            alert("No face detected!");
        }
    }

    async function matchFace() {
        if (isLoggedIn) return; // Prevent matching if already logged in
        if (!faceDescriptor) return;

        let bestMatch = null;
        let bestMatchDistance = Infinity;

        knownEmbeddings.forEach((embedding, index) => {
            const distance = faceapi.euclideanDistance(faceDescriptor, embedding);
            if (distance < bestMatchDistance) {
                bestMatchDistance = distance;
                bestMatch = knownUserIDs[index];
            }
        });

        if (bestMatch && bestMatchDistance < 0.6) { // Adjusted threshold
            loginUser(bestMatch);
        } else {
            alert("No matching face found.");
        }
    }

    function loginUser(userID) {
        if (isLoggedIn) return; // Prevent duplicate logins
        isLoggedIn = true; // Set to true immediately to prevent race conditions
    
        fetch('/loginWithFace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ faceEmbedding: JSON.stringify(faceDescriptor), userID: userID }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.userID) {
                    console.log("LOGGED IN WITH user id: " + data.userID);
                    document.getElementById('loginInfo').innerText = `Welcome back, User ID: ${data.userID}`;
    
                    // Fetch user details after login
                    return getUserDetails(data.userID).then((userDetails) => {
                        if (userDetails) {
                            console.log("User Details:", userDetails);
    
                            // Store the user details in localStorage
                            localStorage.setItem('userdetails', JSON.stringify(userDetails));
    
                            // Redirect to the /home page
                            window.location.href = '/home';
                        }
                    });
                } else {
                    alert("Error: No user ID returned.");
                }
            })
            .catch((err) => {
                console.error("Error logging in:", err);
                alert("Failed to log in.");
                isLoggedIn = false; // Reset flag if login fails
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
        // If already logged in, prevent starting the scan again
        if (isLoggedIn) {
            alert("You are already logged in.");
            return;
        }

        // Check if already scanning
        if (scanningInterval) {
            clearInterval(scanningInterval);
        }

        startWebcam();
        scanningInterval = setInterval(scanFace, 100); // Continuously scan
    });

    // Fetch user details from backend using userID
    function getUserDetails(userID) {
        return fetch(`/userDetails/${userID}`)
            .then(response => {
                console.log(`Fetching user details for userID: ${userID}. Status: ${response.status}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch user details. Status: ${response.status}`);
                }
                return response.json();  // This should now return the plain object
            })
            .then(data => {
                if (data) {
                    // console.log("User Details:", data);
                    return data;  // Return the user details as a plain object
                } else {
                    throw new Error("User details not found in the response.");
                }
            })
            .catch(error => {
                console.error("Error fetching user details:", error);
                alert("Failed to fetch user details.");
                return null;  // Return null if there was an error
            });
    }

    loadModels();
});
