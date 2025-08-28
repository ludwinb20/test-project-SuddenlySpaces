'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Home,
  Users,
  FileText,
} from 'lucide-react'

interface Property {
  id: string
  title: string
  description?: string
  location: string
  city: string
  rentAmount: number
  propertyType: string
  leaseType: string
  isAvailable: boolean
  createdAt: string
  owner: {
    name: string
    email: string
  }
}

interface Application {
  id: string
  status: string
  riskScore: number
  createdAt: string
  property: {
    title: string
    city: string
  }
}

export default function TenantDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
  })

  useEffect(() => {
    fetchProperties()
    fetchApplications()
  }, [filters])

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.city) params.append('city', filters.city)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.propertyType)
        params.append('propertyType', filters.propertyType)

      const response = await fetch(`/api/properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const handleApply = async (propertyId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        fetchApplications()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to submit application')
      }
    } catch (error) {
      alert('Failed to submit application')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Find Your Perfect Space
        </h2>
        <p className="text-gray-600 mt-1">
          Browse available properties and apply for the ones you like
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Available Properties
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  My Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter((a) => a.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Filters */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <CardTitle className="text-xl">Search Properties</CardTitle>
          <CardDescription>
            Filter properties by location, price, and type
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  placeholder="Enter city"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  placeholder="Min price"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  placeholder="Max price"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters({ ...filters, propertyType: e.target.value })
                  }
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COWORKING">Coworking</option>
                  <option value="SHORT_TERM">Short Term</option>
                </select>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Properties
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Available Properties ({properties.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{property.location}</p>
                  {property.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-green-600">
                      ${property.rentAmount}/month
                    </span>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <Building className="w-3 h-3 mr-1" />
                        {property.propertyType}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <Calendar className="w-3 h-3 mr-1" />
                        {property.leaseType}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Listed by: {property.owner.name}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleApply(property.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {properties.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No properties found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* My Applications */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          My Applications
        </h3>
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.property.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.property.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${getRiskColor(
                          application.riskScore
                        )}`}
                      >
                        {application.riskScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No applications yet. Start browsing properties to apply!
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
