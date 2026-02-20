import React, { useState } from 'react'
import { ScrollView, Alert, TextInput } from 'react-native'
import { YStack, XStack, Text, Button, Card, Select } from 'tamagui'
import { MapPin, Package, DollarSign, ChevronDown } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { addDelivery } from '../../_store/deliverySlice'
import type { RootState } from '../../_store'
import { deliveryService, CreateDeliveryData } from '../../_services/deliverySlice'
import * as Location from 'expo-location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CreateDelivery() {
  const router = useRouter()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const insets = useSafeAreaInsets()
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
    if (!currentUser) {
      Alert.alert('Not logged in', 'Please log in before creating a delivery')
      return
    }
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
      const newDelivery = await deliveryService.createDelivery({
        ...formData,
        clientId: currentUser.id,
      })
      // newDelivery comes from the backend (Mongo _id etc.). For now we just store it as-is.
      dispatch(addDelivery(newDelivery as any))
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
      <YStack padding="$4" space="$4" paddingTop={insets.top + 16} paddingBottom={insets.bottom + 100}>
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
            <TextInput
              placeholder="Enter pickup address"
              value={formData.pickupLocation.address}
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  pickupLocation: { ...prev.pickupLocation, address: text },
                }))
              }
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#000',
              }}
              placeholderTextColor="#999"
            />
            <Button
              height={40}
              paddingVertical={8}
              paddingHorizontal={12}
              fontSize={14}
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
            <TextInput
              placeholder="Enter dropoff address"
              value={formData.dropoffLocation.address}
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  dropoffLocation: { ...prev.dropoffLocation, address: text },
                }))
              }
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#000',
              }}
              placeholderTextColor="#999"
            />
            <Button
              height={40}
              paddingVertical={8}
              paddingHorizontal={12}
              fontSize={14}
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
            <TextInput
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
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#000',
                textAlignVertical: 'top',
              }}
              placeholderTextColor="#999"
            />

            <YStack space="$2">
              <Text fontSize="$4">Package Size</Text>
              <XStack space="$2">
                {['small', 'medium', 'large'].map((size) => (
                  <Button
                    key={size}
                    flex={1}
                    height={38}
                    paddingVertical={8}
                    paddingHorizontal={12}
                    fontSize={13}
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

            <TextInput
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
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#000',
              }}
              placeholderTextColor="#999"
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
            <TextInput
              placeholder="Enter amount in $"
              keyboardType="numeric"
              value={formData.suggestedPrice?.toString()}
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  suggestedPrice: text ? parseFloat(text) : undefined,
                }))
              }
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#000',
              }}
              placeholderTextColor="#999"
            />
          </YStack>
        </Card>

        {/* Submit Button */}
        <Button
          width="100%"
          height={50}
          paddingVertical={12}
          paddingHorizontal={20}
          fontSize={16}
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
