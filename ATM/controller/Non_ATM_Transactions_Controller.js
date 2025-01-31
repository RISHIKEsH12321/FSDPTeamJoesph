const NonATMTransaction = require("../model/Non_ATM_Transactions");

async function getNonATMTransactionsByAccountId(req, res) {
    const id = parseInt(req.params.id);

    try {
        const transactions = await NonATMTransaction.getByAccountId(id);
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
    getNonATMTransactionsByAccountId
};
