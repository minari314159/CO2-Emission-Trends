"use client";

import { Grid, Box, Typography, Paper } from "@mui/material";
import { useMemo } from "react";
import type { DashboardData } from "@/types";
import StatCard from "@/components/widgets/StatCard";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import {
	COLORS,
	GAS_COLORS,
	INDUSTRY_COLORS,
	hexToRgba,
	fmt,
} from "@/lib/colours";

function SectionTitle({ children }: { children: string }) {
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

interface Props {
	data: DashboardData;
}

export default function OverviewPage({ data: D }: Props) {
	const kpis = [
		{
			label: "Total Emissions",
			value: `${D.kpi_total} Gt`,
			unit: "Gt CO₂e (2000–2023)",
			color: "#3fb950",
		},
		{
			label: "Peak Year",
			value: D.kpi_peak_year,
			unit: "Highest annual total",
			color: "#58a6ff",
		},
		{
			label: "Top Emitter",
			value: D.kpi_top_country,
			unit: "Cumulative leader",
			color: "#f78166",
		},
		{
			label: "Growth (2000→2023)",
			value: `${D.kpi_recent_change > 0 ? "+" : ""}${D.kpi_recent_change}%`,
			unit: "Recent vs early period",
			color: "#ffa657",
		},
		{
			label: "Countries Tracked",
			value: D.kpi_countries,
			unit: "Across 6 regions",
			color: "#d2a8ff",
		},
		{
			label: "Years of Data",
			value: D.kpi_years,
			unit: "2000 – 2023",
			color: "#e3b341",
		},
	];

	const insights = [
		{
			icon: "📈",
			title: "Asia dominates",
			text: "— China, India, and Indonesia account for over 40% of all tracked emissions",
		},
		{
			icon: "⚡",
			title: "Energy is the largest sector",
			text: "— responsible for roughly 22% of total emissions",
		},
		{
			icon: "🌡️",
			title: "CO₂ is the biggest culprit",
			text: "— making up ~40% of all emissions, driven by energy and transport",
		},
		{
			icon: "📉",
			title: "Europe declining",
			text: "— UK, France, and Germany all show consistent downward trends since 2005",
		},
	];

	// Chart data
	// Then replace your plain object declarations with useMemo versions:

	const globalTrendData = useMemo(
		() => ({
			labels: D.years,
			datasets: [
				{
					label: "Global Emissions (Mt)",
					data: D.global_emissions,
					borderColor: "#58A6FF",
					backgroundColor: hexToRgba("#58A6FF", 0.1),
					fill: true,
					tension: 0.4,
					pointRadius: 2,
					borderWidth: 2.5,
				},
			],
		}),
		[D.years, D.global_emissions],
	);

	const yoyColors = useMemo(
		() => D.yoy_pct.map((v) => hexToRgba(v >= 0 ? "#F78166" : "#3FB950", 0.75)),
		[D.yoy_pct],
	);

	const yoyData = useMemo(
		() => ({
			labels: D.years,
			datasets: [
				{
					label: "YoY %",
					data: D.yoy_pct,
					backgroundColor: yoyColors,
					borderColor: "transparent",
					borderRadius: 3,
				},
			],
		}),
		[D.years, D.yoy_pct, yoyColors],
	);

	const gasPieData = useMemo(
		() => ({
			labels: D.gases,
			datasets: [
				{
					data: D.gas_totals,
					backgroundColor: D.gases.map((g) => GAS_COLORS[g] ?? "#888"),
					borderColor: "#0D1117",
					borderWidth: 3,
				},
			],
		}),
		[D.gases, D.gas_totals],
	);

	const indPieData = useMemo(
		() => ({
			labels: D.industries,
			datasets: [
				{
					data: D.industry_totals,
					backgroundColor: D.industries.map(
						(i) => INDUSTRY_COLORS[i] ?? "#888",
					),
					borderColor: "#0D1117",
					borderWidth: 3,
				},
			],
		}),
		[D.industries, D.industry_totals],
	);

	const regionDatasets = useMemo(
		() =>
			D.region_names.map((r, i) => ({
				label: r,
				data: D.region_trend[r],
				backgroundColor: hexToRgba(COLORS[i], 0.65),
				borderColor: COLORS[i],
				fill: true,
				tension: 0.4,
				borderWidth: 1.5,
				pointRadius: 0,
			})),
		[D.region_names, D.region_trend],
	);

	return (
		<Box>
			{/* KPIs */}
			<Grid container spacing={1.75} sx={{ mb: 3.5 }}>
				{kpis.map((k) => (
					<Grid size={{ xs: 12, sm: 4, md: 2 }} key={k.label}>
						<StatCard
							label={k.label}
							value={k.value}
							unit={k.unit}
							accentColor={k.color}
						/>
					</Grid>
				))}
			</Grid>

			{/* Insight row */}
			<Grid container spacing={1.25} sx={{ mb: 2.5 }}>
				{insights.map((ins) => (
					<Grid size={{ xs: 12, sm: 6, md: 3 }} key={ins.title}>
						<Paper
							sx={{
								p: 1.5,
								display: "flex",
								alignItems: "center",
								gap: 1,
								borderRadius: 2,
							}}>
							<Typography sx={{ fontSize: 18 }}>{ins.icon}</Typography>
							<Typography variant="body2">
								<strong>{ins.title}</strong>
								<Typography
									component="span"
									variant="body2"
									color="text.secondary">
									{" "}
									{ins.text}
								</Typography>
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>

			<SectionTitle>Global Trends</SectionTitle>
			<Grid container spacing={2.25} sx={{ mb: 2.25 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Global Emissions Over Time
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Total annual emissions across all 15 countries, 2000–2023
						</Typography>
						<LineChart
							data={globalTrendData}
							options={{
								plugins: { legend: { display: false } },
								scales: { y: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Year-on-Year Change (%)
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Global emission growth rate — dips in 2009 (GFC) and 2020
							(COVID-19)
						</Typography>
						<BarChart
							data={yoyData}
							options={{
								plugins: { legend: { display: false } },
								scales: {
									y: { ticks: { callback: (v) => `${Number(v).toFixed(1)}%` } },
								},
							}}
						/>
					</Paper>
				</Grid>
			</Grid>

			<SectionTitle>Composition</SectionTitle>
			<Grid container spacing={2.25}>
				<Grid size={{ xs: 12, md: 3 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Emissions by Gas Type
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Cumulative share of each greenhouse gas
						</Typography>
						<DoughnutChart
							data={gasPieData}
							options={{
								cutout: "55%",
								plugins: { legend: { position: "bottom" } },
							}}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 3 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Emissions by Industry
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Which sectors drive the most pollution
						</Typography>
						<DoughnutChart
							data={indPieData}
							options={{
								cutout: "55%",
								plugins: {
									legend: { position: "bottom", labels: { font: { size: 9 } } },
								},
							}}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Emissions by Region
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Regional stacked area — 2000 to 2023
						</Typography>
						<LineChart
							data={{ labels: D.years, datasets: regionDatasets }}
							options={{
								plugins: {
									legend: { position: "bottom", labels: { font: { size: 9 } } },
								},
								scales: {
									x: { stacked: true },
									y: {
										stacked: true,
										ticks: { callback: (v) => fmt(Number(v)) },
									},
								},
							}}
						/>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
