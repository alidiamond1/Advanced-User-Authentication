import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken)=>{
    const recipient = ({email})

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [recipient],
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully" , response)
    } catch (error) {
         console.error("Error sending Verification", error)
        throw new Error(`Error sending Verification email: ${error}`);  
    }
}

export const sendwelcomeEmail = async (email, name)=>{
    const recipient = ({email})

    try {
        
        const response = await mailtrapClient.send({
            from : sender,
            to : [recipient],
            template_uuid : "8827612d-3c0b-4e6c-a2bb-7e5307aceb01",
            template_variables: {
                "company_info_name": "Alidiamond Company",
                "name": name
              }
        })
        console.log("Welcome email sent successfully", response)
        
    } catch (error) {
        console.error("Error sending welcome email", error)
        throw new Error(`Error sending welcome email: ${error}`)
        
    }
}


export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = ({ email });

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [recipient],
            subject: "Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });
        console.log("Password reset email sent successfully", response);
        
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`);
        
    }
};


export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = ({ email });

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [recipient],
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });
        console.log("Password reset success email sent successfully", response);

    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);

    }
};