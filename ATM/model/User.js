const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
    constructor(userID, dateJoined, phoneNumber, nric) {
        this.userID = userID;
        this.dateJoined = dateJoined;
        this.phoneNumber = phoneNumber;
        this.nric = nric;
    }

    static async getByUserId(userID) {
        try {
                console.log(userID)
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Users 
                WHERE UserID = @userID`;

            const request = connection.request();
            request.input("userID", userID);

            const result = await request.query(sqlQuery);
            connection.close();
            
            return result.recordset.map(row => new User(row.UserID, row.Date_Joined, row.Phone_Number, row.NRIC));
        } catch (err) {
            console.log("Error retrieving user by ID", err);
            throw err;
        }
    }
}

module.exports = User;
