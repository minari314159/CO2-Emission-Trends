"use client";

import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
);

// Global dark theme defaults — applied once when the module loads
ChartJS.defaults.color = "#8B949E";
ChartJS.defaults.font.family = "'Outfit', sans-serif";
ChartJS.defaults.plugins.legend.labels.boxWidth = 10;
ChartJS.defaults.plugins.legend.labels.padding = 14;
ChartJS.defaults.plugins.tooltip.backgroundColor = "#161B22";
ChartJS.defaults.plugins.tooltip.borderColor = "#30363D";
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.titleColor = "#E6EDF3";
ChartJS.defaults.plugins.tooltip.bodyColor = "#8B949E";
ChartJS.defaults.scale.grid.color = "rgba(255,255,255,0.05)";

interface LineChartProps {
	data: ChartData<"line">;
	options?: ChartOptions<"line">;
	height?: number;
}

export default function LineChart({
	data,
	options,
	height = 280,
}: LineChartProps) {
	return (
		// Same pattern as BarChart — Box owns the height, Line fills it
		<Box sx={{ height, position: "relative", width: "100%" }}>
			<Line
				data={data}
				options={{ responsive: true, maintainAspectRatio: false, ...options }}
				// No height prop — controlled by Box
			/>
		</Box>
	);
}
