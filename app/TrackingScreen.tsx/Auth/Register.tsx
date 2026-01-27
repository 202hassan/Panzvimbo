import React, { useState } from 'react'
import { Alert, ScrollView, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native'
import { YStack, XStack, Text, Button, Card } from 'tamagui'
import { User, Mail, Phone, Lock } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../../_store/userSlice'
import { authService, RegisterData } from '../../_services/authService'

export default function Register() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'client' | 'courier'>('client')

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'client',
    vehicleInfo: {
      model: '',
      plateNumber: '',
      color: '',
    },
  })

  const handleRegister = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    if (userType === 'courier') {
      if (!formData.vehicleInfo?.model || !formData.vehicleInfo?.plateNumber) {
        Alert.alert('Error', 'Please provide vehicle information')
        return
      }
    }

    setLoading(true)
    try {
      const dataToSubmit = {
        ...formData,
        userType,
        vehicleInfo: userType === 'courier' ? formData.vehicleInfo : undefined,
      }

      const response = await authService.register(dataToSubmit)
      dispatch(setUser(response.user))
      dispatch(setToken(response.token))

      Alert.alert('Success', 'Account created successfully!')

      // Navigate based on user type
      if (userType === 'client') {
        router.replace('/screens/client/HomeScreen')
      } else {
        router.replace('/TrackingScreen.tsx/courier/CourierHome')
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff' }}
      >
        <YStack padding="$6" space="$5">
          {/* Header */}
          <YStack alignItems="center" space="$3" paddingTop="$6">
            <Image
              source={require('../../assets/panzvimbo logo.png')}
              style={{ width: 120, height: 120, resizeMode: 'contain' }}
            />
            <Text fontSize="$8" fontWeight="bold">
              Create Account
            </Text>
            <Text fontSize="$4" color="$accent" textAlign="center">
              Join Panzvimbo and start delivering or shipping today
            </Text>
          </YStack>

          {/* User Type Selection */}
          <Card padding="$4" backgroundColor="$cardBackground">
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="bold">
                I want to:
              </Text>
              <XStack space="$3">
                <Button
                  flex={1}
                  height={44}
                  paddingVertical={10}
                  paddingHorizontal={16}
                  backgroundColor={userType === 'client' ? '$primary' : '$background'}
                  color={userType === 'client' ? 'white' : '$secondary'}
                  fontSize={14}
                  fontWeight="bold"
                  onPress={() => setUserType('client')}
                >
                  Send Packages
                </Button>
                <Button
                  flex={1}
                  height={44}
                  paddingVertical={10}
                  paddingHorizontal={16}
                  backgroundColor={userType === 'courier' ? '$primary' : '$background'}
                  color={userType === 'courier' ? 'white' : '$secondary'}
                  fontSize={14}
                  fontWeight="bold"
                  onPress={() => setUserType('courier')}
                >
                  Deliver Packages
                </Button>
              </XStack>
            </YStack>
          </Card>

          {/* Registration Form */}
          <Card padding="$5" backgroundColor="$cardBackground">
            <YStack space="$4">
              {/* Name */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Full Name *
                </Text>
                <XStack
                  space="$2"
                  alignItems="center"
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                >
                  <User size={20} color="#4F5D75" />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#000', padding: 0 }}
                    placeholder="John Doe"
                    placeholderTextColor="#999"
                    value={formData.name}
                    onChangeText={(text: string) => setFormData({ ...formData, name: text })}
                  />
                </XStack>
              </YStack>

              {/* Email */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Email *
                </Text>
                <XStack
                  space="$2"
                  alignItems="center"
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                >
                  <Mail size={20} color="#4F5D75" />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#000', padding: 0 }}
                    placeholder="your@email.com"
                    placeholderTextColor="#999"
                    value={formData.email}
                    onChangeText={(text: string) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </XStack>
              </YStack>

              {/* Phone */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Phone Number *
                </Text>
                <XStack
                  space="$2"
                  alignItems="center"
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                >
                  <Phone size={20} color="#4F5D75" />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#000', padding: 0 }}
                    placeholder="+1234567890"
                    placeholderTextColor="#999"
                    value={formData.phone}
                    onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
                    keyboardType="phone-pad"
                  />
                </XStack>
              </YStack>

              {/* Password */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Password *
                </Text>
                <XStack
                  space="$2"
                  alignItems="center"
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                >
                  <Lock size={20} color="#4F5D75" />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: '#000', padding: 0 }}
                    placeholder="Create a strong password"
                    placeholderTextColor="#999"
                    value={formData.password}
                    onChangeText={(text: string) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                  />
                </XStack>
              </YStack>

              {/* Vehicle Info (Courier Only) */}
              {userType === 'courier' && (
                <>
                  <Text fontSize="$5" fontWeight="bold" marginTop="$2">
                    Vehicle Information
                  </Text>

                  <YStack space="$2">
                    <Text fontSize="$4" fontWeight="bold">
                      Motorcycle Model *
                    </Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#000' }}
                      placeholder="e.g. Honda CB500X"
                      placeholderTextColor="#999"
                      value={formData.vehicleInfo?.model}
                      onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, model: text },
                        })
                      }
                    />
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$4" fontWeight="bold">
                      Plate Number *
                    </Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#000' }}
                      placeholder="ABC123"
                      placeholderTextColor="#999"
                      value={formData.vehicleInfo?.plateNumber}
                      onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, plateNumber: text },
                        })
                      }
                      autoCapitalize="characters"
                    />
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$4" fontWeight="bold">
                      Color
                    </Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#000' }}
                      placeholder="Red"
                      placeholderTextColor="#999"
                      value={formData.vehicleInfo?.color}
                      onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, color: text },
                        })
                      }
                    />
                  </YStack>
                </>
              )}

              <Button
                width="100%"
                height={50}
                paddingVertical={12}
                paddingHorizontal={20}
                backgroundColor="$primary"
                color="white"
                fontWeight="bold"
                fontSize={16}
                onPress={handleRegister}
                disabled={loading}
                pressStyle={{ backgroundColor: '$primaryHover' }}
                marginTop="$3"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </YStack>
          </Card>

          {/* Login Link */}
          <XStack justifyContent="center" space="$2" paddingBottom="$8">
            <Text fontSize="$4" color="$accent">
              Already have an account?
            </Text>
            <Text
              fontSize="$4"
              color="$primary"
              fontWeight="bold"
              onPress={() => router.push('/TrackingScreen.tsx/Auth/Login')}
              pressStyle={{ opacity: 0.7 }}
            >
              Login
            </Text>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
