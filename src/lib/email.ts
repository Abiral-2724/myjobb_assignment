import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import OTPEmail from '@/emails/OTPEmail';
import ConfirmationEmail from '@/emails/ConfirmationEmail';

// Define environment variables with non-null assertions (you can also use a safer runtime check)
const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const emailHtml = await render(OTPEmail({ otp }));

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Your OTP Code - myjobb AI',
    html: emailHtml,
  });
}

// Send confirmation email
export async function sendConfirmationEmail(email: string): Promise<void> {
  const emailHtml = await render(ConfirmationEmail({ email }));

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Welcome to myjobb AI!',
    html: emailHtml,
  });
}
