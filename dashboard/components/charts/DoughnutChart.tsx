"use client";

import { Box } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
	data: ChartData<"doughnut">;
	options?: ChartOptions<"doughnut">;
	height?: number;
}

export default function DoughnutChart({
	data,
	options,
	height = 280,
}: DoughnutChartProps) {
	return (
		// Box owns the height — Doughnut fills it responsively
		<Box sx={{ height, position: "relative", width: "100%" }}>
			<Doughnut
				data={data}
				options={{ responsive: true, maintainAspectRatio: false, ...options }}
				// No height prop — controlled by Box
			/>
		</Box>
	);
}
