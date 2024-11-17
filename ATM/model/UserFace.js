const sql = require("mssql");
const dbConfig = require("../dbConfig");

class UserFace {
    constructor(faceID, userID, faceEmbedding) {
        this.faceID = faceID;
        this.userID = userID;
        this.faceEmbedding = faceEmbedding;
    }

    // Insert a new face embedding and associate it with a user ID
    static async insertFaceEmbedding(userID, faceEmbedding) {
        try {
            const connection = await sql.connect(dbConfig);
            const query = `
                INSERT INTO UserFaces (UserID, face_embedding)
                VALUES (@UserID, @faceEmbedding)`;

            const request = connection.request();
            request.input("UserID", sql.Int, userID);
            request.input("faceEmbedding", sql.NVarChar, faceEmbedding);

            await request.query(query);
            connection.close();
        } catch (err) {
            console.error("Error inserting face embedding", err);
            throw err;
        }
    }

    // Get all faces from the database for comparison
    static async getAllFaces() {
        try {
            const connection = await sql.connect(dbConfig);
            const query = `SELECT * FROM UserFaces`;

            const request = connection.request();
            const result = await request.query(query);
            connection.close();

            return result.recordset.map(row => new UserFace(row.face_id, row.user_id, row.face_embedding));
        } catch (err) {
            console.error("Error retrieving faces", err);
            throw err;
        }
    }
}

module.exports = UserFace;
