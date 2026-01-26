import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { YStack, XStack, Text, Card, Button } from 'tamagui'
import { Bike, DollarSign, Star, TrendingUp } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export default function CourierHome() {
  const router = useRouter()
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { activeDelivery } = useSelector((state: RootState) => state.delivery)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedDeliveries: 0,
    rating: 4.8,
    activeBids: 0,
  })

  const onRefresh = () => {
    setRefreshing(true)
    // Fetch updated stats
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <YStack padding="$4" space="$4">
        {/* Header */}
        <YStack space="$2">
          <Text fontSize="$8" fontWeight="bold">
            Welcome back!
          </Text>
          <Text fontSize="$5" color="$accent">
            {currentUser?.name || 'Courier'}
          </Text>
        </YStack>

        {/* Stats Grid */}
        <XStack space="$3" flexWrap="wrap">
          <Card flex={1} minWidth="45%" padding="$4" backgroundColor="$cardBackground">
            <YStack space="$2" alignItems="center">
              <DollarSign size={32} color="#FF6B35" />
              <Text fontSize="$7" fontWeight="bold" color="$primary">
                ${stats.totalEarnings}
              </Text>
              <Text fontSize="$3" color="$accent">
                Total Earnings
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth="45%" padding="$4" backgroundColor="$cardBackground">
            <YStack space="$2" alignItems="center">
              <Bike size={32} color="#4CAF50" />
              <Text fontSize="$7" fontWeight="bold">
                {stats.completedDeliveries}
              </Text>
              <Text fontSize="$3" color="$accent">
                Deliveries
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth="45%" padding="$4" backgroundColor="$cardBackground">
            <YStack space="$2" alignItems="center">
              <Star size={32} color="#FFD700" fill="#FFD700" />
              <Text fontSize="$7" fontWeight="bold">
                {stats.rating}
              </Text>
              <Text fontSize="$3" color="$accent">
                Rating
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth="45%" padding="$4" backgroundColor="$cardBackground">
            <YStack space="$2" alignItems="center">
              <TrendingUp size={32} color="#2196F3" />
              <Text fontSize="$7" fontWeight="bold">
                {stats.activeBids}
              </Text>
              <Text fontSize="$3" color="$accent">
                Active Bids
              </Text>
            </YStack>
          </Card>
        </XStack>

        {/* Active Delivery */}
        {activeDelivery ? (
          <Card padding="$4" backgroundColor="$primary" borderRadius="$4">
            <YStack space="$3">
              <Text fontSize="$6" fontWeight="bold" color="white">
                Active Delivery
              </Text>
              <Text fontSize="$4" color="white">
                You have an ongoing delivery
              </Text>
              <Button
                backgroundColor="white"
                color="$primary"
                fontWeight="bold"
                onPress={() => router.push('/TrackingScreen.tsx/courier/ActiveDelivery')}
              >
                View Details
              </Button>
            </YStack>
          </Card>
        ) : (
          <>
            {/* Browse Jobs */}
            <Card padding="$4" backgroundColor="$cardBackground">
              <YStack space="$3">
                <Text fontSize="$6" fontWeight="bold">
                  Ready to earn?
                </Text>
                <Text fontSize="$4" color="$accent">
                  Browse available delivery jobs and place your bids
                </Text>
                <Button
                  backgroundColor="$primary"
                  color="white"
                  fontWeight="bold"
                  size="$5"
                  onPress={() => router.push('/TrackingScreen.tsx/courier/JobFeed')}
                  pressStyle={{ backgroundColor: '$primaryHover' }}
                >
                  Browse Jobs
                </Button>
              </YStack>
            </Card>

            {/* My Bids */}
            <Card padding="$4" backgroundColor="$cardBackground">
              <YStack space="$3">
                <Text fontSize="$6" fontWeight="bold">
                  Your Active Bids
                </Text>
                <Text fontSize="$4" color="$accent">
                  Track your bids and wait for client responses
                </Text>
                <Button
                  backgroundColor="$secondary"
                  color="white"
                  fontWeight="bold"
                  onPress={() => router.push('/TrackingScreen.tsx/courier/BidScreen')}
                >
                  View My Bids
                </Button>
              </YStack>
            </Card>
          </>
        )}
      </YStack>
    </ScrollView>
  )
}
