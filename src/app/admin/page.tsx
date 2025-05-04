'use client'

import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

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

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
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
                    <h6 className="card-subtitle text-muted mb-1">{item.name}</h6>
                    <h3 className="card-title mb-0">{item.value}</h3>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <i className={`bi ${item.change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'} me-1 ${item.change >= 0 ? 'text-success' : 'text-danger'}`}></i>
                  <span className={`${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {Math.abs(item.change)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Revenue Chart */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Revenue Over Time</h5>
              <div style={{ height: '300px' }}>
                <Line
                  data={{
                    labels: analyticsData.dailyRevenue.map((d) => d.date),
                    datasets: [
                      {
                        label: 'Revenue',
                        data: analyticsData.dailyRevenue.map((d) => d.revenue),
                        borderColor: 'rgb(79, 70, 229)',
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sales by Category</h5>
              <div style={{ height: '300px' }}>
                <Doughnut
                  data={{
                    labels: Object.keys(analyticsData.salesByCategory),
                    datasets: [
                      {
                        data: Object.values(analyticsData.salesByCategory),
                        backgroundColor: [
                          '#4F46E5',
                          '#7C3AED',
                          '#EC4899',
                          '#F59E0B',
                          '#10B981',
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Top Products</h5>
              <div style={{ height: '300px' }}>
                <Bar
                  data={{
                    labels: analyticsData.topProducts.map((p) => p.name),
                    datasets: [
                      {
                        label: 'Sales',
                        data: analyticsData.topProducts.map((p) => p.sales),
                        backgroundColor: 'rgb(79, 70, 229)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 