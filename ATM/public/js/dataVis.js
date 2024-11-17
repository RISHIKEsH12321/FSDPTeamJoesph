let bankTransactions = [];
let nonATMTransactions = [];
let atmTypes = [];
let nonAtmTypes = [];
let atmTypeMap = {};
let nonAtmTypeMap = {};
//Hard coded Account ID
const accountID = 1;

document.addEventListener("DOMContentLoaded", async () => {
    disableScroll();
     // Adjust accountID as needed

    try {
        // Fetch data
        const bankResponse = await fetch(`/bankTrans/${accountID}`);
        const nonATMResponse = await fetch(`/personalTrans/${accountID}`);
        const atmTypesResponse = await fetch(`/atmTypes`);
        const nonAtmTypesResponse = await fetch(`/nonAtmTypes`);
        const email = await fetch(`/accountEmail/${accountID}`)
        if (!bankResponse.ok || !nonATMResponse.ok || !atmTypesResponse.ok || !nonAtmTypesResponse.ok) {
            throw new Error("Network response was not ok");
        }

        // Assign data to global variables
        bankTransactions = await bankResponse.json();
        nonATMTransactions = await nonATMResponse.json();
        atmTypes = await atmTypesResponse.json();
        nonAtmTypes = await nonAtmTypesResponse.json();


        // Map types for easier lookup
        atmTypeMap = Object.fromEntries(atmTypes.map(type => [type.typeID, type.typeName]));
        nonAtmTypeMap = Object.fromEntries(nonAtmTypes.map(type => [type.typeID, type.typeName]));

        // console.log(bankTransactions);
        // console.log(nonATMTransactions);
        // console.log(atmTypeMap);
        // console.log(nonAtmTypeMap);

        // Call chart functions
        createMonthlyTransactionsChart(nonATMTransactions, atmTypeMap, 'chart1');
        createSpendingCategoriesChart(nonATMTransactions, nonAtmTypeMap, 'chart2');
        createAverageTransactionByCategoryChart(nonATMTransactions, nonAtmTypeMap, 'chart3');

        createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap, 'chart4');
        createMostCommonTransactionDaysChart(nonATMTransactions, 'chart5');
        generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap, 'chart6');
        


        // Sample usage
        // const result = await processTransactionData(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap);
        // console.log(result);

        await generateReportDescriptions();
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
});

// Function to create a bar chart of total personal transactions amount by month
function createMonthlyTransactionsChart(transactions, atmTypeMap, chartid) {
    const monthlyTotals = Array(12).fill(0); // Initialize array for 12 months

    transactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        if (date.getFullYear() === 2024) {
            const month = date.getMonth(); // 0-11 for January-December
            monthlyTotals[month] += transaction.amount;
        }
    });

    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'line',  // Change to 'line' for a line chart
        data: {
            labels: [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ],
            datasets: [{
                label: 'Total Transactions Amount',
                data: monthlyTotals,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,  // Prevent filling under the line
                tension: 0.1  // Add smoothness to the line
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Personal Spending',
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}

// Function to create a pie chart of spending breakdown by category
function createSpendingCategoriesChart(transactions, nonAtmTypeMap, chartid) {
    const categoryTotals = {};
    transactions.forEach(transaction => {
        const category = nonAtmTypeMap[transaction.typeID] || "Other";
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    const categoryLabels = Object.keys(categoryTotals);
    const categoryData = Object.values(categoryTotals);

    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Spending by Category',
                data: categoryData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },       
        options: {
            animation: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Spending Categoires',
                    font: {
                        size: 30
                    }
                }
            }
        }

    });
}

// Function to create a bar chart to track the average spending per transaction in each category.
function createAverageTransactionByCategoryChart(transactions, nonAtmTypeMap, chartid) {
    const categoryTotals = {};
    const categoryCounts = {};

    transactions.forEach(transaction => {
        const category = nonAtmTypeMap[transaction.typeID] || "Other";
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
            categoryCounts[category] = 0;
        }
        categoryTotals[category] += transaction.amount;
        categoryCounts[category] += 1;
    });

    const categoryLabels = Object.keys(categoryTotals);
    const categoryAverages = categoryLabels.map(category => categoryTotals[category] / categoryCounts[category]);

    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Average Transaction Amount',
                data: categoryAverages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Categories',
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}

