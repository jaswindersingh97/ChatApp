const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model

// Controller for user signup
const signup = async (req, res) => {
    const { name,email, password } = req.body;
    try {
        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        
        // Save the user in the database
        const response = await newUser.save();
        res.status(201).json({ message: 'User signed up successfully' ,response:response });
    } catch (error) {
        res.status(500).json({ error: 'Error signing up user' });
    }
};

// Controller for user signin
const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'User signed in successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error signing in user' });
    }
};

module.exports = { signup, signin };
