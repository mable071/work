import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ServiceRecordPage() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    carId: '',
    serviceId: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    cost: '',
    technician: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, carsRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/service-records', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/cars', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/services', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setServices(servicesRes.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await axios.put(`http://localhost:8000/api/service-records/${editingRecord.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/service-records', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      setEditingRecord(null);
      setFormData({
        carId: '',
        serviceId: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        cost: '',
        technician: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      carId: record.carId,
      serviceId: record.serviceId,
      startDate: record.startDate,
      endDate: record.endDate || '',
      status: record.status,
      cost: record.cost,
      technician: record.technician,
      notes: record.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await axios.delete(`http://localhost:8000/api/service-records/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete service record');
      }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Service Records</h1>
        <button
          onClick={() => {
            setEditingRecord(null);
            setFormData({
              carId: '',
              serviceId: '',
              startDate: '',
              endDate: '',
              status: 'pending',
              cost: '',
              technician: '',
              notes: ''
            });
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service Record
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technician
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => {
              const car = cars.find(c => c.id === record.carId);
              const service = services.find(s => s.id === record.serviceId);
              
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {car ? `${car.make} ${car.model}` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {car ? car.licensePlate : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {service ? service.name : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {service ? service.category : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Start: {new Date(record.startDate).toLocaleDateString()}
                    </div>
                    {record.endDate && (
                      <div className="text-sm text-gray-500">
                        End: {new Date(record.endDate).toLocaleDateString()}
                      </div>
                    )}
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
                    <div className="text-sm text-gray-900">{record.technician}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingRecord ? 'Edit Service Record' : 'Add New Service Record'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Car</label>
                    <select
                      name="carId"
                      value={formData.carId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a car</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.make} {car.model} - {car.licensePlate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Service</label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Cost</label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Technician</label>
                    <input
                      type="text"
                      name="technician"
                      value={formData.technician}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 