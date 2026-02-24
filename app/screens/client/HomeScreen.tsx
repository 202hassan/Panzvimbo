import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "../../_utils/mapsConfig";
import type { LocationData } from "../../_types/location";
import { useRouter } from "expo-router";

import LocationInputCard from "../../components/LocationInputCard";
import OffersBottomSheet, { OffersBottomSheetRef } from "../../components/OffersBottomSheet";

const { width, height } = Dimensions.get("window");

const DEFAULT_REGION = {
  latitude: -17.8292,
  longitude: 31.0522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface RouteCoords {
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  distanceText: string;
  durationText: string;
}

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<OffersBottomSheetRef>(null);
  const router = useRouter();

  const [pickup, setPickup] = useState<LocationData | null>(null);
  const [dropoff, setDropoff] = useState<LocationData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [routeCoords, setRouteCoords] = useState<RouteCoords[]>([]);
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

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
    } else {
      // Clear route if one of the locations is cleared/changed
      setRouteCoords([]);
      setRouteInfo(null);
    }
  }, [pickup, dropoff]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
        console.warn("GOOGLE_MAPS_API_KEY is not set. Cannot fetch route.");
        Alert.alert(
          "Map configuration",
          "Google Maps API key is not configured. Please update it to see the route."
        );
        return;
      }

      const startPoint = `${pickup.coords.latitude},${pickup.coords.longitude}`;
      const endPoint = `${dropoff.coords.latitude},${dropoff.coords.longitude}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const json = await response.json();

      if (!json.routes || json.routes.length === 0) {
        setRouteCoords([]);
        setRouteInfo(null);
        Alert.alert(
          "No route found",
          "We couldn't find a driving route between these locations. Try adjusting pickup or dropoff."
        );
        return;
      }

      const route = json.routes[0];
      const leg = route.legs && route.legs[0];

      if (leg && leg.distance && leg.duration) {
        setRouteInfo({
          distanceText: leg.distance.text,
          durationText: leg.duration.text,
        });
      } else {
        setRouteInfo(null);
      }

      const points = decodePolyline(route.overview_polyline.points);
      setRouteCoords(points);

      // Fit map to show the entire route
      if (mapRef.current && points.length > 0) {
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRouteCoords([]);
      setRouteInfo(null);
      Alert.alert(
        "Route error",
        "Something went wrong while fetching the route. Please try again."
      );
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

  const handleConfirmDelivery = () => {
    if (!pickup || !dropoff || !routeInfo) {
      Alert.alert("Incomplete trip", "Please select pickup and dropoff and wait for the route to load.");
      return;
    }

    router.push({
      pathname: "/(tabs)/create",
      params: {
        pickupAddress: pickup.address,
        pickupLat: String(pickup.coords.latitude),
        pickupLng: String(pickup.coords.longitude),
        dropoffAddress: dropoff.address,
        dropoffLat: String(dropoff.coords.latitude),
        dropoffLng: String(dropoff.coords.longitude),
        distanceText: routeInfo.distanceText,
        durationText: routeInfo.durationText,
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={DEFAULT_REGION}
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

      {routeInfo && (
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeInfoText}>
            {routeInfo.distanceText} • {routeInfo.durationText}
          </Text>
        </View>
      )}

      {pickup && dropoff && routeInfo && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDelivery}>
            <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
          </TouchableOpacity>
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
  routeInfoContainer: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  routeInfoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
