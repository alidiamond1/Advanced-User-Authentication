import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the userId to the request object for later use
        req.userId = decoded.userId;
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        // Log the error for debugging purposes
        console.log("Error in verifyToken:", error);

        // Send an unauthorized response if the token verification fails
        return res.status(401).json({ success: false, message: 'Invalid or expired token, Unauthorized' });
    }
};
