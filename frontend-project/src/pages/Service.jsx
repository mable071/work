import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/services', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch services');
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
      if (editingService) {
        await axios.put(`http://localhost:8000/api/services/${editingService.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/services', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        duration: '',
        status: 'active'
      });
      fetchServices();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      duration: service.duration,
      status: service.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:8000/api/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchServices();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete service');
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
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              name: '',
              description: '',
              basePrice: '',
              duration: '',
              status: 'active'
            });
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
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
                Service Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${service.basePrice}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{service.duration} minutes</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
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
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Base Price</label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      required
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
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
                    {editingService ? 'Update' : 'Create'}
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