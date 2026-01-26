import React from 'react'
import { YStack, XStack, Text, Button, Avatar, Card, Separator } from 'tamagui'
import { Settings, LogOut, ChevronRight, User, MapPin, CreditCard } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { logout } from '../store/userSlice'

export default function ProfileScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.currentUser)

  const handleLogout = () => {
    dispatch(logout())
    router.replace('/TrackingScreen.tsx/Auth/Login')
  }

  const menuItems = [
    { icon: User, label: 'Personal Information', sub: 'Edit your details' },
    { icon: MapPin, label: 'Saved Addresses', sub: 'Home, Work, etc.' },
    { icon: CreditCard, label: 'Payment Methods', sub: 'Visa, EcoCash' },
    { icon: Settings, label: 'Settings', sub: 'Notifications, Language' },
  ]

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" space="$4">
      {/* Header */}
      <YStack alignItems="center" space="$2" marginTop="$4">
        <Avatar circular size="$10">
          <Avatar.Image src="https://i.pravatar.cc/300" />
          <Avatar.Fallback backgroundColor="$primary" />
        </Avatar>
        <Text fontSize="$6" fontWeight="bold">
          {user?.name || 'Demo User'}
        </Text>
        <Text fontSize="$4" color="$accent">
          {user?.email || 'demo@panzvimbo.com'}
        </Text>
      </YStack>

      <Separator marginVertical="$2" />

      {/* Menu Options */}
      <YStack space="$3">
        {menuItems.map((item, index) => (
          <Card key={index} padding="$4" pressStyle={{ scale: 0.98 }} backgroundColor="$cardBackground">
            <XStack alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" space="$3">
                <YStack backgroundColor="$background" padding="$2" borderRadius="$2">
                  <item.icon size={20} color="#FF6B35" />
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
