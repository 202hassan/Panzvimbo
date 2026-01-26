import { TamaguiProvider } from 'tamagui'
import { Provider } from 'react-redux'
import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { store } from './store'
import tamaguiConfig from '../tamagui.config'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <TamaguiProvider config={tamaguiConfig as any}>
          <Slot />
        </TamaguiProvider>
      </Provider>
    </SafeAreaProvider>
  )
}
