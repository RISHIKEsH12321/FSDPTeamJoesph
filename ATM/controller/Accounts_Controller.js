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

module.exports = {
    getAccountsByUserId,
    getEmailByAccountId,
    getAccountByAccNo
};
