import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

// Use default config with type assertion to avoid nested dependency conflicts
export default createTamagui(config as any)
