import React from 'react'
import { Card, XStack, YStack, Text, Button, Avatar } from 'tamagui'
import { Star, Clock, Bike } from '@tamagui/lucide-icons'
import { Bid } from '../store/deliverySlice'

interface BidCardProps {
  bid: Bid
  onAccept?: (bid: Bid) => void
  isAccepted?: boolean
}

export default function BidCard({ bid, onAccept, isAccepted }: BidCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      backgroundColor="$cardBackground"
      marginVertical="$2"
      padding="$4"
      pressStyle={{ scale: 0.98 }}
    >
      <YStack space="$3">
        {/* Courier Info */}
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$3" alignItems="center">
            <Avatar circular size="$5">
              <Avatar.Image src={`https://i.pravatar.cc/150?u=${bid.courierId}`} />
              <Avatar.Fallback backgroundColor="$primary" />
            </Avatar>
            <YStack>
              <Text fontSize="$5" fontWeight="bold">
                {bid.courierName}
              </Text>
              <XStack space="$1" alignItems="center">
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text fontSize="$3" color="$accent">
                  {bid.courierRating.toFixed(1)}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          <YStack alignItems="flex-end">
            <Text fontSize="$7" fontWeight="bold" color="$primary">
              ${bid.amount}
            </Text>
          </YStack>
        </XStack>

        {/* Vehicle Info */}
        <XStack space="$2" alignItems="center" paddingVertical="$2">
          <Bike size={18} color="$accent" />
          <Text fontSize="$3" color="$accent">
            {bid.vehicleInfo.model} • {bid.vehicleInfo.plateNumber}
          </Text>
        </XStack>

        {/* Estimated Time */}
        <XStack space="$2" alignItems="center">
          <Clock size={16} color="$accent" />
          <Text fontSize="$3" color="$accent">
            Estimated: {bid.estimatedTime} mins
          </Text>
        </XStack>

        {/* Message if available */}
        {bid.message && (
          <Card backgroundColor="$background" padding="$3">
            <Text fontSize="$3" color="$secondary">
              "{bid.message}"
            </Text>
          </Card>
        )}

        {/* Accept Button */}
        {onAccept && !isAccepted && (
          <Button
            backgroundColor="$primary"
            color="white"
            fontWeight="bold"
            onPress={() => onAccept(bid)}
            pressStyle={{ backgroundColor: '$primaryHover' }}
          >
            Accept Offer
          </Button>
        )}

        {isAccepted && (
          <Card backgroundColor="$green10Light" padding="$3">
            <Text fontSize="$4" fontWeight="bold" color="$green10" textAlign="center">
              ✓ Accepted
            </Text>
          </Card>
        )}
      </YStack>
    </Card>
  )
}
