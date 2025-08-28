'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Shield,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Mail,
  Phone,
  Calendar,
  Eye,
  FileText,
} from 'lucide-react'
import Layout from '@/components/layout'
import { toast } from 'react-hot-toast'

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  status: 'ACTIVE' | 'INACTIVE'
  lastActivity: string
  propertiesViewed: number
  applicationsSubmitted: number
}

interface RiskScoreResult {
  tenantId: string | null
  riskScore: number
}

export default function RiskAssessmentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTenants, setIsLoadingTenants] = useState(true)
  const [result, setResult] = useState<RiskScoreResult | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Redirect if not owner
  if (session?.user?.role !== 'OWNER') {
    router.push('/dashboard')
    return null
  }

  // Load tenants list
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants')
        const data = await response.json()

        if (data.success) {
          setTenants(data.data)
        } else {
          toast.error('Error loading tenants list')
        }
      } catch (error) {
        console.error('Error fetching tenants:', error)
        toast.error('Error connecting to server')
      } finally {
        setIsLoadingTenants(false)
      }
    }

    fetchTenants()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTenant) {
      toast.error('Please select a tenant')
      return
    }

    setIsLoading(true)

    try {
      const url = `/api/risk-score?tenantId=${encodeURIComponent(
        selectedTenant.id
      )}`
      const response = await fetch(url, {
        method: 'GET',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast.success('Risk score generated successfully')
      } else {
        toast.error(data.error || 'Error generating risk score')
      }
    } catch (error) {
      console.error('Error generating risk score:', error)
      toast.error('Error connecting to server')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevelIcon = (score: number) => {
    if (score < 30) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (score < 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'LOW RISK'
    if (score < 70) return 'MEDIUM RISK'
    return 'HIGH RISK'
  }

  const getRiskLevelColor = (score: number) => {
    if (score < 30) return 'bg-green-100 text-green-800 border-green-200'
    if (score < 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600'
    if (score < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Filter tenants by search
  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Risk Assessment
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select a tenant from the list to generate their fictional risk score.
            This is a simulation that returns a random number between 0-100.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tenants List */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Tenants List</span>
                </CardTitle>
                <CardDescription>
                  Select a tenant to assess their risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by name, email or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* List */}
                {isLoadingTenants ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                    <p className="text-slate-500 mt-2">
                      Loading tenants...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTenants.map((tenant) => (
                      <div
                        key={tenant.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedTenant?.id === tenant.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {tenant.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {tenant.id}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              tenant.status
                            )}`}
                          >
                            {tenant.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {tenant.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {tenant.phone}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {tenant.propertiesViewed} properties
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              {tenant.applicationsSubmitted} applications
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Last activity:{' '}
                            {new Date(tenant.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate Button */}
            {selectedTenant && (
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900">
                          {selectedTenant.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {selectedTenant.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Generate Risk Score
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Result */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Main Score */}
                <Card className="bg-white shadow-sm border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Risk Score</span>
                      {getRiskLevelIcon(result.riskScore)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div
                        className={`text-6xl font-bold ${getScoreColor(
                          result.riskScore
                        )}`}
                      >
                        {result.riskScore}
                      </div>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(
                          result.riskScore
                        )}`}
                      >
                        {getRiskLevel(result.riskScore)}
                      </div>
                      <p className="text-slate-600 text-sm">
                        {result.riskScore < 30 &&
                          'Excellent candidate. Very low risk.'}
                        {result.riskScore >= 30 &&
                          result.riskScore < 70 &&
                          'Moderate candidate. Requires additional evaluation.'}
                        {result.riskScore >= 70 &&
                          'High risk. Not recommended without additional guarantees.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Result Information */}
                <Card className="bg-white shadow-sm border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Result Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700">
                          Evaluated Tenant:
                        </span>
                        <span className="text-slate-600">
                          {selectedTenant?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700">
                          Tenant ID:
                        </span>
                        <span className="text-slate-600">
                          {result.tenantId || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700">
                          Score:
                        </span>
                        <span className="text-slate-600">
                          {result.riskScore}/100
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        ⚠️ This is a fictional score generated randomly for demonstration purposes.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Placeholder when no result */}
            {!result && (
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Risk Assessment
                      </h3>
                      <p className="text-slate-600">
                        Select a tenant from the list to generate their risk score.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
