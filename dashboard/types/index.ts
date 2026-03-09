// All data types matching the Flask API response shape

export interface DashboardData {
	years: number[];
	global_emissions: number[];
	yoy_pct: number[];
	countries: string[];
	country_totals: number[];
	industries: string[];
	industry_totals: number[];
	gases: string[];
	gas_totals: number[];
	top6_countries: string[];
	country_trend: Record<string, number[]>;
	industry_names: string[];
	industry_trend: Record<string, number[]>;
	gas_names: string[];
	gas_trend: Record<string, number[]>;
	region_names: string[];
	region_trend: Record<string, number[]>;
	heatmap_industries: string[];
	heatmap_gases: string[];
	heatmap_data: number[][];
	per_capita_countries: string[];
	per_capita_values: number[];
	kpi_total: number;
	kpi_peak_year: number;
	kpi_top_country: string;
	kpi_recent_change: number;
	kpi_countries: number;
	kpi_years: number;
}

export type TabName = "overview" | "country" | "industry" | "gas";

export type CountryMetric = "industry" | "gas";
