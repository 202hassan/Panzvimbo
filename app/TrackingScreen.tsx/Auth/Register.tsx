import React, { useState } from 'react'
import { Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native'
import { YStack, XStack, Text, Input, Button, Card } from 'tamagui'
import { User, Mail, Phone, Lock } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../../store/userSlice'
import { authService, RegisterData } from '../../services/authService'

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
                  size="$4"
                  backgroundColor={userType === 'client' ? '$primary' : '$background'}
                  color={userType === 'client' ? 'white' : '$secondary'}
                  onPress={() => setUserType('client')}
                  fontWeight="bold"
                >
                  Send Packages
                </Button>
                <Button
                  flex={1}
                  size="$4"
                  backgroundColor={userType === 'courier' ? '$primary' : '$background'}
                  color={userType === 'courier' ? 'white' : '$secondary'}
                  onPress={() => setUserType('courier')}
                  fontWeight="bold"
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
                  <Input
                    flex={1}
                    placeholder="John Doe"
                    value={formData.name}
                  onChangeText={(text: string) => setFormData({ ...formData, name: text })}
                    borderWidth={0}
                    backgroundColor="transparent"
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
                  <Input
                    flex={1}
                    placeholder="your@email.com"
                    value={formData.email}
                  onChangeText={(text: string) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    borderWidth={0}
                    backgroundColor="transparent"
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
                  <Input
                    flex={1}
                    placeholder="+1234567890"
                    value={formData.phone}
                  onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
                    keyboardType="phone-pad"
                    borderWidth={0}
                    backgroundColor="transparent"
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
                  <Input
                    flex={1}
                    placeholder="Create a strong password"
                    value={formData.password}
                  onChangeText={(text: string) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                    borderWidth={0}
                    backgroundColor="transparent"
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
                    <Input
                      placeholder="e.g. Honda CB500X"
                      value={formData.vehicleInfo?.model}
                    onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, model: text },
                        })
                      }
                      backgroundColor="$background"
                    />
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$4" fontWeight="bold">
                      Plate Number *
                    </Text>
                    <Input
                      placeholder="ABC123"
                      value={formData.vehicleInfo?.plateNumber}
                    onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, plateNumber: text },
                        })
                      }
                      backgroundColor="$background"
                      autoCapitalize="characters"
                    />
                  </YStack>

                  <YStack space="$2">
                    <Text fontSize="$4" fontWeight="bold">
                      Color
                    </Text>
                    <Input
                      placeholder="Red"
                      value={formData.vehicleInfo?.color}
                    onChangeText={(text: string) =>
                        setFormData({
                          ...formData,
                          vehicleInfo: { ...formData.vehicleInfo!, color: text },
                        })
                      }
                      backgroundColor="$background"
                    />
                  </YStack>
                </>
              )}

              <Button
                size="$5"
                backgroundColor="$primary"
                color="white"
                fontWeight="bold"
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
