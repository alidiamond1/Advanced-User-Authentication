import express from 'express';
import { 
    login, 
    signup, 
    loginout, 
    verifyEmail,  
    forgotPassword, 
    resetPassword, 
    checkAuth 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


// Routes for authentication and user management
router.get("/check-auth", verifyToken, checkAuth);

router.post('/signup' ,signup);
router.post('/login' , login);
router.post('/loginout' , loginout);
router.post("/verify-email", verifyEmail)
router.post("/forgot-password/", forgotPassword)

router.post("/reset-password/:token", resetPassword)

export default router