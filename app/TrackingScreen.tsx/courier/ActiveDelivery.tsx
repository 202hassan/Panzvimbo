import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { YStack, XStack, Text, Button, Card } from 'tamagui'
import { MapPin, User, Phone, Navigation } from '@tamagui/lucide-icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setActiveDelivery } from '../../store/deliverySlice'
import { deliveryService } from '../../services/deliverySlice'
import DeliveryMapView from '../../components/MapView'
import * as Location from 'expo-location'

export default function ActiveDelivery() {
  const dispatch = useDispatch()
  const { activeDelivery } = useSelector((state: RootState) => state.delivery)
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [courierLocation, setCourierLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    // Start tracking location
    let locationSubscription: Location.LocationSubscription

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required')
        return
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
          setCourierLocation(newLocation)

          // Update backend with new location
          if (activeDelivery) {
            deliveryService.updateCourierLocation(activeDelivery.id, newLocation)
          }
        }
      )
    }

    startLocationTracking()

    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [activeDelivery])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!activeDelivery) return

    try {
      const updated = await deliveryService.updateDeliveryStatus(activeDelivery.id, newStatus)
      dispatch(setActiveDelivery(updated))

      if (newStatus === 'completed') {
        Alert.alert('Success', 'Delivery completed! Payment will be processed.')
        dispatch(setActiveDelivery(null))
      }
    } catch (error: any) {
      Alert.alert('Error', error.toString())
    }
  }

  if (!activeDelivery) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text fontSize="$6" color="$accent">
          No active delivery
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Map */}
      <YStack height={300}>
        <DeliveryMapView
          pickupLocation={activeDelivery.pickupLocation}
          dropoffLocation={activeDelivery.dropoffLocation}
          courierLocation={courierLocation || undefined}
          showRoute
        />
      </YStack>

      {/* Delivery Info */}
      <YStack flex={1} padding="$4" space="$4">
        {/* Status */}
        <Card backgroundColor="$primary" padding="$4">
          <Text fontSize="$6" fontWeight="bold" color="white" textAlign="center">
            {activeDelivery.status === 'accepted'
              ? 'Pickup Package'
              : activeDelivery.status === 'in_progress'
              ? 'Delivering...'
              : 'Delivery Status'}
          </Text>
        </Card>

        {/* Client Info */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <User size={20} color="$accent" />
              <Text fontSize="$5" fontWeight="bold">
                {activeDelivery.clientName}
              </Text>
            </XStack>
            <Button
              backgroundColor="$secondary"
              color="white"
              icon={<Phone size={18} color="white" />}
              onPress={() => Alert.alert('Call', 'Calling client...')}
            >
              Call Client
            </Button>
          </YStack>
        </Card>

        {/* Locations */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <YStack space="$1">
              <XStack space="$2" alignItems="center">
                <MapPin size={18} color="#FF6B35" />
                <Text fontSize="$3" color="$accent" fontWeight="bold">
                  PICKUP
                </Text>
              </XStack>
              <Text fontSize="$4">{activeDelivery.pickupLocation.address}</Text>
            </YStack>

            <YStack space="$1">
              <XStack space="$2" alignItems="center">
                <MapPin size={18} color="#4CAF50" />
                <Text fontSize="$3" color="$accent" fontWeight="bold">
                  DROPOFF
                </Text>
              </XStack>
              <Text fontSize="$4">{activeDelivery.dropoffLocation.address}</Text>
            </YStack>
          </YStack>
        </Card>

        {/* Package Details */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$2">
            <Text fontSize="$5" fontWeight="bold">
              Package Details
            </Text>
            <Text fontSize="$4" color="$accent">
              {activeDelivery.packageDetails.description}
            </Text>
            {activeDelivery.packageDetails.size && (
              <Text fontSize="$3" color="$accent">
                Size: {activeDelivery.packageDetails.size}
              </Text>
            )}
          </YStack>
        </Card>

        {/* Action Buttons */}
        <YStack space="$3">
          {activeDelivery.status === 'accepted' && (
            <Button
              size="$5"
              backgroundColor="$primary"
              color="white"
              fontWeight="bold"
              onPress={() => handleStatusUpdate('in_progress')}
            >
              Start Delivery
            </Button>
          )}

          {activeDelivery.status === 'in_progress' && (
            <Button
              size="$5"
              backgroundColor="$green10"
              color="white"
              fontWeight="bold"
              onPress={() => handleStatusUpdate('completed')}
            >
              Complete Delivery
            </Button>
          )}

          <Button
            backgroundColor="$cardBackground"
            color="$accent"
            icon={<Navigation size={18} />}
            onPress={() => Alert.alert('Navigate', 'Opening maps...')}
          >
            Open in Maps
          </Button>
        </YStack>
      </YStack>
    </YStack>
  )
}
