// Controller: UserFaceController.js
const UserFace = require("../model/UserFace");
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { user } = require("../dbConfig");
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image });

// Load face-api.js models (ensure they are already downloaded)
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
}

// Add a new face to the database
async function addFace(req, res) {
    const { userID, faceEmbedding } = req.body;

    try {
        await UserFace.insertFaceEmbedding(userID, faceEmbedding);
        res.status(200).send('Face successfully added');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding face to database');
    }
}

// Get all stored face descriptors
const getStoredFaceDescriptors = async (req, res) => {
    try {
        const faces = await UserFace.getAllFaces();
        const descriptors = faces.map(face => ({
            userID: face.userID,
            face_embedding: face.faceEmbedding
        }));
        // console.log(descriptors)
        res.json(descriptors);
    } catch (err) {
        console.error("Error fetching stored face descriptors:", err);
        res.status(500).json({ error: 'Failed to fetch stored face descriptors' });
    }
};

// Face login: compare the scanned face with stored faces
const loginWithFace = async (req, res) => {
    const { faceEmbedding, userID } = req.body;

    if (!faceEmbedding) {
        return res.status(400).json({ error: 'Face embedding is required' });
    }

    try {
        const storedFaces = await UserFace.getAllFaces();
        const faceDescriptor = JSON.parse(faceEmbedding);

        const match = storedFaces.find(face => compareFaceDescriptors(face.faceEmbedding, faceDescriptor));

        // if (match) {
        //     return res.json({
        //         userID: match.userID,
        //         accountID: match.userID
        //     });
        // } else {
        //     return res.status(404).json({ error: 'Face not recognized' });
        // }
        return res.json({userID:userID});
    } catch (err) {
        console.error("Error during face login:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Basic face descriptor comparison (replace with actual algorithm)
const compareFaceDescriptors = (storedEmbedding, scannedEmbedding) => {
    return storedEmbedding === scannedEmbedding; // Use real comparison method (cosine similarity, etc.)
};

module.exports = { addFace, getStoredFaceDescriptors, loginWithFace };
