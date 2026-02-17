import * as React from "react";
import { useImperativeHandle, forwardRef, useState } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Modal } from "react-native";

interface Bid {
  id: string;
  courierName: string;
  price: number;
  eta: number;
  rating?: number;
}

interface OffersBottomSheetProps {
  bids: Bid[];
  onAccept: (bid: Bid) => void;
}

export interface OffersBottomSheetRef {
  expand: () => void;
  close: () => void;
}

const OffersBottomSheet = forwardRef<OffersBottomSheetRef, OffersBottomSheetProps>(
  ({ bids, onAccept }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      expand: () => setIsVisible(true),
      close: () => setIsVisible(false),
    }));

    const renderBidItem = ({ item }: { item: Bid }) => (
      <View style={styles.bidItem}>
        <View style={styles.bidInfo}>
          <Text style={styles.courierName}>{item.courierName}</Text>
          <Text style={styles.eta}>ETA: {item.eta} mins</Text>
          {item.rating && <Text style={styles.rating}>⭐ {item.rating}</Text>}
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.price}>${item.price}</Text>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              onAccept(item);
              setIsVisible(false);
            }}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Available Offers</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={bids}
              renderItem={renderBidItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
            />
          </View>
        </View>
      </Modal>
    );
  }
);

OffersBottomSheet.displayName = "OffersBottomSheet";

export default OffersBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  bidItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bidInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  eta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: "#FF9500",
  },
  priceSection: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
