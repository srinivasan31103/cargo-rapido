/**
 * Email Service Utility
 * This is a placeholder for email sending functionality
 * In production, integrate with services like:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Nodemailer with SMTP
 */

// For development, we'll log emails to console
const sendEmail = async ({ to, subject, text, html }) => {
  console.log('===== EMAIL SENT =====');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  if (html) {
    console.log(`HTML: ${html}`);
  }
  console.log('======================');

  // In production, implement actual email sending
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
    html
  };

  await sgMail.send(msg);
  */

  return { success: true };
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to CargoRapido!';
  const text = `Hello ${user.name},\n\nWelcome to CargoRapido! We're excited to have you on board.\n\nBest regards,\nThe CargoRapido Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to CargoRapido!</h2>
      <p>Hello ${user.name},</p>
      <p>We're excited to have you on board! Start booking your first delivery today.</p>
      <p>Best regards,<br/>The CargoRapido Team</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const subject = 'Password Reset Request - CargoRapido';
  const text = `You requested a password reset. Click the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <p><strong>This link will expire in 1 hour.</strong></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br/>The CargoRapido Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (user, booking) => {
  const subject = `Booking Confirmed - ${booking.bookingId}`;
  const text = `Hello ${user.name},\n\nYour booking has been confirmed!\n\nBooking ID: ${booking.bookingId}\nPickup: ${booking.pickup.address}\nDrop: ${booking.drop.address}\nAmount: ₹${booking.pricing.total}\n\nThank you for choosing CargoRapido!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Confirmed!</h2>
      <p>Hello ${user.name},</p>
      <p>Your booking has been confirmed.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Pickup:</strong> ${booking.pickup.address}</p>
        <p><strong>Drop:</strong> ${booking.drop.address}</p>
        <p><strong>Amount:</strong> ₹${booking.pricing.total}</p>
      </div>
      <p>Thank you for choosing CargoRapido!</p>
      <p>Best regards,<br/>The CargoRapido Team</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

// Send KYC approval email to driver
export const sendKYCApprovalEmail = async (driver) => {
  const subject = 'KYC Approved - CargoRapido';
  const text = `Hello ${driver.name},\n\nGreat news! Your KYC has been approved. You can now start accepting deliveries.\n\nBest regards,\nThe CargoRapido Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>KYC Approved!</h2>
      <p>Hello ${driver.name},</p>
      <p>Great news! Your KYC has been approved. You can now start accepting deliveries.</p>
      <p>Best regards,<br/>The CargoRapido Team</p>
    </div>
  `;

  return sendEmail({ to: driver.email, subject, text, html });
};

// Send KYC rejection email to driver
export const sendKYCRejectionEmail = async (driver, reason) => {
  const subject = 'KYC Update - CargoRapido';
  const text = `Hello ${driver.name},\n\nYour KYC documents require resubmission.\n\nReason: ${reason}\n\nPlease update your documents in the app.\n\nBest regards,\nThe CargoRapido Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>KYC Update Required</h2>
      <p>Hello ${driver.name},</p>
      <p>Your KYC documents require resubmission.</p>
      <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
        <strong>Reason:</strong> ${reason}
      </div>
      <p>Please update your documents in the app.</p>
      <p>Best regards,<br/>The CargoRapido Team</p>
    </div>
  `;

  return sendEmail({ to: driver.email, subject, text, html });
};

export default sendEmail;
