// Import necessary modules and functions
import bcrypt from 'bcryptjs'; // bcrypt for password hashing
import crypto from 'crypto'; // crypto for generating random tokens

// Local imports
import { User } from '../models/user.model.js'; // User model for database interactions
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'; // Utility function to generate JWT and set cookie

// Import email sending functions from the Mailtrap module
import { 
    sendVerificationEmail, 
    sendwelcomeEmail, 
    sendResetPasswordEmail, 
    sendPasswordResetSuccessEmail 
} from '../mailtrap/emails.js';

// Signup function to handle user registration
export const signup = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        // Validate input fields
        if (!email || !password || !name) {
            throw new Error("Please provide all the required fields");
        }

        // Check if the user already exists in the database
        const userAlreadyExist = await User.findOne({ email });
        console.log("User already exists:", userAlreadyExist);

        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token for email verification
        const verificationToken = Math.floor(10000 + Math.random() * 90000).toString();

        // Create a new user instance and save it to the database
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
        });

        await user.save();

        // Generate JWT token and set it as a cookie in the response
        generateTokenAndSetCookie(res, user._id);

        // Send verification email to the user
        await sendVerificationEmail(user.email, verificationToken);

        // Respond with the created user data, excluding the password
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc, // Spread the user object fields
                password: undefined, // Exclude the password field
            }
        });

    } catch (error) {
        // Handle errors and respond with an error message
        res.status(400).json({ success: false, message: error.message });
    }
};

// Function to handle email verification
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        // Find the user with the provided verification token and ensure it's not expired
        const user = await User.findOne({
            verificationToken: code, 
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
        }

        // Mark the user as verified and clear the verification token and expiry date
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        // Send a welcome email to the user
        const verify = await sendwelcomeEmail(user.email, user.name);
        
        // Respond with success message and user data, excluding the password
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc, // Spread the user object fields
                password: undefined, // Exclude the password field
            },
        });

        console.log("Email verified successfully", verify);

    } catch (error) {
        // Handle errors during email verification
        console.error("Error verifying email:", error);
        res.status(400).json({ success: false, message: "Server error" });
    }
};

// Function for handling user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate JWT token and set it as a cookie in the response
        generateTokenAndSetCookie(res, user._id);

        // Update the user's last login time
        user.lastlogin = Date.now();
        await user.save();

        // Respond with success message and user data, excluding the password
        res.status(200).json({ 
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        // Handle errors during login
        console.error("Error logging in:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Function for handling user logout
export const loginout = async (req, res) => {
    // Clear the authentication token from the cookies
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Function for handling forgotten password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate a reset token and set it in the database
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpires = Date.now() + 1 * 60 * 60 * 1000; // Token expires in 1 hour

        user.resetpasswordToken = resetToken;
        user.resetpasswordExpiresAt = resetTokenExpires;

        await user.save();

        // Send password reset email to the user
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset email sent successfully" });
        
    } catch (error) {
        // Handle errors during password reset email sending
        console.error("Error sending password reset email:", error);
        res.status(400).json({ success: false, message: error.message });      
    }
};

// Function for handling password reset
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find the user with the provided reset token and ensure it's not expired
        const user = await User.findOne({
            resetpasswordToken: token,
            resetpasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        } 

        // Hash the new password and update the user's password in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetpasswordToken = undefined;
        user.resetpasswordExpiresAt = undefined;
        await user.save();

        // Send success email after password reset
        await sendPasswordResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        // Handle errors during password reset
        console.error("Error resetting password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

// Function for checking if the user is authenticated
export const checkAuth = async (req, res) => {
    try {
        // Find the user by ID, excluding the password field
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Respond with the user data
        res.status(200).json({ success: true, user });
    } catch (error) {
        // Handle errors during authentication check
        console.error("Error checking authentication:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}
