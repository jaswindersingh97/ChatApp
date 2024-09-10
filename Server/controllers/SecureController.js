const User = require('./../models/User');

const searchUser = async (req, res) => {
    const { query } = req.query; // Extract the query from URL query string
    
    try {
        // Validate the query parameter
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Search in both 'name' and 'email' fields using regex and case-insensitivity
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        // Handle case when no users are found
        if (users.length === 0) {
            return res.status(200).json({ message: 'No users found', users: [] });
        }

        // Return the found users
        res.status(200).json({ message: "Users found", users });
    } catch (error) {
        console.error('Error while searching users:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Users = async (req, res) =>{
    try {
        
        const users = await User.find();

        // Handle case when no users are found
        if (users.length === 0) {
            return res.status(200).json({ message: 'No users found', users: [] });
        }

        // Return the found users
        res.status(200).json({ message: "Users found", users });
    } catch (error) {
        console.error('Error while searching users:', error);
        res.status(500).json({ error: "Internal server error" });
    }

};

module.exports = { searchUser ,Users };
