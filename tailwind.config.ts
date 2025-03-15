
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Theme colors
				spring: {
					primary: '#A8E6CF',
					secondary: '#DCEDC1',
					accent: '#FFD3B6',
					highlight: '#FFAAA5',
					muted: '#FF8B94',
				},
				summer: {
					primary: '#FDCFF3',
					secondary: '#FFC8DD',
					accent: '#FFAFCC',
					highlight: '#BDE0FE',
					muted: '#A2D2FF',
				},
				autumn: {
					primary: '#FFB85F',
					secondary: '#E48900',
					accent: '#A45C00',
					highlight: '#6E4C00',
					muted: '#FFE2BD',
				},
				winter: {
					primary: '#E3F6F5',
					secondary: '#BAE8E8',
					accent: '#2C698D',
					highlight: '#272643',
					muted: '#FFFFFF',
				},
				blossom: {
					primary: '#FFCAD4',
					secondary: '#F4ACB7',
					accent: '#9D8189',
					highlight: '#D8E2DC',
					muted: '#FFE5D9',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'heartbeat': {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.1)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.1)' },
					'70%': { transform: 'scale(1)' },
				},
				'float-up': {
					'0%': { 
						transform: 'translateY(10px) rotate(0deg)', 
						opacity: '0' 
					},
					'50%': { 
						opacity: '1' 
					},
					'100%': { 
						transform: 'translateY(-60vh) rotate(20deg)', 
						opacity: '0' 
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'page-transition': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'float-up': 'float-up 8s linear infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'page-transition': 'page-transition 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
