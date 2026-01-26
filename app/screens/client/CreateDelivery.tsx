import React, { useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import { YStack, XStack, Text, Input, Button, Card, Select } from 'tamagui'
import { MapPin, Package, DollarSign, ChevronDown } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { addDelivery } from '../../store/deliverySlice'
import { deliveryService, CreateDeliveryData } from '../../services/deliverySlice'
import * as Location from 'expo-location'

export default function CreateDelivery() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateDeliveryData>({
    pickupLocation: {
      latitude: 0,
      longitude: 0,
      address: '',
    },
    dropoffLocation: {
      latitude: 0,
      longitude: 0,
      address: '',
    },
    packageDetails: {
      description: '',
      size: 'medium',
    },
    suggestedPrice: undefined,
  })

  const getCurrentLocation = async (type: 'pickup' | 'dropoff') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      const addressString = address[0]
        ? `${address[0].street}, ${address[0].city}, ${address[0].region}`
        : 'Location selected'

      setFormData((prev) => ({
        ...prev,
        [`${type}Location`]: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: addressString,
        },
      }))
    } catch (error) {
      Alert.alert('Error', 'Failed to get location')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.pickupLocation.address || !formData.dropoffLocation.address) {
      Alert.alert('Error', 'Please select pickup and dropoff locations')
      return
    }

    if (!formData.packageDetails.description) {
      Alert.alert('Error', 'Please describe your package')
      return
    }

    setLoading(true)
    try {
      const newDelivery = await deliveryService.createDelivery(formData)
      dispatch(addDelivery(newDelivery))
      Alert.alert('Success', 'Delivery request created! Couriers can now bid on it.')
      router.back()
    } catch (error: any) {
      Alert.alert('Error', error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack padding="$4" space="$4">
        <Text fontSize="$8" fontWeight="bold">
          Create Delivery
        </Text>

        {/* Pickup Location */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <MapPin size={20} color="#FF6B35" />
              <Text fontSize="$5" fontWeight="bold">
                Pickup Location
              </Text>
            </XStack>
            <Input
              placeholder="Enter pickup address"
              value={formData.pickupLocation.address}
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  pickupLocation: { ...prev.pickupLocation, address: text },
                }))
              }
            />
            <Button
              size="$3"
              backgroundColor="$secondary"
              onPress={() => getCurrentLocation('pickup')}
            >
              Use Current Location
            </Button>
          </YStack>
        </Card>

        {/* Dropoff Location */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <MapPin size={20} color="#4CAF50" />
              <Text fontSize="$5" fontWeight="bold">
                Dropoff Location
              </Text>
            </XStack>
            <Input
              placeholder="Enter dropoff address"
              value={formData.dropoffLocation.address}
              onChangeText={(text: string) =>

                setFormData((prev) => ({
                  ...prev,
                  dropoffLocation: { ...prev.dropoffLocation, address: text },
                }))
              }
            />
            <Button
              size="$3"
              backgroundColor="$secondary"
              onPress={() => getCurrentLocation('dropoff')}
            >
              Use Current Location
            </Button>
          </YStack>
        </Card>

        {/* Package Details */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <Package size={20} color="#4F5D75" />
              <Text fontSize="$5" fontWeight="bold">
                Package Details
              </Text>
            </XStack>
            <Input
              placeholder="What are you sending?"
              value={formData.packageDetails.description}
            onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  packageDetails: { ...prev.packageDetails, description: text },
                }))
              }
              multiline
              numberOfLines={3}
            />

            <YStack space="$2">
              <Text fontSize="$4">Package Size</Text>
              <XStack space="$2">
                {['small', 'medium', 'large'].map((size) => (
                  <Button
                    key={size}
                    flex={1}
                    size="$3"
                    backgroundColor={
                      formData.packageDetails.size === size ? '$primary' : '$cardBackground'
                    }
                    color={formData.packageDetails.size === size ? 'white' : '$secondary'}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        packageDetails: {
                          ...prev.packageDetails,
                          size: size as 'small' | 'medium' | 'large',
                        },
                      }))
                    }
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Button>
                ))}
              </XStack>
            </YStack>

            <Input
              placeholder="Weight (kg) - optional"
              keyboardType="numeric"
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  packageDetails: {
                    ...prev.packageDetails,
                    weight: text ? parseFloat(text) : undefined,
                  },
                }))
              }
            />
          </YStack>
        </Card>

        {/* Suggested Price */}
        <Card padding="$4" backgroundColor="$cardBackground">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <DollarSign size={20} color="#FF6B35" />
              <Text fontSize="$5" fontWeight="bold">
                Suggested Price (Optional)
              </Text>
            </XStack>
            <Text fontSize="$3" color="$accent">
              Couriers can bid above or below this amount
            </Text>
            <Input
              placeholder="Enter amount in $"
              keyboardType="numeric"
              value={formData.suggestedPrice?.toString()}
            onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  suggestedPrice: text ? parseFloat(text) : undefined,
                }))
              }
            />
          </YStack>
        </Card>

        {/* Submit Button */}
        <Button
          size="$5"
          backgroundColor="$primary"
          color="white"
          fontWeight="bold"
          onPress={handleSubmit}
          disabled={loading}
          pressStyle={{ backgroundColor: '$primaryHover' }}
          marginTop="$4"
          marginBottom="$8"
        >
          {loading ? 'Creating...' : 'Create Delivery Request'}
        </Button>
      </YStack>
    </ScrollView>
  )
}
