const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ATM {
    constructor(id, location, numOf5, numOf10, numOf50, numOf100) {
        this.id = id;
        this.location = location;
        this.numOf5 = numOf5;
        this.numOf10 = numOf10;
        this.numOf50 = numOf50;
        this.numOf100 = numOf100;
    }

    // Method to get ATM details by ID
    static async GetDetailsByID(atmID) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT * FROM ATM 
                WHERE ID = @atmID`;

            const request = connection.request();
            request.input("atmID", sql.Int, atmID);

            const result = await request.query(sqlQuery);
            connection.close();

            if (result.recordset.length > 0) {
                const row = result.recordset[0];
                return new ATM(row.ID, row.Location, row.NumOf5, row.NumOf10, row.NumOf50, row.NumOf100);
            } else {
                return null; // No matching ATM found
            }
        } catch (err) {
            console.error("Error retrieving ATM details by ID:", err);
            throw err;
        }
    }

    // Method to withdraw cash from the ATM
    static async Withdraw(atmID, notesToWithdraw) {
        const numOf5 = notesToWithdraw.notes['5']
        const numOf10 = notesToWithdraw.notes['10']
        const numOf50 = notesToWithdraw.notes['50']
        const numOf100 = notesToWithdraw.notes['100']

        try {
            const connection = await sql.connect(dbConfig);

            console.log("numof5",   numOf5);
            console.log("numof10",  numOf10);
            console.log("numof50",  numOf50);
            console.log("numof100", numOf100);

            // Update the notes in the ATM table
            const sqlQuery = `
                UPDATE ATM
                SET NumOf5 = NumOf5 - @numOf5,
                    NumOf10 = NumOf10 - @numOf10,
                    NumOf50 = NumOf50 - @numOf50,
                    NumOf100 = NumOf100 - @numOf100
                WHERE ID = @atmID
                  AND NumOf5 >= @numOf5
                  AND NumOf10 >= @numOf10
                  AND NumOf50 >= @numOf50
                  AND NumOf100 >= @numOf100`;

            const request = connection.request();
            request.input("atmID", sql.Int, atmID);
            request.input("numOf5", sql.Int, numOf5);
            request.input("numOf10", sql.Int, numOf10);
            request.input("numOf50", sql.Int, numOf50);
            request.input("numOf100", sql.Int, numOf100);

            const result = await request.query(sqlQuery);
            connection.close();

            if (result.rowsAffected[0] === 0) {
                // throw new Error("Insufficient notes available in the ATM for the withdrawal.");
                //console.log("Insufficient notes available in the ATM for the withdrawal.");
                return { success: false, message: "Insufficient notes available in the ATM for the withdrawal." }
            }

            return { success: true, message: "Withdrawal successful." };
        } catch (err) {
            console.error("Error during withdrawal:", err);
            throw err;
        }
    }

    // Method to deposit cash into the ATM
    static async Deposit(atmID, notesToDeposit) {
        const numOf5 = notesToDeposit.notes['5']
        const numOf10 = notesToDeposit.notes['10']
        const numOf50 = notesToDeposit.notes['50']
        const numOf100 = notesToDeposit.notes['100']

        try {
            const connection = await sql.connect(dbConfig);

            // Update the notes in the ATM table
            const sqlQuery = `
                UPDATE ATM
                SET NumOf5 = NumOf5 + @numOf5,
                    NumOf10 = NumOf10 + @numOf10,
                    NumOf50 = NumOf50 + @numOf50,
                    NumOf100 = NumOf100 + @numOf100
                WHERE ID = @atmID`;

            const request = connection.request();
            request.input("atmID", sql.Int, atmID);
            request.input("numOf5", sql.Int, numOf5);
            request.input("numOf10", sql.Int, numOf10);
            request.input("numOf50", sql.Int, numOf50);
            request.input("numOf100", sql.Int, numOf100);
            await request.query(sqlQuery);
            connection.close();

            return { success: true, message: "Deposit successful." };
        } catch (err) {
            console.error("Error during deposit:", err);
            throw err;
        }
    }
}

module.exports = ATM;