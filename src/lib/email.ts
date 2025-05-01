import { COMPANY_NAME } from '@/app/data/config'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name: string, token: string) {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`
    await resend.emails.send({
      // from: 'no-reply@yourdomain.com',
      from: `${process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_FROM_ADDRESS}`,
      to: email,
      subject: `Welcome to ${COMPANY_NAME} - Verify your email address`,
      html: `
        <div>
          <h1>Hi ${name},</h1>
          <p>Thank you for signing up at ${COMPANY_NAME}! Please verify your email address by clicking the link below:</p>
          <p><b><a href="${verificationLink}">Verify Email</a></b></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <br/>
          <br/>
          <p>Thanks & Regards,</p>
          <p>${COMPANY_NAME} Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}