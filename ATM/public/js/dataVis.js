document.addEventListener("DOMContentLoaded", async () => {
    const userID = 2; // Adjust userID as needed

    try {
        // Fetch data
        const bankResponse = await fetch(`/bankTrans/${userID}`);
        const nonATMResponse = await fetch(`/personalTrans/${userID}`);
        const atmTypesResponse = await fetch(`/atmTypes`);
        const nonAtmTypesResponse = await fetch(`/nonAtmTypes`);

        if (!bankResponse.ok || !nonATMResponse.ok || !atmTypesResponse.ok || !nonAtmTypesResponse.ok) {
            throw new Error("Network response was not ok");
        }

        const bankTransactions = await bankResponse.json();
        const nonATMTransactions = await nonATMResponse.json();
        const atmTypes = await atmTypesResponse.json();
        const nonAtmTypes = await nonAtmTypesResponse.json();

        console.log(bankTransactions);
        console.log(nonATMTransactions);
        console.log(atmTypes);
        console.log(nonAtmTypes);
        

        // Map types for easier lookup
        const atmTypeMap = Object.fromEntries(atmTypes.map(type => [type.typeID, type.typeName]));
        const nonAtmTypeMap = Object.fromEntries(nonAtmTypes.map(type => [type.typeID, type.typeName]));

        //console.log("Non-ATM Transactions:", nonATMTransactions);

        // Call chart functions
        createMonthlyTransactionsChart(nonATMTransactions, atmTypeMap);
        createSpendingCategoriesChart(nonATMTransactions, nonAtmTypeMap);
        createAverageTransactionByCategoryChart(nonATMTransactions, nonAtmTypeMap);

        createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap);
        createMostCommonTransactionDaysChart(nonATMTransactions);
        generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap);
        

    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
});

// Function to create a bar chart of total transactions by month
function createMonthlyTransactionsChart(transactions, atmTypeMap) {
    const monthlyTotals = Array(12).fill(0); // Initialize array for 12 months

    transactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        if (date.getFullYear() === 2024) {
            const month = date.getMonth(); // 0-11 for January-December
            monthlyTotals[month] += transaction.amount;
        }
    });

    const ctx = document.getElementById('chart1').getContext('2d');
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
            }
        }
    });
}

// Function to create a pie chart of spending breakdown by category
function createSpendingCategoriesChart(transactions, nonAtmTypeMap) {
    const categoryTotals = {};
    transactions.forEach(transaction => {
        const category = nonAtmTypeMap[transaction.typeID] || "Other";
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    const categoryLabels = Object.keys(categoryTotals);
    const categoryData = Object.values(categoryTotals);

    const ctx = document.getElementById('chart2').getContext('2d');
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
        }
    });
}

// Function to create a bar chart to track the average spending per transaction in each category.
function createAverageTransactionByCategoryChart(transactions, nonAtmTypeMap) {
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

    const ctx = document.getElementById('chart3').getContext('2d');
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
            }
        }
    });
}

// Function to create a double bar chart to compare income and expenses per month
function createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap) {
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
    const ctx = document.getElementById('chart4').getContext('2d');
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
                    text: 'Income vs. Expenses Comparison'
                }
            }
        }
    });
}

// Function to create a bar chart to compare the number of transaction in a day
function createMostCommonTransactionDaysChart(transactions) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = Array(7).fill(0); // Initialize an array to store transaction counts for each day of the week

    transactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        const dayOfWeek = date.getDay(); // Get day of the week (0-Sunday, 1-Monday, etc.)
        dayCounts[dayOfWeek] += 1; // Increment the count for the corresponding day
    });

    const ctx = document.getElementById('chart5').getContext('2d');
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
            }
        }
    });
}

function generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap) {
    const monthlyBalances = {};  // To store the account balance for each month
    const months = [];           // To store the months for the x-axis (e.g., January, February)
    const balances = [];         // To store the corresponding balance values

    let balance = 0;  // Start with initial balance of 0 or the user's starting balance

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
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;  // Create a key like '2024-1' for January 2024
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
            // Non-ATM transactions (expenses)
            if (transaction.category === 'Bills' || transaction.category === 'Entertainment' || transaction.category === 'Medical' || transaction.category === 'Shopping') {
                balance -= transactionAmount;  // Expenses decrease the balance
            }
        }

        // Store the balance for this month
        if (!monthlyBalances[monthKey]) {
            monthlyBalances[monthKey] = balance;
            months.push(monthKey);  // Store the month (year-month format) for the x-axis
        }
    });

    // Sort months by date (ascending)
    months.sort((a, b) => new Date(a) - new Date(b));

    // Push the balance for each month into the balances array in the correct order
    months.forEach(month => {
        balances.push(monthlyBalances[month]);
    });

    // Create the Line Chart for monthly bank account balance
    const ctx = document.getElementById('chart6').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,  // Labels are the months in 'YYYY-MM' format
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
            }
        }
    });
}

async function generateFinancialReportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 10; // Starting position

    // Set Title and Hardcoded Financial Status
    doc.setFontSize(16);
    doc.text("Financial Summary Report", 10, yOffset);
    yOffset += 10;
    
    doc.setFontSize(12);
    doc.text("Your current financial status is as follows:", 10, yOffset);
    yOffset += 10;
    doc.text("Status: Stable with consistent spending and income flow. Continue budgeting carefully.", 10, yOffset);
    yOffset += 20;

    // Capture Chart Images
    const charts = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6']; // ID of chart canvases
    
    for (const chartId of charts) {
        const chart = document.getElementById(chartId);
        if (chart) {
            const canvas = await html2canvas(chart);
            const imgData = canvas.toDataURL("image/png");

            // Add image and check for overflow
            if (yOffset + 100 > pageHeight) { 
                doc.addPage();
                yOffset = 10;
            }
            doc.addImage(imgData, 'PNG', 10, yOffset, 180, 100);
            yOffset += 110; // Space for the next chart
        }
    }

    // Add Data Table
    const sampleData = [
        { category: "Income", amount: 5000 },
        { category: "Shopping", amount: 1200 },
        { category: "Medical", amount: 300 },
        { category: "Entertainment", amount: 800 },
        // Add more data as needed
    ];
    if (yOffset + 20 > pageHeight) { 
        doc.addPage();
        yOffset = 10;
    }
    doc.text("Detailed Financial Data:", 10, yOffset);
    yOffset += 10;

    sampleData.forEach((data, index) => {
        if (yOffset + 10 > pageHeight) { 
            doc.addPage();
            yOffset = 10;
        }
        doc.text(`${data.category}: $${data.amount}`, 10, yOffset);
        yOffset += 10;
    });

    // Save PDF and Generate QR Code for Download
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Generate QR Code for PDF download
    const qrContainer = document.getElementById("qrCode");
    qrContainer.innerHTML = ""; // Clear previous QR code if any
    new QRCode(qrContainer, {
        text: pdfUrl,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Create Download Button
    const downloadButton = document.createElement("a");
    downloadButton.href = pdfUrl;
    downloadButton.download = "Financial_Summary_Report.pdf";
    downloadButton.textContent = "Download Financial Report";
    document.body.appendChild(downloadButton); // Adjust as needed
}














function toggleChart(chartId) {
    const chartCanvas = document.getElementById(chartId);
    const chartCard = chartCanvas.parentElement;

    if (chartCard.classList.contains('expanded')) {
        chartCard.classList.remove('expanded');
    } else {
        // Collapse other charts
        const otherCards = document.querySelectorAll('.chart-card');
        otherCards.forEach(card => card.classList.remove('expanded'));

        // Expand the clicked chart
        chartCard.classList.add('expanded');
    }
}