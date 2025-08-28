import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './card'
import { Button } from './button'
import {
  Building,
  MapPin,
  Calendar,
  Heart,
  Eye,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface PropertyCardProps {
  property: Property
  onViewDetails: (property: Property) => void
  onApply: (propertyId: string) => void
  onToggleSaved: (propertyId: string) => void
  isSaved: boolean
  className?: string
}

export function PropertyCard({
  property,
  onViewDetails,
  onApply,
  onToggleSaved,
  isSaved,
  className,
}: PropertyCardProps) {
  return (
    <Card
      className={cn(
        'bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden',
        className
      )}
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
            onClick={() => onToggleSaved(property.id)}
            className={cn(
              'p-1 h-auto transition-all duration-200',
              isSaved
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            )}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all duration-200',
                isSaved ? 'fill-current scale-110' : 'group-hover:scale-110'
              )}
            />
          </Button>
        </div>
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
              onClick={() => onViewDetails(property)}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              onClick={() => onApply(property.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
