const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Account {
    constructor(accountID, userID, accountNumber, accountPIN) {
        this.accountID = accountID;
        this.userID = userID;
        this.accountNumber = accountNumber;
        this.accountPIN = accountPIN;
    }

    static async getByUserId(userID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Account 
                WHERE UserID = @userID`;

            const request = connection.request();
            request.input("userID", userID);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new Account(row.AccountID, row.UserID, row.Account_Number, row.Account_PIN));
        } catch (err) {
            console.log("Error retrieving accounts by user ID", err);
            throw err;
        }
    }

    static async getEmailByAccountId(accountID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT Email FROM Account 
                WHERE AccountID = @accountID`;

            const request = connection.request();
            request.input("accountID", sql.Int, accountID);

            const result = await request.query(sqlQuery);
            connection.close();

            if (result.recordset.length > 0) {
                return result.recordset[0].Email;
            } else {
                return null;  // Return null if no matching account is found
            }
        } catch (err) {
            console.log("Error retrieving email by account ID", err);
            throw err;
        }
    }

}

module.exports = Account;
