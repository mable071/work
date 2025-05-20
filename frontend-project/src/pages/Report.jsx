import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    revenueByPaymentMethod: [],
    revenueByService: []
  });
  const [performanceData, setPerformanceData] = useState({
    totalServices: 0,
    totalCost: 0,
    averageCost: 0,
    completedServices: 0,
    serviceRecords: []
  });
  const [inventoryData, setInventoryData] = useState({
    parts: [],
    totalQuantity: 0,
    totalCost: 0
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [revenueRes, performanceRes, inventoryRes] = await Promise.all([
        axios.get('http://localhost:8000/api/reports/revenue', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/reports/performance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/reports/inventory', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setRevenueData(revenueRes.data);
      setPerformanceData(performanceRes.data);
      setInventoryData(inventoryRes.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch report data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports & Analytics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">${revenueData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <WrenchScrewdriverIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-lg font-semibold text-gray-900">{performanceData.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Cost</p>
              <p className="text-lg font-semibold text-gray-900">${performanceData.averageCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Parts Cost</p>
              <p className="text-lg font-semibold text-gray-900">${inventoryData.totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Payment Method */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Revenue by Payment Method</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {revenueData.revenueByPaymentMethod.map((method) => (
              <div key={method.method} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 capitalize">{method.method}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(method.amount / revenueData.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-sm text-gray-600">${method.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Service Performance</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Times Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.revenueByService.map((service) => (
                  <tr key={service.serviceId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${service.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Inventory Status</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.parts.map((part) => (
                  <tr key={part.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{part.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${part.unitCost.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${(part.quantity * part.unitCost).toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 