import { Tabs } from 'expo-router'
import { Home, User, PlusCircle, Package } from '@tamagui/lucide-icons'
import { useTheme } from 'tamagui'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f0f0f0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF6B35', // Premium Orange/Brand Color
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'New Delivery',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={40} />,
          tabBarLabelStyle: { display: 'none' }, // Hide label for center button
          tabBarItemStyle: { bottom: 15 }, // Raise the center button
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
