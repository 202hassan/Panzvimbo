import React from 'react'
import { Card, XStack, YStack, Text, Button } from 'tamagui'
import { MapPin, Package, DollarSign, Clock } from '@tamagui/lucide-icons'
import { Delivery } from '../store/deliverySlice'

interface JobCardProps {
  delivery: Delivery
  onBid?: (delivery: Delivery) => void
  onViewDetails?: (delivery: Delivery) => void
}

export default function JobCard({ delivery, onBid, onViewDetails }: JobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '$yellow10'
      case 'bidding':
        return '$blue10'
      case 'accepted':
        return '$green10'
      case 'in_progress':
        return '$orange10'
      case 'completed':
        return '$gray10'
      default:
        return '$gray10'
    }
  }

  return (
    <Card
      elevate
      size="$4"
      bordered
      backgroundColor="$cardBackground"
      marginVertical="$2"
      padding="$4"
      pressStyle={{ scale: 0.98 }}
      onPress={() => onViewDetails?.(delivery)}
    >
      <YStack space="$3">
        {/* Header with status */}
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$accent">
            {new Date(delivery.createdAt).toLocaleDateString()}
          </Text>
          <Card
            backgroundColor={getStatusColor(delivery.status)}
            paddingHorizontal="$3"
            paddingVertical="$1"
          >
            <Text fontSize="$2" color="white" textTransform="uppercase" fontWeight="bold">
              {delivery.status.replace('_', ' ')}
            </Text>
          </Card>
        </XStack>

        {/* Pickup Location */}
        <XStack space="$2" alignItems="flex-start">
          <MapPin size={18} color="$primary" />
          <YStack flex={1}>
            <Text fontSize="$2" color="$accent" fontWeight="bold">
              PICKUP
            </Text>
            <Text fontSize="$4" numberOfLines={2}>
              {delivery.pickupLocation.address}
            </Text>
          </YStack>
        </XStack>

        {/* Dropoff Location */}
        <XStack space="$2" alignItems="flex-start">
          <MapPin size={18} color="$green10" />
          <YStack flex={1}>
            <Text fontSize="$2" color="$accent" fontWeight="bold">
              DROPOFF
            </Text>
            <Text fontSize="$4" numberOfLines={2}>
              {delivery.dropoffLocation.address}
            </Text>
          </YStack>
        </XStack>

        {/* Package Details */}
        <XStack space="$2" alignItems="center">
          <Package size={16} color="$accent" />
          <Text fontSize="$3" color="$accent">
            {delivery.packageDetails.description}
            {delivery.packageDetails.size && ` • ${delivery.packageDetails.size}`}
          </Text>
        </XStack>

        {/* Price and Bids Info */}
        <XStack justifyContent="space-between" alignItems="center" paddingTop="$2">
          {delivery.suggestedPrice && (
            <XStack space="$1" alignItems="center">
              <DollarSign size={18} color="$primary" />
              <Text fontSize="$6" fontWeight="bold" color="$primary">
                ${delivery.suggestedPrice}
              </Text>
              <Text fontSize="$3" color="$accent">
                suggested
              </Text>
            </XStack>
          )}

          {delivery.bids.length > 0 && (
            <XStack space="$1" alignItems="center">
              <Clock size={16} color="$accent" />
              <Text fontSize="$3" color="$accent">
                {delivery.bids.length} {delivery.bids.length === 1 ? 'bid' : 'bids'}
              </Text>
            </XStack>
          )}
        </XStack>

        {/* Action Button */}
        {onBid && delivery.status === 'pending' && (
          <Button
            backgroundColor="$primary"
            color="white"
            fontWeight="bold"
            onPress={() => onBid(delivery)}
            pressStyle={{ backgroundColor: '$primaryHover' }}
          >
            Place Bid
          </Button>
        )}
      </YStack>
    </Card>
  )
}
