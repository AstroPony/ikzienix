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

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">No Data Available</h4>
          <p>There is no analytics data available for the selected time range.</p>
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