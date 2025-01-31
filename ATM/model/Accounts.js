const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Account {
    constructor(accountID, userID, accountNumber, accountPIN, name) {
        this.accountID = accountID;
        this.userID = userID;
        this.accountNumber = accountNumber;
        this.accountPIN = accountPIN;
        this.name = name;
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

            return result.recordset.map(row => new Account(row.AccountID, row.UserID, row.Account_Number, row.Account_PIN,row.Name));
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
    
    static async getAccountByAccNo(accNo) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Account 
                WHERE Account_Number = @accNo`;
            const request = connection.request();
            request.input("accNo", accNo);
            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new Account(row.AccountID, row.UserID, row.Account_Number, row.Account_PIN,row.Name));
        } catch (err) {
            console.log("Error retrieving accounts by user ID", err);
            throw err;
        }
    }

    static async getUserByPin(pin) {
        try {
          const connection = await sql.connect(dbConfig);
          const sqlQuery = `
            SELECT * FROM Account 
            WHERE Account_PIN = @pin`;
    
          const request = connection.request();
          request.input("pin", sql.VarChar, pin);
    
          const result = await request.query(sqlQuery);
          connection.close();
    
          if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Account(row.AccountID, row.UserID, row.Account_Number, row.Account_PIN);
          } else {
            return null; // No matching account found
          }
        } catch (err) {
          console.error("Error retrieving user by PIN:", err);
          throw err;
        }
    }

    static async verifyAccount(accountNumber, pin) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Account 
                WHERE Account_Number = @accountNumber AND Account_PIN = @pin`;
    
            const request = connection.request();
            request.input("accountNumber", sql.VarChar, accountNumber);
            request.input("pin", sql.VarChar, pin);
    
            const result = await request.query(sqlQuery);
            connection.close();
    
            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return new Account(row.AccountID, row.UserID, row.Account_Number, row.Account_PIN, row.Name);
            } else {
                return null; // No matching account found
            }
        } catch (err) {
            console.error("Error verifying account:", err);
            throw err;
        }
    }
    
}



module.exports = Account;
