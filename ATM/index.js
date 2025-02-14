//Run with npm start

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const path = require("path");
const nodemailer = require('nodemailer');
const {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold,} = require("@google/generative-ai");
const qrcode = require('qrcode');

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY); // API key from .env
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


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
    const { text, target_lang } = req.body; // Expecting text as an array and target_lang as a string 
    const apiKey = "5d05c8e3-941c-47b2-8710-ff151b0a9d19:fx"; // Replace with your actual API key 
 
    if (!Array.isArray(text) || !target_lang) { 
        return res.status(400).json({ error: "Invalid request format" }); 
    } 
 
    try { 
        // Convert the array into multiple text parameters 
        const params = new URLSearchParams({ auth_key: apiKey, target_lang }); 
        text.forEach(t => params.append("text", t)); // Append each text separately 
 
        // Make the request to DeepL API 
        const response = await axios.post( 
            "https://api-free.deepl.com/v2/translate", 
            params.toString(), 
            { 
                headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
            } 
        ); 
 
        console.log("API response:", response.data); 
        res.json(response.data); // Send the translated texts back to the frontend 
    } catch (error) { 
        console.error("Error translating text:", error.response?.data || error.message); 
        res.status(500).json({ error: "Error occurred while translating text" }); 
    } 
});

app.post('/withdrawalNotification', async (req, res) => {
    const { email, amount } = req.body;
    console.log("Sending Email Withdrawal Notifaction");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'j32740728@gmail.com',
            pass: 'dfqc tper yvdm klrt' 
        }
    });


    const date = new Date();
    // Create the email
    const mailOptions = {
        from: 'j32740728@gmail.com',
        to: email,
        subject: 'Withdrawal Alert',
        text: `Dear Customer,
        \n\n
        You have withdrawed $${amount} at 101 Upper Bukit Timah Rd, on ${date.toLocaleDateString()} 
        at ${date.toLocaleTimeString()}.
        \n\n
        If unauthorised, please call OCBC Hotline, 6535 7677.To view withdrawal, please login to Digibank.
        \n\n
        Thank you for banking with us.\n
        Yours faithfully,
        OCBC
        `,
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
// Route to handle chat requests
app.post("/chat", async (req, res) => {
    const userQuery = req.body.query;
  
      // System instructions to limit scope and behavior
  const systemInstructions = `
You are a virtual ATM assistant. Your primary task is to help users perform banking operations, including withdrawing money and providing translations.
Only Currency is SGD
Key Rules:
- The ATM only dispenses bills of $5, $10, $50, and $100.
- Use a stepwise approach to subtract the largest possible denomination from the requested amount until it reaches zero.
- There is no $1 bill in the ATM.
- Provide a clear breakdown of the denominations used, formatted as:
  $100: 0
  $50: 0
  $10: 0
  $5: 0
- Only withdraw amounts that are a valid multiple of $5. If the requested amount cannot be fully dispensed using the available denominations (e.g., $37), return an error message explaining that the amount is not valid.
- Always prioritize using the largest available denominations first, then move to smaller ones.
- Respond only to ATM-related queries and reject unrelated questions politely.
- Able to translate to English, Chinese, Spanish, French, German, Russian, and Korean.
`;

    // Modify the user query with system instructions
    const modifiedQuery = `${systemInstructions}\nUser query: ${userQuery}`;
    try {
      // Generate a response using Google Generative AI
      const result = await model.generateContent(modifiedQuery);
      const botResponse = result.response.text();
  
      res.json({ response: botResponse });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ response: "Sorry, something went wrong." });
    }
  });

// Endpoint to find nearest ATM of a specific brand and generate a Google Maps direction URL
app.get('/nearest-atm', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).send('Latitude, Longitude, and brand are required');
    }

    try {
        // Make a request to Google Places API to search for ATMs near the user's location
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`, 
            {
                params: {
                    location: `${lat},${lon}`,
                    type: 'bank,atm',
                    key: process.env.GOOGLEMAP_API_KEY,
                    rankby: "distance",
                    name: "OCBC",
                    keyword: "OCBC"
                }
            }
        );

        // Get the closest ATM (first in the list)
        const closestATM = response.data.results[0];

        if (!closestATM) {
            return res.status(404).send('No ATMs found nearby');
        }

        // Create a Google Maps directions URL
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${closestATM.geometry.location.lat},${closestATM.geometry.location.lng}`;

        // Generate the QR code for the directions URL
        qrcode.toDataURL(directionsUrl, (err, qrCodeDataUrl) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).send('Error generating QR code');
            }

            // Return the QR code URL to the frontend
            res.json({ url: qrCodeDataUrl });
        });

    } catch (error) {
        console.error('Error fetching ATM data:', error);
        res.status(500).send('Error fetching ATM data');
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

app.get("/locator", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "locator.html"));
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
app.post("/login", account.loginController);


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

app.get("/loginapp", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "loginapp.html"));
});

app.get("/generateqrcode", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "generateqrcode.html"));
});

app.get("/scanqrcode", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "scanqrcode.html"));
});

app.get("/confirmwithdraw", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "withdrawconfirmation.html"));
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

app.get("/chooseWithdraw", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "Options.html"))
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

