//Run with npm start

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const path = require("path");
const nodemailer = require('nodemailer');

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


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
const aiReport = require("./controller/Gemini_Controller");
const faceID = require("./controller/UserFaceController");
const ATM = require("./controller/ATM_Controller");

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

//Joseph
app.get('/home/:userId', account.getAccountsByUserId);
app.get('/transferFunds/:accNo', account.getAccountByAccNo);
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "home.html"));
});
app.get('/tutorial', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "tutorial.html"));
});
app.get('/deposit', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "deposit.html"));
});
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});
app.get('/processing', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "processing.html"));
});
app.get('/transferFunds', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "transferFunds.html"));
});
app.post("/translate", async (req, res) => {
    console.log("Incoming request body:", req.body);
    const { text, target_lang } = req.body; // Expecting `text` and `target_lang` in the request body
    const apiKey = "5d05c8e3-941c-47b2-8710-ff151b0a9d19:fx"; // Replace with your actual API key
    console.log("API Key:", apiKey); 
    try {
        // Make the request to DeepL API
        const response = await axios.post(
            "https://api-free.deepl.com/v2/translate",
            new URLSearchParams({
                auth_key: apiKey,
                text: text,
                target_lang: target_lang,
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
            // {
            //     auth_key: apiKey,
            //     text: text,
            //     target_lang: target_lang,
            // }
        );

        console.log("API response:", response.data);
        // Send the translated text back to the client
        res.json(response.data);
    } catch (error) {
        console.error("Error translating text:", error.response?.data || error.message);
        res.status(500).send("Error occurred while translating text");
    }
});

//Data Routes (Rishikesh)
app.get("/atmTypes", atmTypes.getATMTransactionTypes);
app.get("/nonAtmTypes", nonAtmTypes.getNonATMTransactionTypes);

app.get("/userDetails/:userId", user.getUserById);
app.get("/accountDetails/:userId", account.getAccountsByUserId);
app.get("/bankTrans/:id", bankTransaction.getBankTransactionsByAccountId);
app.get("/personalTrans/:id", nonATMTransaction.getNonATMTransactionsByAccountId);
app.get("/accountEmail/:accountId", account.getEmailByAccountId);

//Withdrawl Routes
app.get("/withdrawal", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "withdrawal.html"));
});

//ATM Notes Amount
app.get("/ATM-details/:atmID", ATM.getATMDetailsById);
app.put("/ATM-decrease", ATM.withdrawFromATM);
app.put("/ATM-increase", ATM.depositToATM);

//Report Routes (Rishikesh)
app.get("/graph1", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "dataVis.html"));
});

//AI Routes
app.post('/start-chat', aiReport.startOneTimeChat);
app.post('/voice-chat', aiReport.getVoiceIntructions);

//Email Routes (Rishikesh)
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

//Face ID Routes (Rishikesh)
app.post('/loginWithFace', faceID.loginWithFace);
app.post("/addfacetouser", faceID.addFace);
app.get("/getStoredFaceDescriptors", faceID.getStoredFaceDescriptors);

app.get("/addFace", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "createfaceid.html"));
});

app.get("/loginFace", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "faceid.html"));
});

app.get("/voice", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "voiceTest.html"));
});


//Louis Routes
app.post("/validate-pin", account.validatePinController);

app.get("/print", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "fingerprint.html"));
});

app.get("/finger", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "finger.html"));
});

app.get("/pin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "pin.html"));
});

app.get("/face", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "face.html"));
});

app.get("/withdrawapp", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "withdrawapp.html"));
});

app.get("/generateqrcode", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "generateqrcode.html"));
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