const User = require("../model/User");

async function getUserById(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const user = await User.getByUserId(userId);
        if (!user || user.length === 0) {
            return res.status(404).send("User not found");
        }
        const userData = user[0].toJSON ? user[0].toJSON() : user[0];

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user");
    }
}

module.exports = {
    getUserById
};
