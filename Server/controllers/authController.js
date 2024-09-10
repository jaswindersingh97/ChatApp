const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const User = require('../models/User'); // Assuming you have a User model

// Secret key for signing JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // You should store this in a secure place, like environment variables
// Controller for user signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;
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
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error signing up user', error });
    }
};

// Controller for user signin with JWT
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token if the credentials are valid
        const token = jwt.sign(
            { _id: user._id,
              userName: user.name,  
                email: user.email },  // Payload data
            JWT_SECRET,                               // Secret key
            { expiresIn: '1h' }                       // Token expiration time (1 hour here)
        );

        res.status(200).json({ 
            message: 'User signed in successfully', 
            token: token   // Send the JWT token to the client
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error signing in user' });
    }
};




module.exports = { signup, signin };
