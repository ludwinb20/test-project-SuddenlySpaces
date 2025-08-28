'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Building,
  DollarSign,
  TrendingUp,
  MapPin,
  BarChart3,
  PieChart,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Layout from '@/components/layout'

interface Property {
  id: string
  title: string
  city: string
  rentAmount: number
  propertyType: string
  isAvailable: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/properties/my-properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Calculate metrics
  const totalProperties = properties.length
  const availableProperties = properties.filter((p) => p.isAvailable).length
  const totalRevenue = properties.reduce((sum, p) => sum + p.rentAmount, 0)

  // Property type distribution
  const propertyTypeStats = properties.reduce((acc, property) => {
    acc[property.propertyType] = (acc[property.propertyType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // City distribution
  const cityStats = properties.reduce((acc, property) => {
    acc[property.city] = (acc[property.city] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const isOwner = session.user.role === 'OWNER'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-xl text-gray-600">
              {"Here's your overview of the rental marketplace"}
            </p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Properties
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalProperties}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      {availableProperties} available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Potential income
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Occupancy Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalProperties > 0
                        ? Math.round(
                            ((totalProperties - availableProperties) /
                              totalProperties) *
                              100
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                      Properties rented
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Type Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-900">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Property Types
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Distribution by property type
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Object.entries(propertyTypeStats).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                  {Object.keys(propertyTypeStats).length === 0 && (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No properties yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* City Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-900">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Properties by City
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Distribution by location
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Object.entries(cityStats).map(([city, count]) => (
                    <div
                      key={city}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">{city}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                  {Object.keys(cityStats).length === 0 && (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No properties yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isOwner ? (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        My Properties
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Manage your property listings
                      </p>
                      <Button
                        onClick={() => router.push('/my-properties')}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <span>View Properties</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Add Property
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        List a new property
                      </p>
                      <Button
                        onClick={() => router.push('/my-properties')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <span>Add New Property</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Browse Properties
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Find your perfect space
                    </p>
                    <Button
                      onClick={() => router.push('/properties')}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <span>Browse Properties</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    </div>
  )
}
