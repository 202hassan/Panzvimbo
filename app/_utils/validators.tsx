// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Password validation
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Plate number validation
export const validatePlateNumber = (plate: string): boolean => {
  // Basic alphanumeric validation, adjust regex based on your region
  const plateRegex = /^[A-Z0-9]{3,10}$/i
  return plateRegex.test(plate.replace(/\s/g, ''))
}

// Price validation
export const validatePrice = (price: string | number): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) && numPrice > 0 && numPrice < 10000
}

// Location validation
export const validateLocation = (location: {
  latitude: number
  longitude: number
}): boolean => {
  return (
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  )
}
