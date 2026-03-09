import { fetchDashboardData } from "@/lib/api";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
	const data = await fetchDashboardData();
	return <Dashboard data={data} />;
}
