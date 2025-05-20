import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    serviceRecordId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'cash',
    status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/payments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/service-records', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setPayments(paymentsRes.data);
      setServiceRecords(recordsRes.data);
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
      if (editingPayment) {
        await axios.put(`http://localhost:8000/api/payments/${editingPayment.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/payments', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      setEditingPayment(null);
      setFormData({
        serviceRecordId: '',
        amount: '',
        paymentDate: '',
        paymentMethod: 'cash',
        status: 'pending'
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      serviceRecordId: payment.serviceRecordId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      status: payment.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:8000/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete payment');
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
        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
        <button
          onClick={() => {
            setEditingPayment(null);
            setFormData({
              serviceRecordId: '',
              amount: '',
              paymentDate: '',
              paymentMethod: 'cash',
              status: 'pending'
            });
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Payment
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
                Service Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
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
            {payments.map((payment) => {
              const record = serviceRecords.find(r => r.id === payment.serviceRecordId);
              
              return (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Record #{record ? record.id : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record ? `Cost: $${record.cost}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {payment.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
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
                  {editingPayment ? 'Edit Payment' : 'Add New Payment'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Service Record</label>
                    <select
                      name="serviceRecordId"
                      value={formData.serviceRecordId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a service record</option>
                      {serviceRecords.map(record => (
                        <option key={record.id} value={record.id}>
                          Record #{record.id} - ${record.cost}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Payment Date</label>
                    <input
                      type="datetime-local"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                      <option value="transfer">Bank Transfer</option>
                    </select>
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
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
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
                    {editingPayment ? 'Update' : 'Create'}
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