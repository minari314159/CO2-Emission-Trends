"use client";

import { Paper, Typography } from "@mui/material";

interface StatCardProps {
	label: string;
	value: string | number;
	unit: string;
	accentColor: string;
}

export default function StatCard({
	label,
	value,
	unit,
	accentColor,
}: StatCardProps) {
	return (
		<Paper
			sx={{
				p: 2,
				borderRadius: 2,
				position: "relative",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "2px",
					background: accentColor,
				},
			}}>
			<Typography
				variant="caption"
				sx={{
					fontFamily: "var(--font-mono)",
					fontSize: "10px",
					letterSpacing: "0.8px",
					textTransform: "uppercase",
					color: "text.secondary",
					display: "block",
					mb: 0.75,
				}}>
				{label}
			</Typography>
			<Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
				{value}
			</Typography>
			<Typography
				variant="caption"
				sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
				{unit}
			</Typography>
		</Paper>
	);
}
