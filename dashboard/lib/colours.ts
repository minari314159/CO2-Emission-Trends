export const COLORS = [
	"#58A6FF",
	"#3FB950",
	"#F78166",
	"#D2A8FF",
	"#FFA657",
	"#E3B341",
	"#79C0FF",
	"#56D364",
	"#F085A2",
	"#40C4FF",
	"#FF7B72",
	"#85E89D",
	"#FFAB70",
	"#B392F0",
	"#2188FF",
];

export const GAS_COLORS: Record<string, string> = {
	Co2: "#F78166",
	Ch4: "#58A6FF",
	N2O: "#3FB950",
	Hfcs: "#D2A8FF",
	Sf6: "#FFA657",
};

export const INDUSTRY_COLORS: Record<string, string> = {
	Energy: "#F78166",
	Manufacturing: "#58A6FF",
	Transport: "#3FB950",
	Agriculture: "#FFA657",
	Buildings: "#D2A8FF",
	Waste: "#E3B341",
	"Land Use": "#79C0FF",
	"Industrial Processes": "#56D364",
};

export function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}

export function fmt(n: number): string {
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
	if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
	return n.toFixed(0);
}
