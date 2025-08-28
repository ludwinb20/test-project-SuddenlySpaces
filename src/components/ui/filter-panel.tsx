import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Input } from './input'
import {
  Filter,
  Search,
  MapPin,
  DollarSign,
  Building,
  Calendar,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  city?: {
    placeholder?: string
  }
  minPrice?: {
    placeholder?: string
  }
  maxPrice?: {
    placeholder?: string
  }
  propertyType?: {
    options: FilterOption[]
    placeholder?: string
  }
  leaseType?: {
    options: FilterOption[]
    placeholder?: string
  }
}

interface FilterValues {
  city: string
  minPrice: string
  maxPrice: string
  propertyType: string
  leaseType: string
}

interface FilterPanelProps {
  filters: FilterValues
  onFiltersChange: (filters: FilterValues) => void
  onSearch: () => void
  onClear: () => void
  config?: FilterConfig
  className?: string
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  config,
  className,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const defaultConfig: FilterConfig = {
    city: { placeholder: 'Enter city' },
    minPrice: { placeholder: 'Min price' },
    maxPrice: { placeholder: 'Max price' },
    propertyType: {
      options: [
        { value: '', label: 'All Types' },
        { value: 'RESIDENTIAL', label: 'Residential' },
        { value: 'COWORKING', label: 'Coworking' },
        { value: 'SHORT_TERM', label: 'Short Term' },
      ],
      placeholder: 'Select property type',
    },
    leaseType: {
      options: [
        { value: '', label: 'All Leases' },
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'YEARLY', label: 'Yearly' },
        { value: 'FLEXIBLE', label: 'Flexible' },
      ],
      placeholder: 'Select lease type',
    },
  }

  const finalConfig = { ...defaultConfig, ...config }

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <Card
      className={cn(
        'bg-white/80 backdrop-blur-sm border-0 shadow-xl',
        className
      )}
    >
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-blue-600 mr-2" />
            <CardTitle className="text-xl text-gray-900">
              Search Filters
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                onClick={onClear}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSearch()
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={filters.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder={finalConfig.city?.placeholder}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Min Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleInputChange('minPrice', e.target.value)
                    }
                    placeholder={finalConfig.minPrice?.placeholder}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Max Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleInputChange('maxPrice', e.target.value)
                    }
                    placeholder={finalConfig.maxPrice?.placeholder}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      handleInputChange('propertyType', e.target.value)
                    }
                    className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {finalConfig.propertyType?.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lease Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lease Type
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filters.leaseType}
                    onChange={(e) =>
                      handleInputChange('leaseType', e.target.value)
                    }
                    className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {finalConfig.leaseType?.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                onClick={onClear}
                className="border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
