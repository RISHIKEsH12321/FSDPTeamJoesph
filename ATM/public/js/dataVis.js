let bankTransactions = [];
let nonATMTransactions = [];
let atmTypes = [];
let nonAtmTypes = [];
let atmTypeMap = {};
let nonAtmTypeMap = {};


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

        // Assign data to global variables
        bankTransactions = await bankResponse.json();
        nonATMTransactions = await nonATMResponse.json();
        atmTypes = await atmTypesResponse.json();
        nonAtmTypes = await nonAtmTypesResponse.json();

        

        // Map types for easier lookup
        atmTypeMap = Object.fromEntries(atmTypes.map(type => [type.typeID, type.typeName]));
        nonAtmTypeMap = Object.fromEntries(nonAtmTypes.map(type => [type.typeID, type.typeName]));

        // Call chart functions
        createMonthlyTransactionsChart(nonATMTransactions, atmTypeMap, 'chart1');
        createSpendingCategoriesChart(nonATMTransactions, nonAtmTypeMap, 'chart2');
        createAverageTransactionByCategoryChart(nonATMTransactions, nonAtmTypeMap, 'chart3');

        createIncomeVsExpensesChart(bankTransactions, nonATMTransactions, atmTypeMap, 'chart4');
        createMostCommonTransactionDaysChart(nonATMTransactions, 'chart5');
        generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap, 'chart6');
        

    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
});

// Function to create a bar chart of total transactions by month
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
                    text: 'Income vs. Expenses Comparison'
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
            }
        }
    });
}

function generateBankAccountBalanceGraph(bankTransactions, nonATMTransactions, atmTypeMap, nonAtmTypeMap, chartid) {
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
    const ctx = document.getElementById(chartid).getContext('2d');
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

    // Set Title and Financial Status
    doc.setFontSize(16);
    doc.text("Financial Summary Report", 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text("Your current financial status is as follows:", 10, yOffset);
    yOffset += 10;
    doc.text("Status: Stable with consistent spending and income flow. Continue budgeting carefully.", 10, yOffset);
    yOffset += 20;

    // Render charts in duplicate elements
    await renderDuplicateCharts();

    // IDs of the chart elements
    const chartIds = ['duplicate-chart1', 'duplicate-chart2', 'duplicate-chart3', 'duplicate-chart4', 'duplicate-chart5', 'duplicate-chart6'];

    for (const chartId of chartIds) {
        const canvas = document.getElementById(chartId);

        // Check if the canvas exists and is visible
        if (canvas) {
            try {
                // Adding a delay to ensure chart rendering is complete
                await new Promise(resolve => setTimeout(resolve, 500));

                // Capture the chart as an image
                const chartImage = await html2canvas(canvas).then(canvas => canvas.toDataURL("image/png"));

                // Add the captured image to the PDF
                doc.addImage(chartImage, 'PNG', 10, yOffset, 150, 80); // Smaller size for PDF
                yOffset += 90; // Move down for the next chart

                // Check if yOffset exceeds page height, and add a new page if necessary
                if (yOffset + 90 > pageHeight) {
                    doc.addPage();
                    yOffset = 10; // Reset yOffset for new page
                }
            } catch (error) {
                console.error(`Error capturing image for ${chartId}:`, error);
            }
        } else {
            console.warn(`Canvas with id ${chartId} not found.`);
        }
    }

    // Generate PDF Blob and compress it to ZIP
    const pdfBlob = doc.output("blob");
    const zipBlob = await compressPDFToZip(pdfBlob);

    // Optional: Download the ZIP file locally
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "Financial_Summary_Report.zip";
    link.click();

    // Optional: Send the ZIP file to the server
    const reader = new FileReader();
    reader.readAsDataURL(zipBlob);
    reader.onloadend = async function () {
        const base64Data = reader.result.split(',')[1]; // Get base64 part

        await fetch('/send-zip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'rishi070606@gmail.com', // The recipient's email address
                zipData: base64Data
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Email sent:", data.message);
        })
        .catch(error => {
            console.error("Error sending email:", error);
        });
    };

    // Hide duplicate charts after PDF generation
    chartIds.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) canvas.style.display = 'none';
    });
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
