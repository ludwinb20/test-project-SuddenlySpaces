'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
  Home,
  Building,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    ...(session?.user?.role === 'OWNER'
      ? [
          {
            name: 'My Properties',
            href: '/my-properties',
            icon: Building,
          },
          {
            name: 'Risk Assessment',
            href: '/risk-assessment',
            icon: Shield,
          },
          {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
          },
        ]
      : [
          {
            name: 'Browse Properties',
            href: '/properties',
            icon: Search,
          },
          {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
          },
        ]),
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                SuddenlySpaces
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.user.name || session.user.email}
                </p>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {session.user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6 px-3">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-blue-600'
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <ArrowRight className="ml-auto h-4 w-4 text-white/80" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome back,</span>
                <span className="font-semibold text-gray-900">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">
                  {session.user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
