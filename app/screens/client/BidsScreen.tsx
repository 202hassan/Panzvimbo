import React, { useEffect, useState } from 'react'
import { FlatList, Alert } from 'react-native'
import { YStack, XStack, Text, Card, Button } from 'tamagui'
import { Clock, TrendingUp, ChevronLeft } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { deliveryService } from '../../_services/deliverySlice'
import { setCurrentDeliveryBids, acceptBid as acceptBidAction } from '../../_store/deliverySlice'
import { Bid, Delivery } from '../../_store/deliverySlice'
import BidCard from '../../_components/BidCard'
import DeliveryMapView from '../../_components/MapView'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function BidsScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const dispatch = useDispatch()
  const [delivery, setDelivery] = useState<Delivery | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBids = async () => {
    if (!id || typeof id !== 'string') return

    try {
      const bidsData = await deliveryService.getDeliveryBids(id)
      setBids(bidsData.bids)
      setDelivery(bidsData.delivery)
      dispatch(setCurrentDeliveryBids(bidsData.bids))
    } catch (error) {
      console.log('Using demo bids (fetch failed):', error)
      
      // Fallback: Demo Data
      const mockBids: any[] = [
        {
          id: 'bid-1',
          courierId: 'courier-1',
          courierName: 'Mike Motorcycle',
          courierRating: 4.8,
          amount: 14.50,
          estimatedTime: 25,
          message: 'I am nearby and can pick up immediately.',
          createdAt: new Date().toISOString(),
          vehicleInfo: {
            model: 'Honda Ace',
            plateNumber: 'ABC-1234'
          }
        },
        {
          id: 'bid-2',
          courierId: 'courier-2',
          courierName: 'Fast Delivery Co.',
          courierRating: 4.5,
          amount: 16.00,
          estimatedTime: 15,
          message: 'Priority delivery included.',
          createdAt: new Date().toISOString(),
          vehicleInfo: {
             model: 'Yamaha',
             plateNumber: 'XYZ-9876'
          }
        }
      ]

      const mockDelivery: any = {
        id: id as string,
        clientId: 'demo-user',
        clientName: 'Demo User',
        pickupLocation: {
          latitude: -17.8252, 
          longitude: 31.0335,
          address: '123 Harare Dr'
        },
        dropoffLocation: {
          latitude: -17.8216,
          longitude: 31.0492,
          address: '456 Samora Ave'
        },
        packageDetails: {
          description: 'Demo Package',
          size: 'small',
          weight: 1
        },
        status: 'pending',
        bids: mockBids,
        createdAt: new Date().toISOString()
      }

      setBids(mockBids)
      setDelivery(mockDelivery)
      dispatch(setCurrentDeliveryBids(mockBids))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBids()
    // Poll for new bids every 10 seconds
    const interval = setInterval(fetchBids, 10000)
    return () => clearInterval(interval)
  }, [id])

  const handleAcceptBid = async (bid: Bid) => {
    if (!delivery) return

    Alert.alert(
      'Accept Bid',
      `Accept ${bid.courierName}'s offer of $${bid.amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await deliveryService.acceptBid(delivery.id, bid.id)
              dispatch(acceptBidAction({ deliveryId: delivery.id, bid }))
              Alert.alert('Success', 'Bid accepted! The courier will be notified.')
              router.back()
            } catch (error: any) {
              Alert.alert('Error', error.toString())
            }
          },
        },
      ]
    )
  }

  if (loading || !delivery) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text>Loading...</Text>
      </YStack>
    )
  }

  const sortedBids = [...bids].sort((a, b) => a.amount - b.amount)
  const lowestBid = sortedBids[0]
  const avgBid = bids.length > 0 
    ? bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length 
    : 0

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack 
        paddingHorizontal="$4" 
        paddingTop={insets.top + 16}
        paddingBottom="$2" 
        alignItems="center" 
        space="$3" 
        backgroundColor="$background"
        zIndex={10}
      >
        <Button 
          icon={<ChevronLeft size={24} color="$color" />} 
          size="$4" 
          circular 
          chromeless 
          onPress={() => router.back()} 
        />
        <Text fontSize="$6" fontWeight="bold">Delivery Details</Text>
      </XStack>

      {/* Map View */}
      <YStack height={250}>
        <DeliveryMapView
          pickupLocation={delivery.pickupLocation}
          dropoffLocation={delivery.dropoffLocation}
          showRoute
        />
      </YStack>

      {/* Stats Card */}
      <Card margin="$4" padding="$4" backgroundColor="$cardBackground">
        <XStack justifyContent="space-around">
          <YStack alignItems="center">
            <Clock size={24} color="#FF6B35" />
            <Text fontSize="$6" fontWeight="bold" marginTop="$2">
              {bids.length}
            </Text>
            <Text fontSize="$3" color="$accent">
              Total Bids
            </Text>
          </YStack>

          {lowestBid && (
            <YStack alignItems="center">
              <TrendingUp size={24} color="#4CAF50" />
              <Text fontSize="$6" fontWeight="bold" marginTop="$2" color="$primary">
                ${lowestBid.amount}
              </Text>
              <Text fontSize="$3" color="$accent">
                Lowest Bid
              </Text>
            </YStack>
          )}

          {avgBid > 0 && (
            <YStack alignItems="center">
              <TrendingUp size={24} color="#2196F3" />
              <Text fontSize="$6" fontWeight="bold" marginTop="$2">
                ${avgBid.toFixed(2)}
              </Text>
              <Text fontSize="$3" color="$accent">
                Average Bid
              </Text>
            </YStack>
          )}
        </XStack>
      </Card>

      {/* Bids List */}
      <YStack flex={1} paddingHorizontal="$4">
        <Text fontSize="$6" fontWeight="bold" marginBottom="$3">
          Bids ({bids.length})
        </Text>

        {bids.length > 0 ? (
          <FlatList
            data={sortedBids}
            renderItem={({ item }) => (
              <BidCard
                bid={item}
                onAccept={handleAcceptBid}
                isAccepted={delivery.acceptedBid?.id === item.id}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Card padding="$6" backgroundColor="$cardBackground" alignItems="center">
            <Text fontSize="$5" color="$accent" textAlign="center">
              No bids yet. Couriers will start bidding soon!
            </Text>
          </Card>
        )}
      </YStack>
    </YStack>
  )
}
