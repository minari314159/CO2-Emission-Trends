"use client";

import { useState } from "react";
import {
	Box,
	Tabs,
	Tab,
	AppBar,
	Toolbar,
	Typography,
	Chip,
} from "@mui/material";
import type { DashboardData, TabName } from "@/types";
import OverviewPage from "./pg/OverviewPage";
import CountryPage from "./pg/CountryPage";
import IndustryPage from "./pg/IndustryPage";
import GasPage from "./pg/GasPage";

interface DashboardProps {
	data: DashboardData;
}

const TABS: { value: TabName; label: string }[] = [
	{ value: "overview", label: "Overview" },
	{ value: "country", label: "By Country" },
	{ value: "industry", label: "By Industry" },
	{ value: "gas", label: "By Gas Type" },
];

export default function Dashboard({ data }: DashboardProps) {
	const [tab, setTab] = useState<TabName>("overview");

	return (
		<Box sx={{ minHeight: "100vh", background: "var(--bg)" }}>
			{/* Header */}
			<AppBar
				position="sticky"
				sx={{
					background: "var(--surface)",
					borderBottom: "1px solid var(--border)",
					boxShadow: "none",
				}}>
				<Toolbar sx={{ gap: 2, minHeight: "64px !important" }}>
					{/* Logo */}
					<Box
						sx={{
							width: 40,
							height: 40,
							borderRadius: 2,
							background: "linear-gradient(135deg,#1a4a1a,#0d2e0d)",
							border: "1px solid var(--green)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 18,
							flexShrink: 0,
						}}>
						🌍
					</Box>

					{/* Title */}
					<Box>
						<Typography
							sx={{
								fontFamily: "var(--font-mono)",
								fontSize: 15,
								fontWeight: 700,
								letterSpacing: 0.5,
							}}>
							GHG EMISSIONS DASHBOARD
						</Typography>
						<Typography
							sx={{
								fontFamily: "var(--font-mono)",
								fontSize: 10,
								color: "text.secondary",
								mt: "1px",
							}}>
							2000–2023 · 15 Countries · 8 Industries · 5 Gas Types
						</Typography>
					</Box>

					{/* Live badge */}
					<Chip
						label="● LIVE DATA"
						size="small"
						sx={{
							ml: "auto",
							fontFamily: "var(--font-mono)",
							fontSize: 10,
							letterSpacing: 0.5,
							background: "#0d2e0d",
							border: "1px solid var(--green)",
							color: "var(--green)",
							borderRadius: 1,
						}}
					/>

					{/* Tabs */}
					<Tabs
						value={tab}
						onChange={(_, v) => setTab(v)}
						sx={{
							ml: 3,
							"& .MuiTab-root": {
								fontSize: 12,
								fontWeight: 600,
								minHeight: 40,
								color: "text.secondary",
								textTransform: "none",
							},
							"& .Mui-selected": { color: "primary.main" },
							"& .MuiTabs-indicator": { background: "primary.main" },
						}}>
						{TABS.map((t) => (
							<Tab key={t.value} value={t.value} label={t.label} />
						))}
					</Tabs>
				</Toolbar>
			</AppBar>

			{/* Page content */}
			<Box sx={{ maxWidth: 1400, mx: "auto", p: "28px 32px" }}>
				{tab === "overview" && <OverviewPage data={data} />}
				{tab === "country" && <CountryPage data={data} />}
				{tab === "industry" && <IndustryPage data={data} />}
				{tab === "gas" && <GasPage data={data} />}
			</Box>
		</Box>
	);
}
