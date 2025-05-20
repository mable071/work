import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalServices: 0,
    averageServiceTime: 0,
    activeCustomers: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch service records for stats
      const recordsRes = await axios.get('http://localhost:8000/api/service-records', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Calculate stats from service records
      const records = recordsRes.data;
      const totalRevenue = records.reduce((sum, record) => sum + (record.cost || 0), 0);
      const totalServices = records.length;
      const averageServiceTime = records.length > 0 
        ? records.reduce((sum, record) => {
            const start = new Date(record.startDate);
            const end = new Date(record.endDate || record.startDate);
            return sum + (end - start) / (1000 * 60 * 60); // Convert to hours
          }, 0) / records.length
        : 0;

      // Get unique car owners for active customers
      const activeCustomers = new Set(records.map(record => record.car.owner)).size;

      setStats({
        totalRevenue,
        totalServices,
        averageServiceTime: parseFloat(averageServiceTime.toFixed(1)),
        activeCustomers
      });

      // Get recent records (last 5)
      setRecentRecords(records.slice(0, 5));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
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
              <p className="text-lg font-semibold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Service Time</p>
              <p className="text-lg font-semibold text-gray-900">{stats.averageServiceTime} hours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-lg font-semibold text-gray-900">{stats.activeCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Service Records */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Service Records</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.car.make} {record.car.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.car.licensePlate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.service.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{record.service.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${record.cost}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.startDate).toLocaleDateString()}
                      </div>
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