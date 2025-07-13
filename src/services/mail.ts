import nodemailer from "nodemailer"

interface InvitationEmailData {
  recipientEmail: string
  otp: string
  expiresAt: Date
  invitedBy: string
}

interface AlertEmailData {
  recipientEmail: string
  recipientName?: string
  alertType: string
  alertMessage: string
  deviceSerial: string
  location: string
  severity: string
  timestamp: Date
}

interface PasswordResetData {
  recipientEmail: string
  recipientName?: string
  resetToken: string
  expiresAt: Date
}

export class EmailService {
  private static getTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Missing SMTP configuration in environment variables.");
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private static getFromEmail() {
    if (!process.env.FROM_EMAIL) {
      throw new Error("Missing FROM_EMAIL in environment variables.");
    }
    return process.env.FROM_EMAIL;
  }

  private static getSupportEmail() {
    if (!process.env.SUPPORT_EMAIL) {
      throw new Error("Missing SUPPORT_EMAIL in environment variables.");
    }
    return process.env.SUPPORT_EMAIL;
  }

  private static getAppUrl() {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("Missing NEXT_PUBLIC_APP_URL in environment variables.");
    }
    return process.env.NEXT_PUBLIC_APP_URL;
  }


  private static getBaseEmailTemplate(content: string) {
    const APP_URL = this.getAppUrl();
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>eleGuard</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
            .logo { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 16px; }
            .logo-icon { width: 48px; height: 48px; margin-top: 1px ; border-radius: 12px; font-size: 24px; }
            .logo-text { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
            .header-subtitle { font-size: 16px; opacity: 0.9; font-weight: 400; }
            .content { padding: 40px 30px; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer-text { color: #64748b; font-size: 14px; margin-bottom: 16px; }
            @media (max-width: 600px) { .container { margin: 20px; border-radius: 12px; } .header, .content, .footer { padding: 24px 20px; } .logo-text { font-size: 24px; } }
        </style>
    </head>
    <body>
        <div style="padding: 40px 20px;">
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <div class="logo-icon">🛡️</div>
                        <div class="logo-text">eleGuard</div>
                    </div>
                    <div class="header-subtitle">Human-Elephant Conflict Management</div>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    <div class="footer-text">
                        This email was sent by eleGuard HEC Management System
                    </div>
                    <div class="footer-text">
                        © ${new Date().getFullYear()} eleGuard. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
  }

  static async sendInvitationEmail(data: InvitationEmailData): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const FROM_EMAIL = this.getFromEmail();
      const SUPPORT_EMAIL = this.getSupportEmail();
      const APP_URL = this.getAppUrl();

      const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                You're Invited!
            </h1>
            <p style="font-size: 18px; color: #64748b; max-width: 400px; margin: 0 auto;">
                ${data.invitedBy} has invited you to join the eleGuard platform
            </p>
        </div>

        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">
            <div style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                Your Invitation Code
            </div>
            <div style="font-size: 48px; font-weight: 700; font-family: 'Monaco', 'Menlo', monospace; color: #667eea; letter-spacing: 8px; margin-bottom: 24px; text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);">
                ${data.otp}
            </div>
            <div style="font-size: 16px; color: #64748b; margin-bottom: 8px;">
                This invitation expires at: <b>${data.expiresAt.toLocaleString()}</b>
            </div>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}/signup" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: transform 0.2s;">
                Complete Registration →
            </a>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
                Need help? Contact our support team
            </p>
            <a href="mailto:${SUPPORT_EMAIL}" style="color: #667eea; text-decoration: none; font-weight: 500;">
                ${SUPPORT_EMAIL}
            </a>
        </div>
      `

      const htmlContent = this.getBaseEmailTemplate(content)

      if (process.env.NODE_ENV === "development") {
        console.log("📧 [DEV MODE] Invitation Email would be sent to:", data.recipientEmail)
        console.log("📧 OTP:", data.otp)
        console.log("📧 Expires:", data.expiresAt)
        return true
      }

      const mailOptions = {
        from: FROM_EMAIL,
        to: data.recipientEmail,
        subject: `Welcome to eleGuard - Your Invitation Code: ${data.otp}`,
        html: htmlContent,
      }

      const info = await transporter.sendMail(mailOptions)
      if (!info || !info.messageId) {
        console.log("Imeshindwa kutuma Email Kudadeki")
        return false
      }
      console.log("Kama imefika hapa basi imetuma vya ukweli ukweli")
      console.log(info)
      return true
    } catch (error) {
      console.error("❌ Failed to send invitation email:", error)
      return false
    }
  }

  static async sendAlertEmail(data: AlertEmailData): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const FROM_EMAIL = this.getFromEmail();
      const APP_URL = this.getAppUrl();
      const SUPPORT_EMAIL = this.getSupportEmail();

      const severityColors = {
        low: "#059669",
        medium: "#d97706",
        high: "#dc2626",
        critical: "#991b1b",
      }

      const severityEmojis = {
        low: "🟢",
        medium: "🟡",
        high: "🟠",
        critical: "🔴",
      }

      const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: ${severityColors[data.severity as keyof typeof severityColors]}; border-radius: 50%; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                ${severityEmojis[data.severity as keyof typeof severityEmojis]}
            </div>
            <h1 style="font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                ${data.severity.toUpperCase()} Alert
            </h1>
            <p style="font-size: 18px; color: #64748b;">
                Device ${data.deviceSerial} requires immediate attention
            </p>
        </div>

        <div style="background: #fef2f2; border: 2px solid ${severityColors[data.severity as keyof typeof severityColors]}; border-radius: 16px; padding: 24px; margin: 24px 0;">
            <h2 style="color: ${severityColors[data.severity as keyof typeof severityColors]}; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
                Alert Details
            </h2>
            <div style="space-y: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fee2e2;">
                    <span style="font-weight: 500; color: #374151;">Type:</span>
                    <span style="color: #1f2937;">${data.alertType}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fee2e2;">
                    <span style="font-weight: 500; color: #374151;">Device:</span>
                    <span style="color: #1f2937;">${data.deviceSerial}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fee2e2;">
                    <span style="font-weight: 500; color: #374151;">Location:</span>
                    <span style="color: #1f2937;">${data.location}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span style="font-weight: 500; color: #374151;">Time:</span>
                    <span style="color: #1f2937;">${data.timestamp.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">Message:</h3>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                ${data.alertMessage}
            </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}/alerts" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                View in Dashboard →
            </a>
        </div>
      `

      const htmlContent = this.getBaseEmailTemplate(content)

      if (process.env.NODE_ENV === "development") {
        console.log("📧 [DEV MODE] Alert Email would be sent to:", data.recipientEmail)
        console.log("📧 Alert:", data.alertMessage)
        return true
      }

      const mailOptions = {
        from: FROM_EMAIL,
        to: data.recipientEmail,
        subject: `🚨 ${data.severity.toUpperCase()} Alert: ${data.deviceSerial} - ${data.alertType}`,
        html: htmlContent,
      }

      const info = await transporter.sendMail(mailOptions)
      if (!info || !info.messageId) {
        return false
      }
      return true
    } catch (error) {
      console.error("❌ Failed to send alert email:", error)
      return false
    }
  }

  static async sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const FROM_EMAIL = this.getFromEmail();
      const APP_URL = this.getAppUrl();
      const resetUrl = `${APP_URL}/reset-password?token=${data.resetToken}`

      const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                🔐
            </div>
            <h1 style="font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Reset Your Password
            </h1>
            <p style="font-size: 18px; color: #64748b;">
                We received a request to reset your password
            </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                Reset Password →
            </a>
        </div>

        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <span style="font-size: 20px;">🔒</span>
                <span style="font-weight: 600; color: #dc2626;">Security Notice</span>
            </div>
            <ul style="color: #dc2626; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>This reset link expires in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
            </ul>
        </div>
      `

      const htmlContent = this.getBaseEmailTemplate(content)

      if (process.env.NODE_ENV === "development") {
        console.log("📧 [DEV MODE] Password Reset Email would be sent to:", data.recipientEmail)
        console.log("📧 Reset URL:", resetUrl)
        return true
      }

      const mailOptions = {
        from: FROM_EMAIL,
        to: data.recipientEmail,
        subject: "Reset Your eleGuard Password",
        html: htmlContent,
      }

      const info = await transporter.sendMail(mailOptions)
      if (!info || !info.messageId) {
        return false
      }
      return true
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error)
      return false
    }
  }
}
