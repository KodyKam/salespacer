// client/src/pages/PrivacyPolicy.jsx
import { Box, Typography, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Privacy Policy
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.5, mb: 4 }}>
        Last updated: May 2026
      </Typography>

      {[
        {
          title: "1. Information We Collect",
          body: `We collect your email address and password when you register. We also collect sales data you enter into the app, including sales volumes, daily summaries, and notes. Payment information is processed securely by Stripe and is never stored on our servers.`
        },
        {
          title: "2. How We Use Your Information",
          body: `Your data is used solely to provide the SalesPacer service — calculating your daily sales targets, tracking your progress, and generating your performance stats. We do not sell, rent, or share your personal information with third parties.`
        },
        {
          title: "3. Data Storage",
          body: `Your data is stored securely in MongoDB Atlas. Passwords are hashed using bcrypt and are never stored in plain text. We use JWT tokens for authentication.`
        },
        {
          title: "4. Payments",
          body: `Subscription payments are processed by Stripe. SalesPacer does not store your credit card details. Stripe's privacy policy applies to all payment data.`
        },
        {
          title: "5. Cookies",
          body: `SalesPacer uses localStorage to store your authentication token. We do not use tracking cookies or third-party advertising cookies.`
        },
        {
          title: "6. Your Rights",
          body: `You can delete your account and all associated data at any time by resetting your season and contacting us at support@salespacer.ca. We will permanently delete your data upon request.`
        },
        {
          title: "7. Contact",
          body: `For any privacy-related questions, contact us at support@salespacer.ca.`
        }
      ].map(({ title, body }) => (
        <Box key={title} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
            {body}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default PrivacyPolicy