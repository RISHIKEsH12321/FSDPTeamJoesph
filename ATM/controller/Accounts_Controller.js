const Account = require("../model/Accounts");

async function getAccountsByUserId(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const accounts = await Account.getByUserId(userId);
        if (!accounts || accounts.length === 0) {
            return res.status(404).send("No accounts found for this user");
        }
        res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving accounts");
    }
}

async function getEmailByAccountId(req, res) {
    const accountId = parseInt(req.params.accountId);

    try {
        const email = await Account.getEmailByAccountId(accountId);
        if (!email) {
            return res.status(404).send("No email found for this account ID");
        }
        res.status(200).json({ email });
    } catch (error) {
        console.error("Error retrieving email by account ID:", error);
        res.status(500).send("Error retrieving email");
    }
}

const validatePinController = async (req, res) => {
    const { pin } = req.body;
  
    if (!pin || pin.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. A 6-digit PIN is required.",
      });
    }
  
    try {
      // Use getUserByPin to find the account
      const account = await Account.getUserByPin(pin);
  
      if (account) {
        res.status(200).json({
          success: true,
          message: "PIN validated successfully!",
          data: {
            userID: account.userID,
            accountNumber: account.accountNumber,
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid PIN. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error validating PIN:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
};

module.exports = {
    getAccountsByUserId,
    getEmailByAccountId,
    validatePinController
};
