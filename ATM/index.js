//Run with npm start

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

//Rishikesh's Controllers
const user = require("./controller/User_Controller");
const account = require("./controller/Accounts_Controller");
const bankTransaction = require("./controller/Bank_Transactions_Controller");
const nonATMTransaction = require("./controller/Non_ATM_Transactions_Controller");
const atmTypes = require("./controller/ATM_Transaction_Type_Controller");
const nonAtmTypes = require("./controller/Non_ATM_Transaction_Type_Controller");


app.use("/",express.static("public")); //Static Files start from public 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json()); 

app.get("/", async  (req,res) =>{
    try {
        // Connect to the database
        await sql.connect(dbConfig);

        // Create a new SQL request
        const request = new sql.Request();

        // Execute the SQL query
        const result = await request.query(`SELECT * FROM TEST`);

        // Send the result as the response
        res.send(result.recordset);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the database connection
        sql.close();
    }
});

app.get("/testPage", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "public", "html", "test.html");
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the database connection
        sql.close();
    }
});

app.get("/atmTypes", atmTypes.getATMTransactionTypes);
app.get("/nonAtmTypes", nonAtmTypes.getNonATMTransactionTypes);

app.get("/userDetails/:userId", user.getUserById);
app.get("/accountDetails/:userId", account.getAccountsByUserId);
app.get("/bankTrans/:userId", bankTransaction.getBankTransactionsByUserId);
app.get("/personalTrans/:userId", nonATMTransaction.getNonATMTransactionsByUserId);

app.get("/graph1", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "dataVis.html"));
});

app.listen(port, async () => {
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");

    } catch (err) {
        console.error("Database connection error:", err);
        // Terminate the application with an error code (optional)
        process.exit(1); // Exit with code 1 indicating an error
    }

    console.log(`Server listening on port ${port}`);
});