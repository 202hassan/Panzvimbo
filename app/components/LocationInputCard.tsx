import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Pressable,
  Animated,
  Keyboard,
  Platform,
} from "react-native";
import * as Location from "expo-location";

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

interface LocationInputCardProps {
  onPickupSelect: (location: LocationData) => void;
  onDropoffSelect: (location: LocationData) => void;
  onComplete: () => void;
  currentLocation?: LocationData;
}

interface PlacePrediction {
  main_text: string;
  secondary_text: string;
  place_id: string;
}

export default function LocationInputCard({
  onPickupSelect,
  onDropoffSelect,
  onComplete,
  currentLocation,
}: LocationInputCardProps) {
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");
  const [pickupPredictions, setPickupPredictions] = useState<PlacePrediction[]>([]);
  const [dropoffPredictions, setDropoffPredictions] = useState<PlacePrediction[]>([]);
  const [pickupSelected, setPickupSelected] = useState<LocationData | null>(null);
  const [dropoffSelected, setDropoffSelected] = useState<LocationData | null>(null);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDropoff, setLoadingDropoff] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const height = e?.endCoordinates?.height ?? 300;
        console.log('keyboard show, height', height);
        Animated.timing(translateY, {
          toValue: -height + 80,
          duration: Platform.OS === "ios" ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        console.log('keyboard hide');
        Animated.timing(translateY, {
          toValue: 0,
          duration: Platform.OS === "ios" ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);

  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your key

  const fetchPlacePredictions = async (input: string, isPickup: boolean) => {
    if (!input || input.length < 2) {
      isPickup ? setPickupPredictions([]) : setDropoffPredictions([]);
      return;
    }

    isPickup ? setLoadingPickup(true) : setLoadingDropoff(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_MAPS_API_KEY}&components=country:zw`
      );

      const data = await response.json();

      if (data.predictions) {
        const predictions = data.predictions.map((p: any) => ({
          main_text: p.structured_formatting.main_text,
          secondary_text: p.structured_formatting.secondary_text || "",
          place_id: p.place_id,
        }));
        isPickup ? setPickupPredictions(predictions) : setDropoffPredictions(predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      isPickup ? setLoadingPickup(false) : setLoadingDropoff(false);
    }
  };

  const fetchCoordinates = async (placeId: string, isPickup: boolean) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.result) {
        const location = {
          coords: {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
          },
          address: data.result.formatted_address,
        };

        if (isPickup) {
          setPickupSelected(location);
          onPickupSelect(location);
          setShowPickupSuggestions(false);
        } else {
          setDropoffSelected(location);
          onDropoffSelect(location);
          setShowDropoffSuggestions(false);
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentLoc = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        address: "Current Location",
      };

      setPickupSelected(currentLoc);
      setPickupText("Current Location");
      onPickupSelect(currentLoc);
      setShowPickupSuggestions(false);
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const handleComplete = () => {
    if (pickupSelected && dropoffSelected) {
      onComplete();
    }
  };

  return (
    <Animated.View style={[styles.animatedWrapper, { transform: [{ translateY }] }] }>
      <ScrollView 
        style={[styles.card, isExpanded && styles.cardExpanded]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={isExpanded || showPickupSuggestions || showDropoffSuggestions}
      >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <Text style={styles.headerText}>
          {pickupSelected && dropoffSelected ? "✓ Locations Selected" : "Select Pickup & Dropoff"}
        </Text>
        <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▲"}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <>
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Pickup Location"
                value={pickupText}
                onChangeText={(text) => {
                  setPickupText(text);
                  setPickupSelected(null);
                  setShowPickupSuggestions(true);
                  fetchPlacePredictions(text, true);
                }}
                onFocus={() => {
                  setShowPickupSuggestions(true);
                  setIsExpanded(true);
                }}
                placeholderTextColor="#999"
              />
              {loadingPickup && (
                <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
              )}
            </View>

            {pickupSelected && (
              <Text style={styles.selectedText}>✓ {pickupSelected.address}</Text>
            )}

            {showPickupSuggestions && pickupPredictions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={handleUseCurrentLocation}
                >
                  <Text style={styles.suggestionText}>📍 Use Current Location</Text>
                </TouchableOpacity>
                {pickupPredictions.map((pred, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => fetchCoordinates(pred.place_id, true)}
                  >
                    <Text style={styles.suggestionText}>{pred.main_text}</Text>
                    <Text style={styles.suggestionSubtext}>{pred.secondary_text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Dropoff Location"
                value={dropoffText}
                onChangeText={(text) => {
                  setDropoffText(text);
                  setDropoffSelected(null);
                  setShowDropoffSuggestions(true);
                  fetchPlacePredictions(text, false);
                }}
                onFocus={() => {
                  setShowDropoffSuggestions(true);
                  setIsExpanded(true);
                }}
                placeholderTextColor="#999"
              />
              {loadingDropoff && (
                <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
              )}
            </View>

            {dropoffSelected && (
              <Text style={styles.selectedText}>✓ {dropoffSelected.address}</Text>
            )}

            {showDropoffSuggestions && dropoffPredictions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {dropoffPredictions.map((pred, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => fetchCoordinates(pred.place_id, false)}
                  >
                    <Text style={styles.suggestionText}>{pred.main_text}</Text>
                    <Text style={styles.suggestionSubtext}>{pred.secondary_text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!pickupSelected || !dropoffSelected) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleComplete}
            disabled={!pickupSelected || !dropoffSelected}
          >
            {({ pressed }) => (
              <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                {pressed ? "Finding Offers..." : "Find Offers"}
              </Text>
            )}
          </Pressable>
        </>
      )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  card: {
    // positioning moved to animatedWrapper
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardExpanded: {
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expandIcon: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
  },
  inputSection: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  loader: {
    marginLeft: 8,
  },
  selectedText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  suggestionsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  suggestionSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 0,
    marginBottom: 4,
  },
  buttonDisabled: {
    backgroundColor: "#B3B3B3",
  },
  buttonPressed: {
    backgroundColor: "#0056CC",
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextPressed: {
    opacity: 0.9,
  },
});
