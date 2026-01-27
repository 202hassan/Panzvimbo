import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { YStack, Text, Card, XStack, Button } from 'tamagui'
import { Clock, CheckCircle, XCircle, ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { deliveryService } from '../../_services/deliverySlice'
import { Bid } from '../../_store/deliverySlice'

interface BidWithDelivery extends Bid {
  deliveryDetails: {
    pickupAddress: string
    dropoffAddress: string
    status: string
  }
}

export default function BidScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [bids, setBids] = useState<BidWithDelivery[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchBids = async () => {
    try {
      const data = await deliveryService.getMyBids()
      setBids(data)
    } catch (error) {
      // Use mock data for demo purposes (no error logging to UI)
      const mockBids: BidWithDelivery[] = [
        {
          id: 'bid-1',
          deliveryId: 'delivery-1',
          courierId: 'courier-1',
          amount: 45.50,
          estimatedTime: 25,
          message: 'I can pick up immediately',
          status: 'accepted',
          createdAt: new Date().toISOString(),
          deliveryDetails: {
            pickupAddress: '123 Main St, Downtown',
            dropoffAddress: '456 Park Ave, Suburbs',
            status: 'accepted'
          }
        },
        {
          id: 'bid-2',
          deliveryId: 'delivery-2',
          courierId: 'courier-1',
          amount: 32.00,
          estimatedTime: 18,
          message: '',
          status: 'pending',
          createdAt: new Date().toISOString(),
          deliveryDetails: {
            pickupAddress: '789 Market St, City Center',
            dropoffAddress: '321 Oak Rd, Residential',
            status: 'pending'
          }
        },
        {
          id: 'bid-3',
          deliveryId: 'delivery-3',
          courierId: 'courier-1',
          amount: 28.50,
          estimatedTime: 15,
          message: 'Weather looks good',
          status: 'rejected',
          createdAt: new Date().toISOString(),
          deliveryDetails: {
            pickupAddress: '555 Commerce Ave, Industrial',
            dropoffAddress: '777 Beach Blvd, Coastal',
            status: 'rejected'
          }
        }
      ]
      setBids(mockBids)
    }
  }

  useEffect(() => {
    fetchBids()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchBids()
    setRefreshing(false)
  }

  const getBidStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={20} color="#4CAF50" />
      case 'rejected':
        return <XCircle size={20} color="#F44336" />
      default:
        return <Clock size={20} color="#FFA726" />
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      {/* Header with Back Button */}
      <XStack
        paddingHorizontal="$4"
        paddingTop="$4"
        paddingBottom="$4"
        alignItems="center"
        space="$2"
      >
        <Button
          icon={<ChevronLeft size={24} color="#2dbe60" />}
          backgroundColor="transparent"
          onPress={() => router.back()}
          padding="$0"
          width={40}
          height={40}
        />
        <YStack>
          <Text fontSize="$8" fontWeight="bold">
            My Bids
          </Text>
          <Text fontSize="$4" color="$accent">
            Track your active and past bids
          </Text>
        </YStack>
      </XStack>

      {/* Bids List */}
      {bids.length > 0 ? (
        <FlatList
          data={bids}
          renderItem={({ item }) => (
            <Card
              elevate
              bordered
              backgroundColor="$cardBackground"
              marginHorizontal="$4"
              marginVertical="$2"
              padding="$4"
            >
              <YStack space="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$6" fontWeight="bold" color="$primary">
                    ${item.amount}
                  </Text>
                  {getBidStatusIcon(item.deliveryDetails.status)}
                </XStack>

                <YStack space="$1">
                  <Text fontSize="$3" color="$accent" fontWeight="bold">
                    FROM
                  </Text>
                  <Text fontSize="$4" numberOfLines={1}>
                    {item.deliveryDetails.pickupAddress}
                  </Text>
                </YStack>

                <YStack space="$1">
                  <Text fontSize="$3" color="$accent" fontWeight="bold">
                    TO
                  </Text>
                  <Text fontSize="$4" numberOfLines={1}>
                    {item.deliveryDetails.dropoffAddress}
                  </Text>
                </YStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$accent">
                    Est. {item.estimatedTime} mins
                  </Text>
                  <Card
                    backgroundColor={
                      item.deliveryDetails.status === 'accepted'
                        ? '$green10'
                        : item.deliveryDetails.status === 'rejected'
                        ? '$red10'
                        : '$orange10'
                    }
                    paddingHorizontal="$3"
                    paddingVertical="$1"
                  >
                    <Text
                      fontSize="$2"
                      color="white"
                      textTransform="uppercase"
                      fontWeight="bold"
                    >
                      {item.deliveryDetails.status}
                    </Text>
                  </Card>
                </XStack>

                {item.message && (
                  <Card backgroundColor="$background" padding="$2">
                    <Text fontSize="$3" color="$secondary" fontStyle="italic">
                      "{item.message}"
                    </Text>
                  </Card>
                )}
              </YStack>
            </Card>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
          <Text fontSize="$6" fontWeight="bold" color="$accent">
            No bids yet
          </Text>
          <Text fontSize="$4" color="$accent" textAlign="center" marginTop="$2">
            Browse available jobs and place your first bid!
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