// Function to create a double bar chart to compare income and expenses per month
function createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap, chartid) {
    // Initialize arrays to hold income and expenses for each month
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpenses = Array(12).fill(0);

    // Process ATM transactions
    bankTransactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        if (date.getFullYear() === 2024) {
            const month = date.getMonth(); // Month index (0 = January, 11 = December)

            // Check if transaction is a deposit (income) or expense
            const transactionType = atmTypeMap[transaction.typeID];
            if (transactionType === "Deposit") {
                monthlyIncome[month] += transaction.amount;
            } else if (transactionType === "Withdrawal" || transactionType === "Transfer") {
                monthlyExpenses[month] += transaction.amount;
            }
        }
    });

    // Process Non-ATM transactions (all considered as expenses)
    nonATMTransactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        if (date.getFullYear() === 2024) {
            const month = date.getMonth();
            monthlyExpenses[month] += transaction.amount;
        }
    });

    // Create the chart
    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ],
            datasets: [
                {
                    label: 'Monthly Income',
                    data: monthlyIncome,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',  // Blue for income
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Monthly Expenses',
                    data: monthlyExpenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Red for expenses
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (SGD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Income vs. Expenses Comparison',
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}

// Function to create a bar chart to compare the number of transaction in a day
function createMostCommonTransactionDaysChart(transactions, chartid) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = Array(7).fill(0); // Initialize an array to store transaction counts for each day of the week

    transactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        const dayOfWeek = date.getDay(); // Get day of the week (0-Sunday, 1-Monday, etc.)
        dayCounts[dayOfWeek] += 1; // Increment the count for the corresponding day
    });

    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
            labels: daysOfWeek, // Days of the week
            datasets: [{
                label: 'Number of Transactions',
                data: dayCounts, // Transaction counts for each day
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Transaction Dates',
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}

// Function to create a line graph showing balance over time
function generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap, chartid) {
    const monthlyBalances = {};  // To store the account balance for each month
    const months = [];           // To store the months for the x-axis (e.g., January, February)
    const balances = [];         // To store the corresponding balance values

    let balance = 0;  // Start with initial balance of 0 or the user's starting balance

    // Month names array for mapping month numbers to month names in word form
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Combine ATM and non-ATM transactions into one list for easy processing
    const allTransactions = [
        ...bankTransactions.map(transaction => ({
            ...transaction,
            isATM: true,
            category: atmTypeMap[transaction.typeID] || 'Other'
        })),
        ...nonATMTransactions.map(transaction => ({
            ...transaction,
            isATM: false,
            category: nonAtmTypeMap[transaction.typeID] || 'Other'
        }))
    ];

    // Sort transactions by date to maintain chronological order
    allTransactions.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));

    // Iterate through all sorted transactions to compute the balance for each month
    allTransactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        const monthIndex = date.getMonth();  // Get month index (0-11)
        const year = date.getFullYear();
        const monthKey = `${year}-${monthIndex + 1}`;  // Create a key like '2024-1' for January 2024
        const transactionAmount = transaction.amount;

        // Update the balance based on transaction type (ATM or non-ATM)
        if (transaction.isATM) {
            // ATM transactions
            if (transaction.category === 'Deposit') {
                balance += transactionAmount;  // Deposit increases the balance
            } else if (transaction.category === 'Withdrawal' || transaction.category === 'Transfer') {
                balance -= transactionAmount;  // Withdrawals/Transfers decrease the balance
            }
        } else {
            // Non-ATM transactions (expenses or deposits)
            if (transaction.category === 'Deposit') {
                balance += transactionAmount;  // Non-ATM deposit increases balance
            } else if (['Bills', 'Entertainment', 'Medical', 'Shopping'].includes(transaction.category)) {
                balance -= transactionAmount;  // Expenses decrease balance
            }
        }

        // Store the balance for this month
        monthlyBalances[monthKey] = balance;
        if (!months.includes(monthKey)) {
            months.push(monthKey);  // Store the month (year-month format) for the x-axis
        }
    });

    // Sort months by date (ascending)
    months.sort((a, b) => new Date(a) - new Date(b));

    // Convert the months from 'YYYY-MM' format to 'Month Name' format
    const monthLabels = months.map(monthKey => {
        const [year, monthIndex] = monthKey.split('-');
        return `${monthNames[parseInt(monthIndex) - 1]} ${year}`;  // Convert numeric month to word form
    });

    // Push the balance for each month into the balances array in the correct order
    months.forEach(month => {
        balances.push(monthlyBalances[month]);
    });

    // Create the Line Chart for monthly bank account balance
    const ctx = document.getElementById(chartid).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,  // Use the new month labels in word form
            datasets: [{
                label: 'Bank Account Balance Over Time',
                data: balances,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: false,  // Account balance can be negative or positive
                    title: {
                        display: true,
                        text: 'Balance ($)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Balance',
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}

// Creates the report pdf
async function generateFinancialReportPDF() {

    async function addChartToPDF(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const chartImage = await html2canvas(canvas).then(canvas => canvas.toDataURL("image/png"));
    
            // Dimensions of the chart on the canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
    
            // Maintain aspect ratio
            let chartWidth = pageWidth * 0.8;  // Default width is 80% of page width
            let chartHeight = (canvasHeight / canvasWidth) * chartWidth;  // Maintain aspect ratio
    
            // Special case for "duplicate-chart2"
            if (chartId === "duplicate-chart2") {
                chartWidth = 100;
                chartHeight = 100;  // Fixed size
            }
    
            // Check if the image fits the current page; if not, add a new page
            if (yOffset + chartHeight > pageHeight - 20) {  // Account for margin
                doc.addPage();
                yOffset = 20;  // Reset yOffset for new page with margin
            }
    
            // Add the chart image to the PDF
            const xPosition = (pageWidth - chartWidth) / 2;  // Center horizontally
            doc.addImage(chartImage, 'PNG', xPosition, yOffset, chartWidth, chartHeight);
    
            // Update yOffset for the next chart
            yOffset += chartHeight + 10;  // Add smaller spacing below each chart
        }
    }
    

    // Show the loading animation and overlay
    document.getElementById("loading-animation").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("reportBtn").disabled = true; // Disable button

    //Get AI Descriptions
    let aiReport = await generateReportDescriptions();

    if (typeof aiReport !== 'string') {
        // Convert JSON object to a readable string format if needed
        aiReport = JSON.stringify(aiReport, null, 2);  // Pretty-print with indentation
    }

    textcontent = aiReport.split('**SECTION SPLITS OFF HERE**');
    // console.log(textContent)

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // First page: Logo only
    const logo = new Image();
    logo.src = "../images/OCBC_logo.png";
    await new Promise((resolve) => (logo.onload = resolve));
    doc.addImage(logo, "PNG", (pageWidth - 100) / 2, (pageHeight - 50) / 2, 100, 50);  // Centered logo on the first page
    doc.addPage();  // Start a new page after the logo

    let yOffset = 20;  // Starting y-offset with a smaller margin
    

    // Title and Financial Status
    doc.setFontSize(16);
    doc.text("Financial Summary Report", 10, yOffset);
    yOffset += 15;

    doc.setFontSize(12);
    // const lines = doc.splitTextToSize(aiReport, 180);
    // doc.text(lines, 10, yOffset);
    // yOffset += 10;

    await renderDuplicateCharts();
    const chartIds = ['duplicate-chart2', 'duplicate-chart3', 'duplicate-chart1', 'duplicate-chart4', 'duplicate-chart5', 'duplicate-chart6'];



    // Add charts and content with controlled spacing
    await addChartToPDF("duplicate-chart2");
    await addChartToPDF("duplicate-chart3");

    yOffset += 10;
    const lines0 = doc.splitTextToSize(textcontent[0], 180).slice(0, 15);
    doc.text(lines0, 10, yOffset);
    yOffset += lines0.length * 6;  // Adjust line spacing to avoid large gaps

    if (yOffset + 80 > pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
    }
    await addChartToPDF("duplicate-chart1");
    await addChartToPDF("duplicate-chart4");

    yOffset += 10;
    const lines1 = doc.splitTextToSize(textcontent[1], 180).slice(0, 15);
    doc.text(lines1, 10, yOffset);
    yOffset += lines1.length * 6;

    if (yOffset + 80 > pageHeight - 20) {
        doc.addPage();
        yOffset = 20;
    }
    await addChartToPDF("duplicate-chart5");
    await addChartToPDF("duplicate-chart6");

    yOffset += 10;
    const lines2 = doc.splitTextToSize(textcontent[2], 180).slice(0, 15);
    doc.text(lines2, 10, yOffset);

    const pdfBlob = doc.output("blob");
    const zipBlob = await compressPDFToZip(pdfBlob);

    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(pdfBlob);
    // link.download = "Financial_Summary_Report.pdf";
    // link.click();

    const emailResponse = await fetch(`/accountEmail/${accountID}`)
    if (!emailResponse.ok) {
        throw new Error("Network response was not ok");
    }


    let email = await emailResponse.json();

    const reader = new FileReader();
    reader.readAsDataURL(zipBlob);
    reader.onloadend = async function () {
        const base64Data = reader.result.split(',')[1];

        await fetch('/send-zip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.email,
                zipData: base64Data
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Email sent:", data.message);
            // Show the completed animation and hide the loading animation
            document.getElementById("loading-animation").style.display = "none";
            document.getElementById("completed-animation").style.display = "block";
        })
        .catch(error => {
            console.error("Error sending email:", error);
        });
    };

    chartIds.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) canvas.style.display = 'none';
    });

    // Add click listener to completed animation to hide it
    document.getElementById("completed-animation").onclick = function() {
        document.getElementById("completed-animation").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("reportBtn").disabled = false; // Enable button again
    };
}

