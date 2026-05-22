// client/src/components/Footer.jsx
import { Box, Typography, Link } from "@mui/material"

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        mt: 4,
        borderTop: "1px solid #eee",
        textAlign: "center"
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.5, mb: 1 }}>
        © {new Date().getFullYear()} SalesPacer. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Link href="/privacy" underline="hover" variant="caption" sx={{ opacity: 0.5 }}>
          Privacy Policy
        </Link>
        <Link href="/terms" underline="hover" variant="caption" sx={{ opacity: 0.5 }}>
          Terms of Service
        </Link>
        <Link href="mailto:support@salespacer.ca" underline="hover" variant="caption" sx={{ opacity: 0.5 }}>
          Support
        </Link>
      </Box>
    </Box>
  )
}

export default Footer