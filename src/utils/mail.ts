import nodemailer from 'nodemailer';

const FRONTEND_APP_BASE_URL = process.env.FRONTEND_APP_BASE_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const GeneratePasswordResetMail = async (email: string, token: string) => {
  if (!FRONTEND_APP_BASE_URL || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Missing environment variables");
  }

  const confirmLink = `${FRONTEND_APP_BASE_URL}/auth/new-password?token=${token}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2a3a5e;">Smart Hire Password Reset</h2>
      <p>Hello,</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${confirmLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #2a3a5e; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Reset Password
      </a>
      <div style="margin-top: 10px" >Or visit this link</div>
      <div>${confirmLink}</div>
      <p style="margin-top: 20px;">If you didn&apos;t request this, you can ignore this email.</p>
      <p>Thanks,<br/>Smart Hire Team</p>
    </div>
  `;

  const mailOptions = {
    from: `"Smart Hire" <${EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Smart Hire Password",
    html: htmlBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return null;
  }
};

export const GenerateAccountVerificationMail = async(email: string, token: string) => {
  if (!FRONTEND_APP_BASE_URL || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Missing environment variables");
  }

  const confirmLink = `${FRONTEND_APP_BASE_URL}/auth/email-verification?token=${token}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2a3a5e;">Smart Hire Password Reset</h2>
      <p>Hello,</p>
      <p>Click the button below to verify your email:</p>
      <a href="${confirmLink}" 
        style="display: inline-block; padding: 10px 20px; background-color: #2a3a5e; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Verify email
      </a>
      <div style="margin-top: 10px" >Or visit this link</div>
      <div>${confirmLink}</div>
      <p style="margin-top: 20px;">If you didn&apos;t request this, you can ignore this email.</p>
      <p>Thanks,<br/>Smart Hire Team</p>
    </div>
  `;

  const mailOptions = {
    from: `"Smart Hire" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify your Smart Hire email",
    html: htmlBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email verification mail sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email verfication mail: ", error);
    return null;
  }
}