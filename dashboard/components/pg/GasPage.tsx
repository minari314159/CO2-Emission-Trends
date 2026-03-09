"use client";

import { useState, useMemo } from "react";
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
import type { DashboardData } from "@/types";
import SectionTitle from "../widgets/SectionTitle";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { COLORS, GAS_COLORS, hexToRgba, fmt } from "@/lib/colours";

interface Props {
	data: DashboardData;
}

export default function GasPage({ data: D }: Props) {
	const [selectedGas, setSelectedGas] = useState(D.gas_names[0]);

	// Memoised — only recomputes if D.gas_names or D.gas_trend changes
	const gasLineDatasets = useMemo(
		() =>
			D.gas_names.map((g, i) => ({
				label: g,
				data: D.gas_trend[g],
				borderColor: GAS_COLORS[g] ?? COLORS[i],
				backgroundColor: "transparent",
				tension: 0.4,
				borderWidth: 2.5,
				pointRadius: 2,
			})),
		[D.gas_names, D.gas_trend],
	);

	// Memoised — only recomputes if D.gases or D.gas_totals changes
	const donutData = useMemo(
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

	// Derived values for the selected gas — recompute when selectedGas changes
	const gasIdx = useMemo(
		() => D.gas_names.indexOf(selectedGas),
		[D.gas_names, selectedGas],
	);

	const gasTotal = D.gas_totals[gasIdx];
	const gasColor = GAS_COLORS[selectedGas] ?? "#58A6FF";

	const totalCountries = useMemo(
		() => D.country_totals.reduce((a, b) => a + b, 0),
		[D.country_totals],
	);

	// Memoised — recomputes when selectedGas, gasTotal, or country data changes
	const countryData = useMemo(
		() => ({
			labels: D.countries,
			datasets: [
				{
					label: "Emissions (Mt)",
					data: D.countries.map(
						(_, ci) =>
							+((gasTotal * D.country_totals[ci]) / totalCountries).toFixed(1),
					),
					backgroundColor: hexToRgba(gasColor, 0.75),
					borderRadius: 4,
					borderColor: "transparent",
				},
			],
		}),
		[D.countries, D.country_totals, gasTotal, totalCountries, gasColor],
	);

	// Memoised — recomputes when selectedGas or industry data changes
	const industryData = useMemo(() => {
		const gasHmIdx = D.heatmap_gases.indexOf(selectedGas);
		return {
			labels: D.heatmap_industries,
			datasets: [
				{
					label: "Emissions (Mt)",
					data: D.heatmap_industries.map((ind, ri) => {
						const indTotalIdx = D.industry_names.indexOf(ind);
						const pct = gasHmIdx >= 0 ? D.heatmap_data[ri][gasHmIdx] / 100 : 0;
						return +((D.industry_totals[indTotalIdx] ?? 0) * pct).toFixed(1);
					}),
					backgroundColor: hexToRgba(gasColor, 0.75),
					borderRadius: 4,
					borderColor: "transparent",
				},
			],
		};
	}, [
		D.heatmap_gases,
		D.heatmap_industries,
		D.heatmap_data,
		D.industry_names,
		D.industry_totals,
		selectedGas,
		gasColor,
	]);

	return (
		<Box>
			<SectionTitle>Gas Type Overview</SectionTitle>
			<Grid container spacing={2.25} sx={{ mb: 2.25 }}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Each Gas Type Over Time
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Annual emission trends per greenhouse gas
						</Typography>
						<LineChart
							data={{ labels: D.years, datasets: gasLineDatasets }}
							options={{
								plugins: { legend: { position: "bottom" } },
								scales: { y: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Gas Totals (Donut)
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Cumulative share of all gas types
						</Typography>
						<DoughnutChart
							data={donutData}
							options={{
								cutout: "60%",
								plugins: { legend: { position: "bottom" } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
			</Grid>

			<SectionTitle>Gas by Country & Industry</SectionTitle>
			<Paper
				sx={{
					p: 2,
					borderRadius: 2,
					display: "flex",
					gap: 2,
					alignItems: "center",
					mb: 2,
				}}>
				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel sx={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
						GAS TYPE
					</InputLabel>
					<Select
						value={selectedGas}
						label="GAS TYPE"
						onChange={(e) => setSelectedGas(e.target.value)}
						sx={{ fontSize: 12 }}>
						{D.gas_names.map((g) => (
							<MenuItem key={g} value={g}>
								{g}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Paper>

			<Grid container spacing={2.25}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Top Countries for {selectedGas}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Cumulative emissions for this gas type by country
						</Typography>
						<BarChart
							data={countryData}
							options={{
								indexAxis: "y",
								plugins: { legend: { display: false } },
								scales: { x: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Top Industries for {selectedGas}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Cumulative emissions for this gas type by industry
						</Typography>
						<BarChart
							data={industryData}
							options={{
								indexAxis: "y",
								plugins: { legend: { display: false } },
								scales: { x: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
