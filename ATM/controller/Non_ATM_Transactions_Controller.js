const NonATMTransaction = require("../model/Non_ATM_Transactions");

async function getNonATMTransactionsByUserId(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const transactions = await NonATMTransaction.getByUserId(userId);
        if (!transactions || transactions.length === 0) {
            return res.status(404).send("No non-ATM transactions found for this user");
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving non-ATM transactions");
    }
}

module.exports = {
    getNonATMTransactionsByUserId
};
