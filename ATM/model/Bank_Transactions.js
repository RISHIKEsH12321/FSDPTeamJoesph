const sql = require("mssql");
const dbConfig = require("../dbConfig");

class BankTransaction {
    constructor(transactionID, accountID, typeID, amount, transactionDate) {
        this.transactionID = transactionID;
        this.accountID = accountID;
        this.typeID = typeID;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    static async getByUserId(userID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT bt.* FROM Bank_Transactions bt
                INNER JOIN Account a ON bt.AccountID = a.AccountID
                WHERE a.UserID = @userID`;

            const request = connection.request();
            request.input("userID", userID);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new BankTransaction(row.Bank_TransactionID, row.AccountID, row.TypeID, row.Amount, row.Transaction_Date));
        } catch (err) {
            console.log("Error retrieving bank transactions by user ID", err);
            throw err;
        }
    }
}

module.exports = BankTransaction;
