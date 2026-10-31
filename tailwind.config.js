/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orbis: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF7A00', // Iconic Orbis Cone Orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          accent: '#FF7A00',
        },
        surface: {
          lowest: '#090B0F',
          dim: '#0D1017',
          DEFAULT: '#121620',
          low: '#171C28',
          mid: '#1F2433',
          high: '#272E40',
          highest: '#323A50',
          bright: '#3D4660',
        },
        m3: {
          primary: '#FF7A00',
          onPrimary: '#000000',
          primaryContainer: '#401A00',
          onPrimaryContainer: '#FFDBC9',
          surfaceVariant: '#222838',
          onSurface: '#E2E8F0',
          onSurfaceVariant: '#94A3B8',
          outline: '#475569',
          outlineVariant: '#334155',
        }
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
        'full': '9999px',
      },
      boxShadow: {
        'glow-orbis': '0 0 25px -4px rgba(255, 122, 0, 0.35)',
        'glow-pill': '0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 15px rgba(255, 122, 0, 0.2)',
        'm3-elevation-1': '0 1px 3px 1px rgba(0,0,0,0.25), 0 1px 2px 0 rgba(0,0,0,0.3)',
        'm3-elevation-2': '0 2px 6px 2px rgba(0,0,0,0.3), 0 1px 2px 0 rgba(0,0,0,0.35)',
        'm3-elevation-3': '0 4px 12px 3px rgba(0,0,0,0.35), 0 1px 3px 0 rgba(0,0,0,0.4)',
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
