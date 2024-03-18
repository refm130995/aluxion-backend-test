import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: "your-email@example.com",
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `http://example.com/reset-password?token=${token}`;

    await this.sendMail(
      to,
      "Reset Your Password",
      `Please use the following link to reset your password: ${resetUrl}`,
      `<p>Please use the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    );
  }
}
