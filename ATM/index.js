//Run with npm start

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const path = require("path");

const app = express();
const port = 3000;

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

app.get("/print", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "public", "html", "login(fingerprint).html");
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the database connection
        sql.close();
    }
});

app.get("/face", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "public", "html", "login(facial).html");
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the database connection
        sql.close();
    }
});

app.post('/submit-report', async (req, res) => {
    const { name, email, phoneNumber, problemDescription, timestamp } = req.body;

    const query = `INSERT INTO reports (name, email, phone_number, problem_description, timestamp) 
                   VALUES (@name, @email, @phoneNumber, @problemDescription, @timestamp)`;

    try {
        const request = new sql.Request();
        
        // Declare each parameter explicitly
        request.input('name', sql.VarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('phoneNumber', sql.VarChar, phoneNumber);
        request.input('problemDescription', sql.Text, problemDescription);
        request.input('timestamp', sql.DateTime, timestamp);

        // Execute the query
        const result = await request.query(query);
        res.status(200).json({ message: 'Report submitted successfully!' });
    } catch (err) {
        console.error('Error submitting report:', err);
        res.status(500).json({ message: 'Failed to submit report' });
    }
});



app.get("/report-page", async  (req,res) =>{
    res.sendFile(path.join(__dirname, "public", "html", "Helpbutton.html"));

})


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

