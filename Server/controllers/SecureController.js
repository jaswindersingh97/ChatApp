
const searchUser = async (req, res) => {
    const { query } = req.query; // Extract the query from URL parameters
    console.log(query);
    
    try {
        if (!query) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Search in both 'name' and 'email' fields using regex and case-insensitivity
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found matching the query' });
        }

        res.status(200).json({ message: "Users found", users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error while searching user" });
    }
};

module.exports = {searchUser};
