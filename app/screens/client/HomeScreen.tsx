import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

import LocationInputCard from "../../components/LocationInputCard";
import OffersBottomSheet, { OffersBottomSheetRef } from "../../components/OffersBottomSheet";

const { width, height } = Dimensions.get("window");

interface RouteCoords {
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<OffersBottomSheetRef>(null);

  const [pickup, setPickup] = useState<any>(null);
  const [dropoff, setDropoff] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [routeCoords, setRouteCoords] = useState<RouteCoords[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current location on component mount
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const currentCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        };

        setCurrentLocation(currentCoords);

        // Animate map to current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000
          );
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  // Calculate route when both pickup and dropoff are selected
  useEffect(() => {
    if (pickup && dropoff) {
      fetchRoute();
    }
  }, [pickup, dropoff]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      // Using Google Maps Directions API
      // You'll need to add your GOOGLE_MAPS_API_KEY to your environment
      const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

      const startPoint = `${pickup.coords.latitude},${pickup.coords.longitude}`;
      const endPoint = `${dropoff.coords.latitude},${dropoff.coords.longitude}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const json = await response.json();

      if (json.routes.length > 0) {
        const points = decodePolyline(json.routes[0].overview_polyline.points);
        setRouteCoords(points);

        // Fit map to show the entire route
        if (mapRef.current && points.length > 0) {
          mapRef.current.fitToCoordinates(points, {
            edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };

  // Decode Google Maps polyline format
  const decodePolyline = (encoded: string): RouteCoords[] => {
    const poly: RouteCoords[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let result = 0,
        shift = 0;
      let b;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      result = 0;
      shift = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return poly;
  };

  const onLocationsReady = () => {
    bottomSheetRef.current?.expand();
    // Route will be fetched automatically via useEffect
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -17.8292,
          longitude: 31.0522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Current Location Pin */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation.coords}
            title="Current Location"
            description="Your current position"
            pinColor="blue"
          />
        )}

        {/* Pickup Location Pin */}
        {pickup && (
          <Marker
            coordinate={pickup.coords}
            title="Pickup"
            description={pickup.address || "Pickup location"}
            pinColor="green"
          />
        )}

        {/* Dropoff Location Pin */}
        {dropoff && (
          <Marker
            coordinate={dropoff.coords}
            title="Dropoff"
            description={dropoff.address || "Dropoff location"}
            pinColor="red"
          />
        )}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <LocationInputCard
        onPickupSelect={setPickup}
        onDropoffSelect={setDropoff}
        onComplete={onLocationsReady}
      />

      <OffersBottomSheet
        ref={bottomSheetRef}
        bids={bids}
        onAccept={(bid) => console.log("Accepted bid", bid)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -25,
    marginTop: -25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 50,
    padding: 20,
  },
});
