import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { YStack, XStack, Text, Button, Card } from 'tamagui'
import { Plus, Package } from '@tamagui/lucide-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import { RootState } from '../../_store'
import { setDeliveries } from '../../_store/deliverySlice'
import { deliveryService } from '../../_services/deliverySlice'
import JobCard from '../../_components/JobCard'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()
  const { deliveries } = useSelector((state: RootState) => state.delivery)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryService.getMyDeliveries()
      dispatch(setDeliveries(data))
    } catch (error) {
      console.log('Using demo data (fetch failed):', error)
      // Demo Mode Fallback
      const mockDeliveries: any[] = [
        {
          id: '1',
          clientId: 'demo-user',
          clientName: 'Demo User',
          pickupLocation: {
            latitude: -17.8252,
            longitude: 31.0335,
            address: '123 Harare Dr, Borrowdale'
          },
          dropoffLocation: {
            latitude: -17.8216,
            longitude: 31.0492,
            address: '456 Samora Machel Ave, CBD'
          },
          packageDetails: {
            description: 'Important Documents',
            size: 'small',
            weight: 0.5
          },
          status: 'pending',
          bids: [],
          createdAt: new Date().toISOString(),
          suggestedPrice: 15.00
        },
        {
          id: '2',
          clientId: 'demo-user',
          clientName: 'Demo User',
          pickupLocation: {
            latitude: -17.7840,
            longitude: 31.0020,
            address: 'Westgate Shopping Mall'
          },
          dropoffLocation: {
            latitude: -17.8000,
            longitude: 31.0400,
            address: 'Avondale Shops'
          },
          packageDetails: {
            description: 'Box of Electronics',
            size: 'medium',
            weight: 2.5
          },
          status: 'in_progress',
          bids: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          suggestedPrice: 25.00
        }
      ]
      dispatch(setDeliveries(mockDeliveries))
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
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
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
          height={50}
          paddingVertical={12}
          paddingHorizontal={20}
          fontSize={16}
          backgroundColor="$primary"
          color="white"
          fontWeight="bold"
          icon={<Plus size={20} color="white" />}
          onPress={() => router.push('/(tabs)/create')}
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
