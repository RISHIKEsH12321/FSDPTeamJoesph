const NonATMTransactionType = require("../model/Non_ATM_Transaction_Type");

async function getNonATMTransactionTypes(req, res) {
    try {
        const nonAtmTypes = await NonATMTransactionType.getAllTypes();
        if (!nonAtmTypes || nonAtmTypes.length === 0) {
            return res.status(404).send("No non-ATM transaction types found");
        }
        res.status(200).json(nonAtmTypes);
    } catch (error) {
        console.error("Error retrieving non-ATM transaction types:", error);
        res.status(500).send("Error retrieving non-ATM transaction types");
    }
}

module.exports = {
    getNonATMTransactionTypes
};