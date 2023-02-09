const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'primary': '#0041be',
				'light':'#a3a3a3',
				'secondary-light':'#FFFFFF',
				'background':'rgb(19, 26, 42)',
				'light-blue':'#8fafeb',
				'primary-light': '#f9f9f9',
				'ternary-light': '#f6f7f8',
				'secondary-dark': '#102D44',
				'ternary-dark': '#1E3851',
			},
			container: {
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '5rem',
					xl: '6rem',
					'2xl': '8rem',
				},
			},
		},
	},
	variants: {
		extend: { opacity: ['disabled'] },
	},
	plugins: ['@tailwindcss/forms'],
};
