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

    static async getByAccountId(accountID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Bank_Transactions
                WHERE AccountID = @accountID`;

            const request = connection.request();
            request.input("accountID", accountID);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new BankTransaction(row.Bank_TransactionID, row.AccountID, row.TypeID, row.Amount, row.Transaction_Date));
        } catch (err) {
            console.log("Error retrieving bank transactions by account ID", err);
            throw err;
        }
    }
}

module.exports = BankTransaction;
