'use client'

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
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react'
import Layout from '@/components/layout'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
    router.push('/auth/signin')
    return null
  }

  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      icon: User,
      features: [
        'Edit profile information',
        'Change profile picture',
        'Update contact details',
        'Privacy settings',
      ],
    },
    {
      title: 'Security & Privacy',
      description: 'Manage your account security settings',
      icon: Shield,
      features: [
        'Two-factor authentication',
        'Password management',
        'Login history',
        'Data privacy controls',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account preferences and configurations
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Coming Soon Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Settings Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're working hard to bring you comprehensive settings and
                    configuration options. These features will be available in
                    future updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsSections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {section.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Coming in future updates</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Current User Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Current Account Information
              </CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">
                    {session.user.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{session.user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Role
                  </label>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {session.user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </div>
  )
}
