"use client";

import { Grid, Box, Typography, Paper } from "@mui/material";
import { useMemo } from "react";
import type { DashboardData } from "@/types";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { COLORS, INDUSTRY_COLORS, hexToRgba, fmt } from "@/lib/colours";

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

function heatColor(pct: number) {
	const v = pct / 100;
	if (v < 0.1) return "#0d1117";
	if (v < 0.2) return "#0d2e1a";
	if (v < 0.35) return "#1a4a1a";
	if (v < 0.5) return "#2d6a2d";
	if (v < 0.65) return "#3FB950";
	if (v < 0.8) return "#FFA657";
	return "#F78166";
}

interface Props {
	data: DashboardData;
}

export default function IndustryPage({ data: D }: Props) {
	const lineDatasets = useMemo(
		() =>
			D.industry_names.map((ind, i) => ({
				label: ind,
				data: D.industry_trend[ind],
				borderColor: INDUSTRY_COLORS[ind] ?? COLORS[i],
				backgroundColor: "transparent",
				tension: 0.4,
				borderWidth: 2,
				pointRadius: 1,
			})),
		[D.industry_names, D.industry_trend],
	);

	const stackDatasets = useMemo(
		() =>
			D.industry_names.map((ind, i) => ({
				label: ind,
				data: D.industry_trend[ind],
				borderColor: INDUSTRY_COLORS[ind] ?? COLORS[i],
				backgroundColor: hexToRgba(INDUSTRY_COLORS[ind] ?? COLORS[i], 0.65),
				fill: true,
				tension: 0.4,
				borderWidth: 1,
				pointRadius: 0,
			})),
		[D.industry_names, D.industry_trend],
	);

	const barData = useMemo(
		() => ({
			labels: D.industries,
			datasets: [
				{
					label: "Total Emissions (Mt)",
					data: D.industry_totals,
					backgroundColor: D.industries.map(
						(ind) => INDUSTRY_COLORS[ind] ?? "#888",
					),
					borderRadius: 5,
					borderColor: "transparent",
				},
			],
		}),
		[D.industries, D.industry_totals],
	);

	return (
		<Box>
			<SectionTitle>Industry Overview</SectionTitle>
			<Grid container spacing={2.25} sx={{ mb: 2.25 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Industry Emissions Over Time
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Annual totals per sector, 2000–2023
						</Typography>
						<LineChart
							data={{ labels: D.years, datasets: lineDatasets }}
							options={{
								plugins: {
									legend: { position: "bottom", labels: { font: { size: 9 } } },
								},
								scales: { y: { ticks: { callback: (v) => fmt(Number(v)) } } },
							}}
							height={340}
						/>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2.5, borderRadius: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Industry Share (Stacked Area)
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: "block", mb: 2 }}>
							Relative contribution of each sector year by year
						</Typography>
						<LineChart
							data={{ labels: D.years, datasets: stackDatasets }}
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
							height={340}
						/>
					</Paper>
				</Grid>
			</Grid>

			<SectionTitle>Gas Mix by Industry</SectionTitle>
			<Paper sx={{ p: 2.5, borderRadius: 2, mb: 2.25, overflowX: "auto" }}>
				<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
					Gas Type Share per Industry (% of sector total)
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mb: 2 }}>
					Each cell shows what % of that industry&apos;s emissions come from
					that gas
				</Typography>
				<Box
					component="table"
					sx={{
						borderCollapse: "collapse",
						width: "100%",
						fontFamily: "var(--font-mono)",
						fontSize: 11,
					}}>
					<thead>
						<Box component="tr">
							<Box
								component="th"
								sx={{
									p: "6px 10px",
									color: "text.secondary",
									fontWeight: 600,
									fontSize: 10,
								}}
							/>
							{D.heatmap_gases.map((g) => (
								<Box
									component="th"
									key={g}
									sx={{
										p: "6px 10px",
										color: "text.secondary",
										fontWeight: 600,
										fontSize: 10,
										textAlign: "center",
									}}>
									{g}
								</Box>
							))}
						</Box>
					</thead>
					<tbody>
						{D.heatmap_industries.map((ind, ri) => (
							<Box component="tr" key={ind}>
								<Box
									component="td"
									sx={{
										p: "8px 10px",
										color: "text.secondary",
										whiteSpace: "nowrap",
										fontSize: 11,
									}}>
									{ind}
								</Box>
								{D.heatmap_data[ri].map((val, ci) => {
									const bg = heatColor(val);
									const fg = val > 40 ? "#0d1117" : "#E6EDF3";
									return (
										<Box
											component="td"
											key={ci}
											sx={{
												p: "8px 10px",
												textAlign: "center",
												fontWeight: 600,
												background: bg,
												color: fg,
												border: "1px solid var(--bg)",
												borderRadius: "2px",
											}}>
											{val}%
										</Box>
									);
								})}
							</Box>
						))}
					</tbody>
				</Box>
			</Paper>

			<SectionTitle>Industry Rankings</SectionTitle>
			<Paper sx={{ p: 2.5, borderRadius: 2 }}>
				<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
					Industry Totals — Horizontal Bar
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mb: 2 }}>
					Cumulative 2000–2023 comparison
				</Typography>
				<BarChart
					data={barData}
					options={{
						indexAxis: "y",
						plugins: { legend: { display: false } },
						scales: { x: { ticks: { callback: (v) => fmt(Number(v)) } } },
					}}
					height={200}
				/>
			</Paper>
		</Box>
	);
}
