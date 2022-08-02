/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				accent: {
					blue: "#2667FF",
					hover: "#0342D8",
				},
				main: {
					black: "#161616",
					white: "#F1F1F1",
				},
			},
			screens: {
				cus: "1116px",
			},
		},
	},
	plugins: [],
};
