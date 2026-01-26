import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Alert } from 'react-native'
import { YStack, Text, Card, Input, XStack, Button, Dialog } from 'tamagui'
import { Search, Filter } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setDeliveries } from '../../store/deliverySlice'
import { deliveryService, CreateBidData } from '../../services/deliverySlice'
import { Delivery } from '../../store/deliverySlice'
import JobCard from '../../components/JobCard'
import * as Location from 'expo-location'

export default function JobFeed() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { deliveries } = useSelector((state: RootState) => state.delivery)
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Delivery | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [showBidDialog, setShowBidDialog] = useState(false)

  const fetchJobs = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find jobs')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const jobs = await deliveryService.getAvailableJobs({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      dispatch(setDeliveries(jobs))
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchJobs()
    setRefreshing(false)
  }

  const handleBid = (delivery: Delivery) => {
    setSelectedJob(delivery)
    setBidAmount(delivery.suggestedPrice?.toString() || '')
    setEstimatedTime('30')
    setBidMessage('')
    setShowBidDialog(true)
  }

  const submitBid = async () => {
    if (!selectedJob || !bidAmount || !estimatedTime) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    const bidData: CreateBidData = {
      deliveryId: selectedJob.id,
      amount: parseFloat(bidAmount),
      estimatedTime: parseInt(estimatedTime),
      message: bidMessage || undefined,
    }

    try {
      await deliveryService.placeBid(bidData)
      Alert.alert('Success', 'Your bid has been placed!')
      setShowBidDialog(false)
      fetchJobs()
    } catch (error: any) {
      Alert.alert('Error', error.toString())
    }
  }

  const filteredJobs = deliveries.filter(
    (job) =>
      job.status === 'pending' &&
      (job.pickupLocation.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.dropoffLocation.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.packageDetails.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop="$4">
      {/* Header */}
      <YStack paddingHorizontal="$4" paddingBottom="$4" space="$3">
        <Text fontSize="$8" fontWeight="bold">
          Available Jobs
        </Text>

        {/* Search Bar */}
        <XStack space="$2" alignItems="center">
          <Card flex={1} padding="$0" backgroundColor="$cardBackground">
            <XStack alignItems="center" paddingHorizontal="$3">
              <Search size={20} color="#4F5D75" />
              <Input
                flex={1}
                placeholder="Search deliveries..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                borderWidth={0}
                backgroundColor="transparent"
              />
            </XStack>
          </Card>
          <Button
            icon={<Filter size={20} />}
            backgroundColor="$cardBackground"
            color="$secondary"
            circular
          />
        </XStack>
      </YStack>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={({ item }) => <JobCard delivery={item} onBid={handleBid} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
          <Text fontSize="$6" fontWeight="bold" color="$accent">
            No jobs available
          </Text>
          <Text fontSize="$4" color="$accent" textAlign="center" marginTop="$2">
            Check back later for new delivery requests
          </Text>
        </YStack>
      )}

      {/* Bid Dialog */}
      <Dialog modal open={showBidDialog} onOpenChange={setShowBidDialog}>
        <Dialog.Portal>
          <Dialog.Overlay opacity={0.5} />
          <Dialog.Content
            bordered
            elevate
            padding="$4"
            space="$4"
            backgroundColor="$background"
            width="90%"
            maxWidth={400}
          >
            <Dialog.Title fontSize="$7" fontWeight="bold">
              Place Your Bid
            </Dialog.Title>

            <YStack space="$3">
              {selectedJob && (
                <Card padding="$3" backgroundColor="$cardBackground">
                  <Text fontSize="$3" color="$accent">
                    Suggested Price: ${selectedJob.suggestedPrice || 'Not set'}
                  </Text>
                </Card>
              )}

              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Your Bid Amount ($) *
                </Text>
                <Input
                  placeholder="Enter amount"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="numeric"
                />
              </YStack>

              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Estimated Time (minutes) *
                </Text>
                <Input
                  placeholder="Enter estimated time"
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                  keyboardType="numeric"
                />
              </YStack>

              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Message (Optional)
                </Text>
                <Input
                  placeholder="Add a message to stand out..."
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  multiline
                  numberOfLines={3}
                />
              </YStack>

              <XStack space="$2" marginTop="$2">
                <Button
                  flex={1}
                  backgroundColor="$cardBackground"
                  color="$secondary"
                  onPress={() => setShowBidDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  flex={1}
                  backgroundColor="$primary"
                  color="white"
                  fontWeight="bold"
                  onPress={submitBid}
                >
                  Submit Bid
                </Button>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
