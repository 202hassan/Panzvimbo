import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from './_store'
import SplashScreen from './screens/SplashScreen'

export default function Index() {
  const router = useRouter()
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (!showSplash) {
      // Check authentication and redirect after splash
      if (isAuthenticated && currentUser) {
        if (currentUser.userType === 'client') {
          router.replace('/(tabs)')
        } else {
          router.replace('/TrackingScreen.tsx/courier/CourierHome')
        }
      } else {
        router.replace('/TrackingScreen.tsx/Auth/Login')
      }
    }
  }, [showSplash, isAuthenticated, currentUser])

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  return null
}
