const ATMTransactionType = require("../model/ATM_Transaction_Type");

async function getATMTransactionTypes(req, res) {
    try {
        const atmTypes = await ATMTransactionType.getAllTypes();
        if (!atmTypes || atmTypes.length === 0) {
            return res.status(404).send("No ATM transaction types found");
        }
        res.status(200).json(atmTypes);
    } catch (error) {
        console.error("Error retrieving ATM transaction types:", error);
        res.status(500).send("Error retrieving ATM transaction types");
    }
}

module.exports = {
    getATMTransactionTypes
};