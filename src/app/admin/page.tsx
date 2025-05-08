'use client'

import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import Chart from 'chart.js/auto'

interface AnalyticsData {
  revenue: number
  orders: number
  visitors: number
  newUsers: number
  revenueChange: number
  ordersChange: number
  visitorsChange: number
  newUsersChange: number
  salesByCategory: Record<string, number>
  topProducts: Array<{ name: string; sales: number }>
  dailyRevenue: Array<{ date: string; revenue: number }>
}

const defaultAnalyticsData: AnalyticsData = {
  revenue: 0,
  orders: 0,
  visitors: 0,
  newUsers: 0,
  revenueChange: 0,
  ordersChange: 0,
  visitorsChange: 0,
  newUsersChange: 0,
  salesByCategory: {},
  topProducts: [],
  dailyRevenue: []
}

// Helper function to ensure data has all required fields
function ensureAnalyticsData(data: any): AnalyticsData {
  return {
    revenue: Number(data?.revenue ?? 0),
    orders: Number(data?.orders ?? 0),
    visitors: Number(data?.visitors ?? 0),
    newUsers: Number(data?.newUsers ?? 0),
    revenueChange: Number(data?.revenueChange ?? 0),
    ordersChange: Number(data?.ordersChange ?? 0),
    visitorsChange: Number(data?.visitorsChange ?? 0),
    newUsersChange: Number(data?.newUsersChange ?? 0),
    salesByCategory: data?.salesByCategory ?? {},
    topProducts: Array.isArray(data?.topProducts) ? data.topProducts : [],
    dailyRevenue: Array.isArray(data?.dailyRevenue) ? data.dailyRevenue : []
  }
}

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData)
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalyticsData(ensureAnalyticsData(data))
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
      setAnalyticsData(defaultAnalyticsData)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={fetchAnalytics}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${analyticsData.revenue.toFixed(2)}`,
      icon: 'bi-currency-dollar',
      change: analyticsData.revenueChange,
    },
    {
      name: 'Total Orders',
      value: analyticsData.orders,
      icon: 'bi-cart',
      change: analyticsData.ordersChange,
    },
    {
      name: 'Active Users',
      value: analyticsData.visitors,
      icon: 'bi-people',
      change: analyticsData.visitorsChange,
    },
    {
      name: 'New Users',
      value: analyticsData.newUsers,
      icon: 'bi-person-plus',
      change: analyticsData.newUsersChange,
    },
  ]

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-2">Dashboard</h1>
          <p className="text-muted">
            Overview of your store's performance
          </p>
        </div>
        <div className="w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        {stats.map((item) => (
          <div key={item.name} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0">
                    <i className={`bi ${item.icon} fs-5 text-primary`}></i>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="card-title">{item.name}</h5>
                    <h3 className="card-text">{item.value}</h3>
                    <p className={`card-text text-${item.change >= 0 ? 'success' : 'danger'}`}>
                      {item.change >= 0 ? '+' : ''}
                      {item.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}