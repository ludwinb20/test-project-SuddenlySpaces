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
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  DollarSign,
  Users,
  TrendingUp,
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
  applications: Application[]
}

interface Application {
  id: string
  status: string
  riskScore: number
  createdAt: string
  tenant: {
    name: string
    email: string
  }
}

export default function OwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    rentAmount: '',
    propertyType: 'RESIDENTIAL',
    leaseType: 'MONTHLY',
  })

  useEffect(() => {
    fetchProperties()
    fetchApplications()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties/my-properties')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rentAmount: parseFloat(formData.rentAmount),
        }),
      })

      if (response.ok) {
        setShowAddForm(false)
        setFormData({
          title: '',
          description: '',
          location: '',
          city: '',
          rentAmount: '',
          propertyType: 'RESIDENTIAL',
          leaseType: 'MONTHLY',
        })
        fetchProperties()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create property')
      }
    } catch (error) {
      alert('Failed to create property')
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Property Owner Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your properties and view applications
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
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
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {properties
                    .reduce((sum, p) => sum + p.rentAmount, 0)
                    .toLocaleString()}
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
                  Applications
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter((p) => p.isAvailable).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Property Form */}
      {showAddForm && (
        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <CardTitle className="text-xl">Add New Property</CardTitle>
            <CardDescription>
              Fill in the details for your new property listing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Property title"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="City"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Address"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Amount
                  </label>
                  <Input
                    required
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, rentAmount: e.target.value })
                    }
                    placeholder="Monthly rent"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyType: e.target.value })
                    }
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COWORKING">Coworking</option>
                    <option value="SHORT_TERM">Short Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Type
                  </label>
                  <select
                    value={formData.leaseType}
                    onChange={(e) =>
                      setFormData({ ...formData, leaseType: e.target.value })
                    }
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="FLEXIBLE">Flexible</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Property description"
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create Property
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Properties Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          My Properties
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
                  <Building className="w-4 h-4 mr-1" />
                  {property.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-green-600">
                      ${property.rentAmount}/month
                    </span>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {property.propertyType}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {property.leaseType}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Apps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {properties.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No properties yet. Add your first property to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Applications */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Applications
        </h3>
        <Card className="bg-white shadow-lg border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.tenant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.tenant.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Property Name
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
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
