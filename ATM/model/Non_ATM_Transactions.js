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

    static async getByAccountId(accountID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Non_ATM_Transactions
                WHERE AccountID = @accountID`;

            const request = connection.request();
            request.input("accountID", accountID);

            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new NonATMTransaction(row.Normal_TransactionID, row.AccountID, row.OrganizationID, row.TypeID, row.Amount, row.Transaction_Date));
        } catch (err) {
            console.log("Error retrieving non-ATM transactions by account ID", err);
            throw err;
        }
    }
}


module.exports = NonATMTransaction;
