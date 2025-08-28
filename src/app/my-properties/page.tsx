'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  Building,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import Layout from '@/components/layout'
import { toast } from 'react-hot-toast'

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

const ITEMS_PER_PAGE = 6

export default function MyPropertiesPage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    rentAmount: '',
    propertyType: 'RESIDENTIAL',
    leaseType: 'MONTHLY',
  })

  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    fetchProperties()
  }, [currentPage])

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })

      const response = await fetch(`/api/properties/my-properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setIsLoading(false)
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

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProperties()
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      alert('Failed to delete property')
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title,
      description: property.description || '',
      location: property.location,
      city: property.city,
      rentAmount: property.rentAmount.toString(),
      propertyType: property.propertyType,
      leaseType: property.leaseType,
    })
    setShowEditForm(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingProperty) return

    try {
      const response = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rentAmount: parseFloat(formData.rentAmount),
        }),
      })

      if (response.ok) {
        setShowEditForm(false)
        setEditingProperty(null)
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
        alert(error.message || 'Failed to update property')
      }
    } catch (error) {
      alert('Failed to update property')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProperties = properties.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading properties...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Properties</h1>
            <p className="text-slate-600 mt-1">
              Manage your property listings and view applications
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-slate-600 hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Building className="h-6 w-6 text-slate-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    $
                    {properties
                      .reduce((sum, p) => sum + p.rentAmount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {properties.reduce(
                      (sum, p) => sum + p.applications.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Available
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {properties.filter((p) => p.isAvailable).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Property Form */}
        {showAddForm && (
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
              <CardTitle className="text-xl">Add New Property</CardTitle>
              <CardDescription>
                Fill in the details for your new property listing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Property title"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Address"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyType: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COWORKING">Coworking</option>
                      <option value="SHORT_TERM">Short Term</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lease Type
                    </label>
                    <select
                      value={formData.leaseType}
                      onChange={(e) =>
                        setFormData({ ...formData, leaseType: e.target.value })
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="FLEXIBLE">Flexible</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Property description"
                    className="w-full h-24 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-slate-600 hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Create Property
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit Property Form */}
        {showEditForm && editingProperty && (
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
              <CardTitle className="text-xl">Edit Property</CardTitle>
              <CardDescription>
                Update the details for your property listing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Property title"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Address"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyType: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COWORKING">Coworking</option>
                      <option value="SHORT_TERM">Short Term</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lease Type
                    </label>
                    <select
                      value={formData.leaseType}
                      onChange={(e) =>
                        setFormData({ ...formData, leaseType: e.target.value })
                      }
                      className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="FLEXIBLE">Flexible</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Property description"
                    className="w-full h-24 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-slate-600 hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingProperty(null)
                      setFormData({
                        title: '',
                        description: '',
                        location: '',
                        city: '',
                        rentAmount: '',
                        propertyType: 'RESIDENTIAL',
                        leaseType: 'MONTHLY',
                      })
                    }}
                    className="border-slate-300 hover:bg-slate-50"
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Property Listings ({totalCount})
            </h2>
            <div className="text-sm text-slate-500">
              Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of{' '}
              {totalCount} properties
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
              <Card
                key={property.id}
                className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-emerald-600">
                        ${property.rentAmount}/month
                      </span>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          <Building className="w-3 h-3 mr-1" />
                          {property.propertyType}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          <Calendar className="w-3 h-3 mr-1" />
                          {property.leaseType}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Applications: {property.applications.length}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(property)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          (window.location.href = `/applications?propertyId=${property.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Apps
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => goToPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {totalCount === 0 && (
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No properties yet. Add your first property to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
