import type { Config } from 'tailwindcss'

// Inlined from @ggai/shared/tokens for Vercel deploy compatibility
const ggaiPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#874c63', container: '#e8a0b9', fixed: '#ffd9e4', 'fixed-dim': '#fcb2cb', light: '#fcb2cb' },
        'on-primary': { DEFAULT: '#ffffff', container: '#6b354a', fixed: '#370a1f', 'fixed-variant': '#6c354b' },
        secondary: { DEFAULT: '#605e5e', container: '#e6e1e1', fixed: '#e6e1e1', 'fixed-dim': '#cac5c5' },
        'on-secondary': { DEFAULT: '#ffffff', container: '#666464', fixed: '#1c1b1c', 'fixed-variant': '#484647' },
        tertiary: { DEFAULT: '#5d5f5f', container: '#b3b4b4', fixed: '#e2e2e2', 'fixed-dim': '#c6c6c7' },
        'on-tertiary': { DEFAULT: '#ffffff', container: '#444647', fixed: '#1a1c1c', 'fixed-variant': '#454747' },
        surface: { DEFAULT: '#fcf9f8', bright: '#fcf9f8', dim: '#dcd9d9', container: '#f0eded', 'container-low': '#f6f3f2', 'container-lowest': '#ffffff', 'container-high': '#eae7e7', 'container-highest': '#e4e2e2', tint: '#874c63' },
        background: '#fcf9f8',
        'on-surface': '#1b1c1c',
        'on-background': '#1b1c1c',
        'surface-variant': '#e4e2e1',
        'on-surface-variant': '#514347',
        outline: { DEFAULT: '#837377', variant: '#d5c2c6' },
        'inverse-surface': '#303030',
        'inverse-primary': '#fcb2cb',
        'inverse-on-surface': '#f3f0f0',
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
      borderRadius: { sm: '8px', DEFAULT: '12px', md: '16px', lg: '24px', xl: '28px', '2xl': '32px', full: '9999px' },
    },
  },
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [ggaiPreset],
} satisfies Config
