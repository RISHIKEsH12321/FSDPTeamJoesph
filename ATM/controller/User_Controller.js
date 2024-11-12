const User = require("../model/User");

async function getUserById(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const user = await User.getByUserId(userId);
        if (!user || user.length === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user");
    }
}

module.exports = {
    getUserById
};
