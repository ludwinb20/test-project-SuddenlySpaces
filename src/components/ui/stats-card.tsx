import React from 'react'
import { Card, CardContent } from './card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-white',
  iconBgColor = 'bg-gradient-to-r from-blue-500 to-indigo-600',
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300',
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn('p-3 rounded-xl', iconBgColor)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-blue-600 font-medium">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