// Procress Data For AI
async function processTransactionData(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap) {
    // 1. Monthly total transaction amounts (nonATMTransactions)
    let monthlyTransactionAmount = {
        January: 0, February: 0, March: 0, April: 0,
        May: 0, June: 0, July: 0, August: 0,
        September: 0, October: 0, November: 0, December: 0
    };

    // 2. Spending breakdown by category
    let spendingByCategory = {};

    // 3. Average spending per category
    let categoryTotals = {};
    let categoryCounts = {};

    // 4. Income vs. expenses by month
    let monthlyIncome = { ...monthlyTransactionAmount };
    let monthlyExpenses = { ...monthlyTransactionAmount };

    // 5. Number of transactions per day of the week
    let transactionsPerDay = {
        Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
        Thursday: 0, Friday: 0, Saturday: 0
    };

    // 6. Balance over time (with all months)
    let monthlyBalances = { ...monthlyTransactionAmount }; // Initialize with all months as 0
    let balance = 0;

    // Combine both types of transactions for processing
    const allTransactions = [
        ...bankTransactions.map(transaction => ({
            ...transaction,
            isATM: true,
            category: atmTypeMap[transaction.typeID] || 'Other'
        })),
        ...nonATMTransactions.map(transaction => ({
            ...transaction,
            isATM: false,
            category: nonAtmTypeMap[transaction.typeID] || 'Other'
        }))
    ];

    // Sort transactions by date
    allTransactions.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));

    // Process each transaction
    allTransactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const dayName = date.toLocaleString('default', { weekday: 'long' });
        const transactionAmount = transaction.amount;
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

        // 1. Monthly total transaction amounts
        monthlyTransactionAmount[monthName] += transactionAmount;

        // 2. Spending breakdown by category (non-ATM transactions only)
        if (!transaction.isATM) {
            spendingByCategory[transaction.category] = (spendingByCategory[transaction.category] || 0) + transactionAmount;
        }

        // 3. Average spending per category
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transactionAmount;
        categoryCounts[transaction.category] = (categoryCounts[transaction.category] || 0) + 1;

        // 4. Income vs. expenses by month
        if (transaction.isATM) {
            if (transaction.category === "Deposit") {
                monthlyIncome[monthName] += transactionAmount;
                balance += transactionAmount;
            } else {
                monthlyExpenses[monthName] += transactionAmount;
                balance -= transactionAmount;
            }
        } else {
            monthlyExpenses[monthName] += transactionAmount;
            balance -= transactionAmount;
        }

        // 5. Number of transactions per day of the week
        transactionsPerDay[dayName] += 1;

        // 6. Update balance for the current month
        monthlyBalances[monthName] = balance;
    });

    // Calculate average spending per category
    let averageSpendingByCategory = {};
    for (const category in categoryTotals) {
        averageSpendingByCategory[category] = categoryTotals[category] / categoryCounts[category];
    }

    return {
        monthlyTransactionAmount,
        spendingByCategory,
        averageSpendingByCategory,
        monthlyIncome,
        monthlyExpenses,
        transactionsPerDay,
        monthlyBalances // Final monthly balances with all months, each populated
    };
}


