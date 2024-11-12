const sql = require("mssql");
const dbConfig = require("../dbConfig");

class NonATMTransaction {
    constructor(transactionID, accountID, organizationID, typeID, amount, transactionDate) {
        this.transactionID = transactionID;
        this.accountID = accountID;
        this.organizationID = organizationID;
        this.typeID = typeID;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    static async getByUserId(userID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT nat.* FROM Non_ATM_Transactions nat
                INNER JOIN Account a ON nat.AccountID = a.AccountID
                WHERE a.UserID = @userID`;

            const request = connection.request();
            request.input("userID", userID);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new NonATMTransaction(row.Normal_TransactionID, row.AccountID, row.OrganizationID, row.TypeID, row.Amount, row.Transaction_Date));
        } catch (err) {
            console.log("Error retrieving non-ATM transactions by user ID", err);
            throw err;
        }
    }
}

module.exports = NonATMTransaction;
