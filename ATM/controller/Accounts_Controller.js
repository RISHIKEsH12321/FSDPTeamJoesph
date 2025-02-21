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

async function getAccountByAccNo(req, res) {
    const accNo = parseInt(req.params.accNo);

    try {
        const accounts = await Account.getAccountByAccNo(accNo);
        if (!accounts || accounts.length === 0) {
            return res.status(404).send("No accounts found for this user");
        }
        res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving accounts");
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

const loginController = async (req, res) => {
  const { accountNumber, pin } = req.body;

  if (!accountNumber || !pin) {
      return res.status(400).json({
          success: false,
          message: "Account number and PIN are required.",
      });
  }

  try {
      const account = await Account.verifyAccount(accountNumber, pin);

      if (account) {
          res.status(200).json({
              success: true,
              message: "Login successful!",
              data: {
                  accountID: account.accountID,
                  userID: account.userID,
                  name: account.name,
                  accountNumber: account.accountNumber,
              },
          });
      } else {
          res.status(401).json({
              success: false,
              message: "Invalid account number or PIN.",
          });
      }
  } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({
          success: false,
          message: "Internal Server Error.",
      });
  }
};


module.exports = {
    getAccountsByUserId,
    getEmailByAccountId,
    getAccountByAccNo,
    validatePinController,
    loginController
};
