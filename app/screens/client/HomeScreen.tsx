import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { YStack, XStack, Text, Button, Card } from 'tamagui'
import { Plus, Package } from '@tamagui/lucide-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import { RootState } from '../../store'
import { setDeliveries } from '../../store/deliverySlice'
import { deliveryService } from '../../services/deliverySlice'
import JobCard from '../../components/JobCard'

export default function HomeScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { deliveries } = useSelector((state: RootState) => state.delivery)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryService.getMyDeliveries()
      dispatch(setDeliveries(data))
    } catch (error) {
      console.error('Failed to fetch deliveries:', error)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDeliveries()
    setRefreshing(false)
  }

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop="$4">
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingBottom="$4"
      >
        <YStack>
          <Text fontSize="$8" fontWeight="bold">
            My Deliveries
          </Text>
          <Text fontSize="$4" color="$accent">
            Track and manage your orders
          </Text>
        </YStack>
      </XStack>

      {/* Create Delivery Button */}
      <XStack paddingHorizontal="$4" paddingBottom="$4">
        <Button
          flex={1}
          backgroundColor="$primary"
          color="white"
          fontWeight="bold"
          size="$5"
          icon={<Plus size={20} color="white" />}
          onPress={() => router.push('/screens/client/CreateDelivery')}
          pressStyle={{ backgroundColor: '$primaryHover' }}
        >
          Create New Delivery
        </Button>
      </XStack>

      {/* Deliveries List */}
      {deliveries.length > 0 ? (
        <FlatList
          data={deliveries}
          renderItem={({ item }) => (
            <JobCard
              delivery={item}
              onViewDetails={(delivery) =>
                router.push(`/screens/client/BidsScreen?id=${delivery.id}`)
              }
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
          <Package size={64} color="$accent" opacity={0.3} />
          <Text fontSize="$6" fontWeight="bold" marginTop="$4" color="$accent">
            No deliveries yet
          </Text>
          <Text fontSize="$4" color="$accent" textAlign="center" marginTop="$2">
            Create your first delivery request and get competitive bids from couriers
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
