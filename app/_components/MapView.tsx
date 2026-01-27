import React, { useRef, useEffect } from 'react'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, View } from 'react-native'
import { YStack, Card, Text } from 'tamagui'

interface Location {
  latitude: number
  longitude: number
  address?: string
}

interface DeliveryMapViewProps {
  pickupLocation: Location
  dropoffLocation: Location
  courierLocation?: Location
  showRoute?: boolean
}

export default function DeliveryMapView({
  pickupLocation,
  dropoffLocation,
  courierLocation,
  showRoute = false,
}: DeliveryMapViewProps) {
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (mapRef.current && pickupLocation && dropoffLocation) {
      const coordinates = [pickupLocation, dropoffLocation]
      if (courierLocation) {
        coordinates.push(courierLocation)
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      })
    }
  }, [pickupLocation, dropoffLocation, courierLocation])

  return (
    <Card flex={1} overflow="hidden" borderRadius="$4">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Pickup Marker */}
        <Marker
          coordinate={pickupLocation}
          title="Pickup Location"
          description={pickupLocation.address}
          pinColor="#FF6B35"
        />

        {/* Dropoff Marker */}
        <Marker
          coordinate={dropoffLocation}
          title="Dropoff Location"
          description={dropoffLocation.address}
          pinColor="#4CAF50"
        />

        {/* Courier Location */}
        {courierLocation && (
          <Marker
            coordinate={courierLocation}
            title="Courier"
            description="Current location"
            pinColor="#2196F3"
          />
        )}

        {/* Route Line */}
        {showRoute && (
          <Polyline
            coordinates={[pickupLocation, dropoffLocation]}
            strokeColor="#FF6B35"
            strokeWidth={3}
          />
        )}
      </MapView>
    </Card>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
})
