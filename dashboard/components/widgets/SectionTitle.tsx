import { Box, Typography } from "@mui/material";
export default function SectionTitle({ children }: { children: string }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 1 }}>
			<Typography
				sx={{
					fontFamily: "var(--font-mono)",
					fontSize: 10,
					fontWeight: 700,
					color: "text.secondary",
					letterSpacing: 2,
					textTransform: "uppercase",
				}}>
				{children}
			</Typography>
			<Box sx={{ flex: 1, height: "1px", background: "var(--border)" }} />
		</Box>
	);
}
