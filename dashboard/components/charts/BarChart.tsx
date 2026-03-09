"use client";

import { Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface BarChartProps {
	data: ChartData<"bar">;
	options?: ChartOptions<"bar">;
	height?: number;
}

export default function BarChart({
	data,
	options,
	height = 280,
}: BarChartProps) {
	return (
		<Box sx={{ height, position: "relative", width: "100%" }}>
			<Bar
				data={data}
				options={{ responsive: true, maintainAspectRatio: false, ...options }}
			/>
		</Box>
	);
}
