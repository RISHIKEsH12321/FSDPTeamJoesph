const BankTransaction = require("../model/Bank_Transactions");

async function getBankTransactionsByUserId(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const transactions = await BankTransaction.getByUserId(userId);
        if (!transactions || transactions.length === 0) {
            return res.status(404).send("No bank transactions found for this user");
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving bank transactions");
    }
}

module.exports = {
    getBankTransactionsByUserId
};
