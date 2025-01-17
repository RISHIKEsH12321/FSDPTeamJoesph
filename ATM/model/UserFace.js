const sql = require("mssql");
const dbConfig = require("../dbConfig");

class UserFace {
    constructor(faceID, userID, faceEmbedding) {
        this.faceID = faceID;
        this.userID = userID;
        this.faceEmbedding = faceEmbedding;
    }
    // Insert or update a face embedding and associate it with a user ID
    static async insertFaceEmbedding(userID, faceEmbedding) {
        try {
            const connection = await sql.connect(dbConfig);
            const query = `
                MERGE UserFaces AS target
                USING (SELECT @UserID AS UserID, @faceEmbedding AS face_embedding) AS source
                ON target.UserID = source.UserID
                WHEN MATCHED THEN
                    UPDATE SET face_embedding = source.face_embedding
                WHEN NOT MATCHED THEN
                    INSERT (UserID, face_embedding)
                    VALUES (source.UserID, source.face_embedding);`;

            const request = connection.request();
            request.input("UserID", sql.Int, userID);
            request.input("faceEmbedding", sql.NVarChar, faceEmbedding);

            await request.query(query);
            connection.close();
        } catch (err) {
            console.error("Error inserting or updating face embedding", err);
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
            // console.log(result)
            return result.recordset.map(row => new UserFace(row.FaceID, row.UserID, row.face_embedding));
        } catch (err) {
            console.error("Error retrieving faces", err);
            throw err;
        }
    }
}

module.exports = UserFace;