// Send data to AI and get description
async function generateReportDescriptions() {
    const url = '/start-chat';  // The URL for the POST request (you can adjust if necessary)

    const data = await processTransactionData(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap);

    const dataString = convertDataToString(data)
    // Create the payload with the data wrapped inside a 'data' key
    const payload = {
        data: dataString  // Pass 'data' directly without wrapping it in an array
    };

    // Make the POST request to the backend
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)  // Convert the data to JSON format
        });

        // Check if the response is OK (status 200)
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the response from the server
        const responseData = await response.json();
        // console.log('Server Response:', responseData);
        

        return responseData;
        // You can now do something with the responseData
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

function convertDataToString(data) {
    let result = '';

    // Convert monthlyTransactionAmount
    result += '"monthlyTransactionAmount": {\n';
    for (const [month, amount] of Object.entries(data.monthlyTransactionAmount)) {
        result += `    "${month}": ${amount},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert spendingByCategory
    result += '"spendingByCategory": {\n';
    for (const [category, amount] of Object.entries(data.spendingByCategory)) {
        result += `    "${category}": ${amount},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert averageSpendingByCategory
    result += '"averageSpendingByCategory": {\n';
    for (const [category, amount] of Object.entries(data.averageSpendingByCategory)) {
        result += `    "${category}": ${amount},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert monthlyIncome
    result += '"monthlyIncome": {\n';
    for (const [month, income] of Object.entries(data.monthlyIncome)) {
        result += `    "${month}": ${income},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert monthlyExpenses
    result += '"monthlyExpenses": {\n';
    for (const [month, expense] of Object.entries(data.monthlyExpenses)) {
        result += `    "${month}": ${expense},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert transactionsPerDay
    result += '"transactionsPerDay": {\n';
    for (const [day, count] of Object.entries(data.transactionsPerDay)) {
        result += `    "${day}": ${count},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '},\n';

    // Convert monthlyBalances
    result += '"monthlyBalances": {\n';
    for (const [month, balance] of Object.entries(data.monthlyBalances)) {
        result += `    "${month}": ${balance},\n`;
    }
    result = result.slice(0, -2) + '\n';  // Remove last comma and newline
    result += '}\n';

    return '{\n' + result + '\n}';
}

// Compress the PDF to a ZIP file
async function compressPDFToZip(pdfBlob) {
    const zip = new JSZip();
    
    // Add the PDF file with maximum compression level
    zip.file("Financial_Summary_Report.pdf", pdfBlob, { compression: "DEFLATE", compressionOptions: { level: 9 } });
    
    // Generate the compressed ZIP blob
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    return zipBlob;
}

async function renderDuplicateCharts() {
    // Call chart functions and pass the duplicate canvas IDs
    createMonthlyTransactionsChart(nonATMTransactions, atmTypeMap, 'duplicate-chart1');
    createSpendingCategoriesChart(nonATMTransactions, nonAtmTypeMap, 'duplicate-chart2');
    createAverageTransactionByCategoryChart(nonATMTransactions, nonAtmTypeMap, 'duplicate-chart3');
    createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap, 'duplicate-chart4');
    createMostCommonTransactionDaysChart(nonATMTransactions, 'duplicate-chart5');
    generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap, 'duplicate-chart6');
}

function toggleChart(containerId) {
    const chartContainer = document.getElementById(containerId);
    const overlay = document.createElement('div');
    overlay.classList.add('chart-overlay');
    overlay.onclick = closeExpandedChart;

    if (chartContainer.classList.contains('expanded-chart-container')) {
        closeExpandedChart();
    } else {
        chartContainer.classList.add('expanded-chart-container');
        chartContainer.classList.remove('hidden');
        document.body.appendChild(overlay);
    }
    // Add a subtle animation to the card
    const card = document.getElementById(containerId).parentNode;
    card.classList.add('card-clicked');
    setTimeout(() => {
        card.classList.remove('card-clicked');
    }, 300);
    
}

function closeExpandedChart() {
    const expandedContainer = document.querySelector('.expanded-chart-container');
    const overlay = document.querySelector('.chart-overlay');

    if (expandedContainer) {
        expandedContainer.classList.remove('expanded-chart-container');
        expandedContainer.classList.add('hidden');
    }
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

function disableScroll() {
    // Get the current page scroll position
    scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
    scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft,

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
}
