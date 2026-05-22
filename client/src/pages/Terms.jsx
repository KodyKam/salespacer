// client/src/pages/Terms.jsx
import { Box, Typography, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"

const Terms = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        Terms of Service
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.5, mb: 4 }}>
        Last updated: May 2026
      </Typography>

      {[
        {
          title: "1. Acceptance of Terms",
          body: `By using SalesPacer, you agree to these Terms of Service. If you do not agree, please do not use the service.`
        },
        {
          title: "2. Description of Service",
          body: `SalesPacer is a sales tracking application that helps commission-based salespeople track daily sales volumes, calculate targets, and monitor performance. A free tier and a paid Pro tier are available.`
        },
        {
          title: "3. User Accounts",
          body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when registering and to keep your information up to date.`
        },
        {
          title: "4. Subscriptions and Billing",
          body: `Pro features require a paid subscription at $4.99/month or $49.99/year (CAD). Subscriptions are billed automatically through Stripe. You may cancel at any time and will retain access until the end of your billing period.`
        },
        {
          title: "5. Acceptable Use",
          body: `You agree not to misuse SalesPacer, attempt to access other users' data, reverse engineer the application, or use the service for any unlawful purpose.`
        },
        {
          title: "6. Data Accuracy",
          body: `SalesPacer provides calculations based on data you enter. We are not responsible for financial decisions made based on the app's output. Always verify income figures with your employer or accountant.`
        },
        {
          title: "7. Termination",
          body: `We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting support@salespacer.ca.`
        },
        {
          title: "8. Limitation of Liability",
          body: `SalesPacer is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.`
        },
        {
          title: "9. Changes to Terms",
          body: `We may update these terms from time to time. Continued use of SalesPacer after changes constitutes acceptance of the new terms.`
        },
        {
          title: "10. Contact",
          body: `For any questions about these terms, contact us at support@salespacer.ca.`
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

export default Terms