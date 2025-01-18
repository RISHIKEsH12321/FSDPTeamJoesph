const ATM = require("../model/ATM");

// Retrieve ATM details by ID
async function getATMDetailsById(req, res) {
    const atmID = parseInt(req.params.atmID);

    try {
        const atmDetails = await ATM.GetDetailsByID(atmID);
        if (!atmDetails) {
            return res.status(404).send("No ATM found with this ID");
        }
        res.status(200).json(atmDetails);
    } catch (error) {
        console.error("Error retrieving ATM details:", error);
        res.status(500).send("Error retrieving ATM details");
    }
}

// Handle ATM withdrawals
async function withdrawFromATM(req, res) {
    const atmID = parseInt(req.body.atmId);
    const notesToWithdraw = req.body;

    try {
        const result = await ATM.Withdraw(atmID, notesToWithdraw);
        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Withdrawal successful",
                data: result.updatedATM,
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        console.error("Error processing ATM withdrawal:", error);
        res.status(500).send("Error processing withdrawal");
    }
}

// Handle ATM deposits
async function depositToATM(req, res) {
    const atmID = parseInt(req.body.atmId);
    const notesToDeposit = req.body;
    
    try {
        const updatedATM = await ATM.Deposit(atmID, notesToDeposit);
        res.status(200).json({
            success: true,
            message: "Deposit successful",
            data: updatedATM,
        });
    } catch (error) {
        console.error("Error processing ATM deposit:", error);
        res.status(500).send("Error processing deposit");
    }
}

module.exports = {
    getATMDetailsById,
    withdrawFromATM,
    depositToATM,
};
