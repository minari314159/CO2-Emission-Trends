import type { DashboardData } from "@/types";
import { MOCK_DATA } from "./mockData";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function fetchDashboardData(): Promise<DashboardData> {
	if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
		return MOCK_DATA;
	} else {
		const res = await fetch(`${API_BASE}/api/dashboard`, {
			next: { revalidate: 60 }, // ISR: re-fetch every 60s
		});
		if (!res.ok) {
			throw new Error(`API error: ${res.status}`);
		}

		return res.json();
	}
}
