import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({ success: false, message: "Username is mandatory and should be a non-empty string"});
    };
    if (!email || typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ success: false, message: "Email is mandatory and should be a non-empty string"});
    };
    if (!password || typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ success: false, message: "Password is mandatory and should be a non-empty string"});
    };
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword});

    return res.status(201).json({ 
        success: true,
        message: "User registered successfully",
        data: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        } 

    })

    
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}