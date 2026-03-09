"use client";

import { useState } from "react";
import {
	Grid,
	Box,
	Typography,
	Paper,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import type { DashboardData, CountryMetric } from "@/types";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
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

export default function CountryPage({ data: D }: Props) {
	const [selectedCountry, setSelectedCountry] = useState(D.countries[0]);
	const [metric, setMetric] = useState<CountryMetric>("industry");

	const top6Datasets = D.top6_countries.map((c, i) => ({
		label: c,
		data: D.country_trend[c],
		borderColor: COLORS[i],
		backgroundColor: "transparent",
		tension: 0.4,
		borderWidth: 2,
		pointRadius: 2,
	}));

	const perCapitaData = {
		labels: D.per_capita_countries,
		datasets: [
			{
				label: "Mt per million people",
				data: D.per_capita_values,
				backgroundColor: D.per_capita_countries.map(
					(_, i) => COLORS[i % COLORS.length],
				),
				borderRadius: 5,
				borderColor: "transparent",
			},
		],
	};

	const gasStackDatasets = D.gas_names.map((g, gi) => ({
		label: g,
		data: D.top6_countries.map((c) => {
			const globalGasShare =
				D.gas_totals[gi] / D.gas_totals.reduce((a, b) => a + b, 0);
			const idx = D.countries.indexOf(c);
			return idx >= 0
				? +(D.country_totals[idx] * globalGasShare).toFixed(1)
				: 0;
		}),
		backgroundColor: GAS_COLORS[g] ?? "#888",
		borderColor: "#0D1117",
		borderWidth: 1,
	}));

	// Country deep dive
	const countryIdx = D.countries.indexOf(selectedCountry);
	const countryShare =
		D.country_totals[countryIdx] / D.country_totals.reduce((a, b) => a + b, 0);

	const detailDatasets =
		metric === "industry"
			? D.industry_names.map((ind) => ({
					label: ind,
					data: D.industry_trend[ind].map(
						(v) => +(v * countryShare).toFixed(1),
					),
					backgroundColor: INDUSTRY_COLORS[ind] ?? "#888",
					borderColor: "#0D1117",
					borderWidth: 1,
				}))
			: D.gas_names.map((g) => ({
					label: g,
					data: D.gas_trend[g].map((v) => +(v * countryShare).toFixed(1)),
					backgroundColor: GAS_COLORS[g] ?? "#888",
					borderColor: "#0D1117",
					borderWidth: 1,
				}));

	const maxVal = Math.max(...D.country_totals);

	return (
		<Box>
			<SectionTitle>Country Overview</SectionTitle>
			<Grid container spacing={2.25} sx={{ mb: 2.25 }}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Top 6 Country Emission Trends
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Annual totals for the six largest emitters
						</Typography>
						<LineChart
							data={{ labels: D.years, datasets: top6Datasets }}
							options={{
								plugins: { legend: { position: "bottom" } },
								scales: { y: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Total Emissions Ranking
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Cumulative 2000–2023 (Mt CO₂e)
						</Typography>
						<Box>
							{D.countries.map((c, i) => {
								const val = D.country_totals[i];
								const pct = (val / maxVal) * 100;
								const color = COLORS[i % COLORS.length];
								return (
									<Box
										key={c}
										sx={{
											display: "grid",
											gridTemplateColumns: "28px 1fr 60px 120px",
											alignItems: "center",
											gap: 1,
											py: 0.75,
											borderBottom: "1px solid var(--border)",
											"&:last-child": { borderBottom: "none" },
										}}>
										<Box
											sx={{
												width: 22,
												height: 22,
												borderRadius: 1,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: 9,
												fontWeight: 700,
												fontFamily: "var(--font-mono)",
												background: hexToRgba(color, 0.15),
												color,
											}}>
											{i + 1}
										</Box>
										<Typography variant="caption" sx={{ fontWeight: 600 }}>
											{c}
										</Typography>
										<Typography
											variant="caption"
											sx={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
											{(val / 1000).toFixed(1)}k
										</Typography>
										<Box
											sx={{
												height: 6,
												borderRadius: 1,
												background: color,
												width: `${pct}%`,
											}}
										/>
									</Box>
								);
							})}
						</Box>
					</Paper>
				</Grid>
			</Grid>

			<SectionTitle>Per-Capita & Gas Breakdown</SectionTitle>
			<Grid container spacing={2.25} sx={{ mb: 2.25 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Emissions Per Capita
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Total emissions ÷ population (Mt per million people)
						</Typography>
						<BarChart
							data={perCapitaData}
							options={{
								indexAxis: "y",
								plugins: { legend: { display: false } },
								scales: { x: { ticks: { callback: (v) => String(v) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Gas Mix by Country (Top 6)
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Stacked share of CO₂, CH₄, N₂O, HFCs, SF₆
						</Typography>
						<BarChart
							data={{ labels: D.top6_countries, datasets: gasStackDatasets }}
							options={{
								plugins: { legend: { position: "bottom" } },
								scales: {
									x: { stacked: true },
									y: {
										stacked: true,
										ticks: { callback: (v) => fmt(Number(v)) },
									},
								},
							}}
							height={340}
						/>
					</Paper>
				</Grid>
			</Grid>

			<SectionTitle>Interactive Explorer</SectionTitle>
			<Paper
				sx={{
					p: 2,
					borderRadius: 2,
					display: "flex",
					gap: 2,
					flexWrap: "wrap",
					alignItems: "center",
					mb: 2,
				}}>
				<FormControl size="small" sx={{ minWidth: 160 }}>
					<InputLabel sx={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
						COUNTRY
					</InputLabel>
					<Select
						value={selectedCountry}
						label="COUNTRY"
						onChange={(e) => setSelectedCountry(e.target.value)}
						sx={{ fontSize: 12 }}>
						{D.countries.map((c) => (
							<MenuItem key={c} value={c}>
								{c}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel sx={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
						METRIC
					</InputLabel>
					<Select
						value={metric}
						label="METRIC"
						onChange={(e) => setMetric(e.target.value as CountryMetric)}
						sx={{ fontSize: 12 }}>
						<MenuItem value="industry">By Industry</MenuItem>
						<MenuItem value="gas">By Gas Type</MenuItem>
					</Select>
				</FormControl>
			</Paper>

			<Paper sx={{ p: 2.5, borderRadius: 2 }}>
				<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
					{selectedCountry} — Emissions by{" "}
					{metric === "industry" ? "Industry" : "Gas Type"}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mb: 2 }}>
					Annual breakdown 2000–2023 (approximate based on national share)
				</Typography>
				<BarChart
					data={{ labels: D.years, datasets: detailDatasets }}
					options={{
						plugins: { legend: { position: "bottom" } },
						scales: {
							x: { stacked: true },
							y: { stacked: true, ticks: { callback: (v) => fmt(Number(v)) } },
						},
					}}
					height={340}
				/>
			</Paper>
		</Box>
	);
}
