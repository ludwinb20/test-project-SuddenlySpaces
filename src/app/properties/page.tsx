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
  Search,
  MapPin,
  Building,
  Calendar,
  Home,
  Filter,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Grid3X3,
  List,
} from 'lucide-react'
import Layout from '@/components/layout'

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

const ITEMS_PER_PAGE = 10

export default function PropertiesPage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    leaseType: '',
  })
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [showDetails, setShowDetails] = useState(false)
  const [savedProperties, setSavedProperties] = useState<string[]>([])

  useEffect(() => {
    fetchProperties()
  }, [currentPage, filters])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(filters.city && { city: filters.city }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.leaseType && { leaseType: filters.leaseType }),
      })

      const response = await fetch(`/api/properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchProperties()
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      leaseType: '',
    })
    setCurrentPage(1) // Reset to first page when clearing filters
    fetchProperties()
  }

  const toggleSaved = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const viewPropertyDetails = (property: Property) => {
    setSelectedProperty(property)
    setShowDetails(true)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Browse Properties
            </h1>
            <p className="text-xl text-gray-600">
              Find your perfect space from our marketplace
            </p>
          </div>

          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-blue-600 mr-2" />
                <CardTitle className="text-xl text-gray-900">
                  Search Filters
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={filters.city}
                        onChange={(e) =>
                          setFilters({ ...filters, city: e.target.value })
                        }
                        placeholder="Enter city"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Price
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minPrice: e.target.value,
                          })
                        }
                        placeholder="Min price"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Price
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxPrice: e.target.value,
                          })
                        }
                        placeholder="Max price"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          propertyType: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COWORKING">Coworking</option>
                      <option value="SHORT_TERM">Short Term</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lease Type
                    </label>
                    <select
                      value={filters.leaseType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          leaseType: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Leases</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="FLEXIBLE">Flexible</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Properties
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Properties Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Properties ({totalCount})
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of{' '}
                  {totalCount} properties
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.map((property) => (
                  <Card
                    key={property.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {property.title}
                          </CardTitle>
                          <CardDescription className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.city}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaved(property.id)}
                          className={`p-1 h-auto transition-all duration-200 ${
                            savedProperties.includes(property.id)
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 transition-all duration-200 ${
                              savedProperties.includes(property.id)
                                ? 'fill-current scale-110'
                                : 'group-hover:scale-110'
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          {property.location}
                        </p>
                        {property.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {property.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-emerald-600">
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
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => viewPropertyDetails(property)}
                            variant="outline"
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentProperties.map((property) => (
                  <Card
                    key={property.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {property.location}, {property.city}
                              </div>
                              {property.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                                  {property.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600">
                                  ${property.rentAmount}/month
                                </div>
                                <div className="text-xs text-gray-500">
                                  Listed by: {property.owner.name}
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-2">
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

                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSaved(property.id)}
                                    className={`p-1 h-auto transition-all duration-200 ${
                                      savedProperties.includes(property.id)
                                        ? 'text-red-500 hover:text-red-600'
                                        : 'text-gray-400 hover:text-red-500'
                                    }`}
                                  >
                                    <Heart
                                      className={`w-5 h-5 transition-all duration-200 ${
                                        savedProperties.includes(property.id)
                                          ? 'fill-current scale-110'
                                          : 'group-hover:scale-110'
                                      }`}
                                    />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      viewPropertyDetails(property)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 hover:bg-gray-50"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No properties found matching your criteria.
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Property Details Modal */}
          {showDetails && selectedProperty && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProperty.title}
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>
                        {selectedProperty.location}, {selectedProperty.city}
                      </span>
                    </div>

                    {selectedProperty.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Description
                        </h3>
                        <p className="text-gray-600">
                          {selectedProperty.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Property Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">
                              {selectedProperty.propertyType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lease:</span>
                            <span className="font-medium">
                              {selectedProperty.leaseType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rent:</span>
                            <span className="font-medium text-emerald-600">
                              ${selectedProperty.rentAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Owner Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">
                              {selectedProperty.owner.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">
                              {selectedProperty.owner.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => setShowDetails(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  )
}
