import React, { useState } from 'react'
import { Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native'
import { YStack, XStack, Text, Input, Button, Card } from 'tamagui'
import { Mail, Lock } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../../store/userSlice'
import { authService } from '../../services/authService'

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await authService.login({ email, password })
      dispatch(setUser(response.user))
      dispatch(setToken(response.token))

      // Navigate based on user type
      if (response.user.userType === 'client') {
        router.replace('/screens/client/HomeScreen')
      } else {
        router.replace('/TrackingScreen.tsx/courier/CourierHome')
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.toString())
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
        <YStack flex={1} padding="$6" justifyContent="center" space="$6">
          {/* Logo/Brand */}
          <YStack alignItems="center" space="$4">
            <Image
              source={require('../../assets/panzvimbo logo.png')}
              style={{ width: 150, height: 150, resizeMode: 'contain' }}
            />
            <YStack space="$2" alignItems="center">
              <Text fontSize="$10" fontWeight="bold">
                Panzvimbo
              </Text>
              <Text fontSize="$5" color="$accent">
                Motorcycle Delivery Service
              </Text>
            </YStack>
          </YStack>

          {/* Login Form */}
          <Card padding="$5" backgroundColor="$cardBackground" borderRadius="$4">
            <YStack space="$4">
              <Text fontSize="$7" fontWeight="bold">
                Welcome Back
              </Text>

              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Email
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
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    borderWidth={0}
                    backgroundColor="transparent"
                  />
                </XStack>
              </YStack>

              <YStack space="$2">
                <Text fontSize="$4" fontWeight="bold">
                  Password
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
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    borderWidth={0}
                    backgroundColor="transparent"
                  />
                </XStack>
              </YStack>

              <Button
                size="$5"
                backgroundColor="$primary"
                color="white"
                fontWeight="bold"
                onPress={handleLogin}
                disabled={loading}
                pressStyle={{ backgroundColor: '$primaryHover' }}
                marginTop="$3"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </YStack>
          </Card>

          {/* Sign Up Link */}
          <XStack justifyContent="center" space="$2">
            <Text fontSize="$4" color="$accent">
              Don't have an account?
            </Text>
            <Text
              fontSize="$4"
              color="$primary"
              fontWeight="bold"
              onPress={() => router.push('/TrackingScreen.tsx/Auth/Register')}
              pressStyle={{ opacity: 0.7 }}
            >
              Sign Up
            </Text>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
