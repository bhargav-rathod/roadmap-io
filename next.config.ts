/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other config options...
  serverRuntimeConfig: {
    // Will only be available on the server side
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  }
}

module.exports = nextConfig