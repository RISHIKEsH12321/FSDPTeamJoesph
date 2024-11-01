document.addEventListener("DOMContentLoaded", async () => {
    const userID = 2; // Adjust userID as needed

    try {
        const response = await fetch(`/bankTrans/${userID}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const transactions = await response.json();
        console.log("Bank Transactions:", transactions);

        // Process the transactions to sum by month
        const monthlyTotals = Array(12).fill(0); // Initialize array for 12 months

        transactions.forEach(transaction => {
            const date = new Date(transaction.transactionDate);
            if (date.getFullYear() === 2024) {
                const month = date.getMonth(); // 0-11 for January-December
                monthlyTotals[month] += transaction.amount; // Sum amounts by month
            }
        });

        // Chart.js setup
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
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
    } catch (error) {
        console.error("Error fetching bank transactions:", error);
    }
});
