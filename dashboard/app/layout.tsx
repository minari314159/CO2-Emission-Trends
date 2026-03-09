"use client";
import "./globals.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { IBM_Plex_Mono, Outfit } from "next/font/google";

const outfit = Outfit({
	subsets: ["latin"],
	weight: ["300", "400", "600", "700", "800"],
});
const ibmMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-mono",
});

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: { default: "#080c10", paper: "#161b22" },
		primary: { main: "#58a6ff" },
		success: { main: "#3fb950" },
		error: { main: "#f78166" },
		text: { primary: "#e6edf3", secondary: "#8b949e" },
	},
	typography: {
		fontFamily: outfit.style.fontFamily,
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: { backgroundImage: "none", border: "1px solid #21262d" },
			},
		},
	},
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${outfit.className} ${ibmMono.variable}`}>
			<head>
				<title>GHG Emissions Dashboard</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
