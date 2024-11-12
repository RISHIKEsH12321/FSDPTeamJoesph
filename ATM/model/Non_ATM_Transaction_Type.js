const sql = require("mssql");
const dbConfig = require("../dbConfig");

class NonATMTransactionType {
    constructor(typeID, typeName) {
        this.typeID = typeID;
        this.typeName = typeName;
    }

    static async getAllTypes() {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM Non_ATM_Transaction_Type`;

            const request = connection.request();
            const result = await request.query(sqlQuery);
            connection.close();

            return result.recordset.map(row => new NonATMTransactionType(row.TypeID, row.TypeName));
        } catch (err) {
            console.log("Error retrieving non-ATM transaction types", err);
            throw err;
        }
    }
}

module.exports = NonATMTransactionType;
