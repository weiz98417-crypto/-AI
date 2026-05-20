import type { Config } from 'tailwindcss'
import { ggaiPreset } from '@ggai/shared/tokens'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [ggaiPreset],
} satisfies Config
