// Distance calculation using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

// Estimate delivery time based on distance
export const estimateDeliveryTime = (distanceKm: number): number => {
  // Assuming average speed of 30 km/h in city
  const avgSpeed = 30
  return Math.ceil((distanceKm / avgSpeed) * 60) // Return minutes
}

// Get status color
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: '#FFA726',
    bidding: '#42A5F5',
    accepted: '#66BB6A',
    in_progress: '#FF7043',
    completed: '#78909C',
    cancelled: '#EF5350',
  }
  return colors[status] || '#78909C'
}
