import React, { useEffect, useState } from 'react'
import { FlatList, Alert } from 'react-native'
import { YStack, XStack, Text, Card } from 'tamagui'
import { Clock, TrendingUp } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { deliveryService } from '../../services/deliverySlice'
import { setCurrentDeliveryBids, acceptBid as acceptBidAction } from '../../store/deliverySlice'
import { Bid, Delivery } from '../../store/deliverySlice'
import BidCard from '../../components/BidCard'
import DeliveryMapView from '../../components/MapView'

export default function BidsScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
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
      console.error('Failed to fetch bids:', error)
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
