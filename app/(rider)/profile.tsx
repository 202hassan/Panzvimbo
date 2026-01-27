import React from 'react'
import { YStack, XStack, Text, Button, Avatar, Card, Separator } from 'tamagui'
import { Settings, LogOut, ChevronRight, User, MapPin, CreditCard, Bike, Zap } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../_store'
import { logout, setUser } from '../_store/userSlice'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function RiderProfileScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.currentUser)
  const insets = useSafeAreaInsets()

  const handleLogout = () => {
    dispatch(logout())
    router.replace('/TrackingScreen.tsx/Auth/Login')
  }

  const handleSwitchMode = () => {
    if (!user) return
    
    // Toggle user type
    const newType = (user.userType === 'client' ? 'courier' : 'client') as 'client' | 'courier'
    const updatedUser = { ...user, userType: newType }
    
    dispatch(setUser(updatedUser))

    // Navigate based on new type
    if (newType === 'client') {
       router.replace('/(tabs)')
    } else {
       // Navigate to Rider Home
       router.replace('/(rider)')
    }
  }

  const riderStats = [
    { label: 'Completed Deliveries', value: '24', icon: Zap, color: '#2dbe60' },
    { label: 'Average Rating', value: '4.8', icon: User, color: '#FF6B35' },
    { label: 'Earnings This Week', value: '$128.50', icon: CreditCard, color: '#2dbe60' },
  ]

  const menuItems = [
    { icon: User, label: 'Personal Information', sub: 'Edit your details' },
    { icon: MapPin, label: 'Saved Addresses', sub: 'Home, Work, etc.' },
    { icon: CreditCard, label: 'Payment Methods', sub: 'Bank Account Details' },
    { icon: Settings, label: 'Settings', sub: 'Notifications, Language' },
  ]

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop={insets.top + 16} space="$4">
      {/* Header */}
      <YStack alignItems="center" space="$2" marginTop="$2">
        <Avatar circular size="$10">
          <Avatar.Image src="https://i.pravatar.cc/300" />
          <Avatar.Fallback backgroundColor="#2dbe60" />
        </Avatar>
        <Text fontSize="$6" fontWeight="bold">
          {user?.name || 'Demo Rider'}
        </Text>
        <Text fontSize="$4" color="$accent">
          {user?.email || 'demo@panzvimbo.com'}
        </Text>
        
        {/* Mode Switcher */}
        <Card 
          marginTop="$4" 
          padding="$3" 
          bordered 
          borderColor="#2dbe60"
          pressStyle={{ scale: 0.98 }}
          onPress={handleSwitchMode}
          backgroundColor="#e8f5e9"
          theme="light"
        >
          <XStack alignItems="center" space="$3">
            <Bike size={24} color="#2dbe60" />
            <Text fontWeight="bold" color="#1b5e20">
              Switch to Client Mode
            </Text>
            <ChevronRight size={20} color="#2dbe60" />
          </XStack>
        </Card>
      </YStack>

      <Separator marginVertical="$2" />

      {/* Stats Cards */}
      <YStack space="$2">
        <Text fontSize="$4" fontWeight="bold" paddingLeft="$2">Your Stats</Text>
        <XStack space="$2" flex={1} justifyContent="space-between">
          {riderStats.map((stat, index) => (
            <Card key={index} flex={1} padding="$3" backgroundColor="$cardBackground" borderRadius="$3">
              <YStack alignItems="center" space="$2">
                <YStack backgroundColor="$background" padding="$2" borderRadius="$2">
                  <stat.icon size={18} color={stat.color} />
                </YStack>
                <Text fontSize="$5" fontWeight="bold" textAlign="center">
                  {stat.value}
                </Text>
                <Text fontSize="$2" color="$accent" textAlign="center" numberOfLines={2}>
                  {stat.label}
                </Text>
              </YStack>
            </Card>
          ))}
        </XStack>
      </YStack>

      <Separator marginVertical="$2" />

      {/* Menu Options */}
      <YStack space="$3">
        <Text fontSize="$4" fontWeight="bold" paddingLeft="$2">Account</Text>
        {menuItems.map((item, index) => (
          <Card key={index} padding="$4" pressStyle={{ scale: 0.98 }} backgroundColor="$cardBackground">
            <XStack alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" space="$3">
                <YStack backgroundColor="$background" padding="$2" borderRadius="$2">
                  <item.icon size={20} color="#2dbe60" />
                </YStack>
                <YStack>
                  <Text fontSize="$4" fontWeight="bold">{item.label}</Text>
                  <Text fontSize="$2" color="$accent">{item.sub}</Text>
                </YStack>
              </XStack>
              <ChevronRight size={20} color="$accent" />
            </XStack>
          </Card>
        ))}
      </YStack>

      <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
        <Button
          width="100%"
          height={50}
          paddingVertical={12}
          paddingHorizontal={20}
          fontSize={16}
          backgroundColor="#FF3B30"
          color="white"
          icon={<LogOut size={18} />}
          onPress={handleLogout}
        >
          Log Out
        </Button>
      </YStack>
    </YStack>
  )
}
