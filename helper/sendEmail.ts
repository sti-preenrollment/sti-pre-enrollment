import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function sendEmail(toEmail: string, otpCode: string) {
  try {
    await transporter.sendMail({
      from: "STI College Calamba Pre-Enrollment <noreply@sticalambapreenrollment.com>",
      to: toEmail,
      subject: "Your verification code",
      html: `<p>This is your otp code:</p><p style="color:#0071bc;font-size:25px;letter-spacing:2px;"><b>${otpCode}</b></p><p>This will expire in <b>1 hour</b></p>`,
    });
  } catch (error) {
    throw error;
  }
}
