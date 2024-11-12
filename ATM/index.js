//Run with npm start

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const path = require("path");
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


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

app.post('/send-pdf/', async (req, res) => {
    const { email, pdfData } = req.body;
    console.log("Sending Email ZIP...");
    // Configure the transporter with your email service credentials (use App Password here)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'j32740728@gmail.com',
            pass: 'dfqc tper yvdm klrt'  // Replace with the App Password
        }
    });
    //dfqc tper yvdm klrt

    // Create the email with the PDF attached
    const mailOptions = {
        from: 'j32740728@gmail.com',
        to: email,
        subject: 'Your Financial Summary Report',
        text: 'Please find attached your Financial Summary Report.',
        attachments: [
            {
                filename: 'Financial_Summary_Report.pdf',
                content: Buffer.from(pdfData, 'base64'),
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/send-zip/', async (req, res) => {
    const { email, zipData } = req.body;
    console.log("Sending Email...");

    // Configure the transporter with your email service credentials (use App Password here)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'j32740728@gmail.com',
            pass: 'dfqc tper yvdm klrt'  // Replace with the App Password
        }
    });

    // Create the email with the ZIP file attached
    const mailOptions = {
        from: 'j32740728@gmail.com',
        to: email,
        subject: 'Your Financial Summary Report',
        text: 'Please find attached your Financial Summary Report in ZIP format.',
        attachments: [
            {
                filename: 'Financial_Summary_Report.zip',
                content: Buffer.from(zipData, 'base64'),
                contentType: 'application/zip'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
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