import { useState, useEffect } from 'react';
import { Trash2, MessageCircle, Eye, Search, Download, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportToCSV, formatOrdersForExport } from '@/lib/csvExport';

interface AttachmentFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface EnhancedOrder {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_whatsapp?: string;
  service_id?: number;
  service_name: string;
  service_price?: number;
  requirements?: string;
  budget_range?: string;
  delivery_preference?: string;
  additional_notes?: string;
  status: string;
  priority: string;
  whatsapp_sent: boolean;
  admin_notes?: string;
  attachment_files?: AttachmentFile[];
  created_at: string;
  updated_at: string;
  contacted_at?: string;
  completed_at?: string;
}



const OrderManagement = () => {
  const [orders, setOrders] = useState<EnhancedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<EnhancedOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const statusOptions = [
    { value: 'received', label: 'Received', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-purple-100 text-purple-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('enhanced_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };



  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Set contacted_at when status changes to contacted
      if (newStatus === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }
      
      // Set completed_at when status changes to completed
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('enhanced_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const updateOrderPriority = async (orderId: number, newPriority: string) => {
    try {
      const { error } = await supabase
        .from('enhanced_orders')
        .update({ 
          priority: newPriority,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order priority:', error);
    }
  };

  const markWhatsAppSent = async (orderId: number) => {
    try {
      const { error } = await supabase
        .from('enhanced_orders')
        .update({ 
          whatsapp_sent: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Failed to mark WhatsApp as sent:', error);
    }
  };

  const generateWhatsAppMessage = (order: EnhancedOrder, type: 'confirmation' | 'update' | 'completion') => {
    const baseMessage = `Hi ${order.customer_name}! 👋\n\n`;
    
    switch (type) {
      case 'confirmation':
        return `${baseMessage}✅ Your order has been received!\n\n📋 Order ID: ${order.order_id}\n🛍️ Service: ${order.service_name}\n💰 Budget: ${order.budget_range || 'As discussed'}\n⏰ Delivery: ${order.delivery_preference || 'As discussed'}\n\n${order.requirements ? `📝 Requirements noted:\n${order.requirements}\n\n` : ''}We'll contact you within 24 hours to discuss details.\n\n- Taliyo Technologies Team`;
      
      case 'update':
        return `${baseMessage}📋 Order Update - ${order.order_id}\n\n✅ Status: ${order.status.replace('_', ' ').toUpperCase()}\n🛍️ Service: ${order.service_name}\n\nYour project is progressing well! We'll keep you updated.\n\n- Taliyo Team`;
      
      case 'completion':
        return `${baseMessage}🎉 Great news! Your order is complete!\n\n📋 Order ID: ${order.order_id}\n🛍️ Service: ${order.service_name}\n✅ Status: COMPLETED\n\nThank you for choosing Taliyo Technologies! We hope you're satisfied with our work.\n\n- Taliyo Team`;
      
      default:
        return baseMessage;
    }
  };

  const openWhatsApp = (order: EnhancedOrder, messageType: 'confirmation' | 'update' | 'completion') => {
    const phone = order.customer_whatsapp || order.customer_phone;
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const message = generateWhatsAppMessage(order, messageType);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Mark WhatsApp as sent
    markWhatsAppSent(order.id);
  };

  const handleViewDetails = (order: EnhancedOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const { error } = await supabase
          .from('enhanced_orders')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchOrders();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };



  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleExportCSV = () => {
    const dataToExport = formatOrdersForExport(filteredOrders);
    const filename = `taliyo-orders-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(dataToExport, filename);
  };

  const handleExportAllCSV = () => {
    const dataToExport = formatOrdersForExport(orders);
    const filename = `taliyo-all-orders-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(dataToExport, filename);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Order Management</h1>
          <p className="text-gray-600 mt-2">Track and manage customer orders with WhatsApp integration</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Showing: {filteredOrders.length} / {orders.length} orders
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportCSV}
              disabled={filteredOrders.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg flex items-center space-x-2 transition-colors"
              title="Export filtered orders"
            >
              <Download className="w-4 h-4" />
              <span>Export Filtered</span>
            </button>
            <button
              onClick={handleExportAllCSV}
              disabled={orders.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center space-x-2 transition-colors"
              title="Export all orders"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="w-full px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">{order.order_id}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                    {order.customer_email && (
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.service_name}</div>
                    <div className="text-xs text-gray-500">{order.budget_range || 'Budget not specified'}</div>
                    {order.attachment_files && order.attachment_files.length > 0 && (
                      <div className="text-xs text-blue-600 flex items-center space-x-1 mt-1">
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>{order.attachment_files.length} files</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={order.priority}
                      onChange={(e) => updateOrderPriority(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getPriorityColor(order.priority)}`}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openWhatsApp(order, 'confirmation')}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Send Confirmation"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      {order.whatsapp_sent && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="WhatsApp sent"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-500">
              {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - {selectedOrder.order_id}
                </h2>
                <button
                  onClick={handleCloseDetailsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedOrder.customer_phone}</p>
                  </div>
                  {selectedOrder.customer_email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedOrder.customer_email}</p>
                    </div>
                  )}
                  {selectedOrder.customer_whatsapp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                      <p className="text-sm text-gray-900">{selectedOrder.customer_whatsapp}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <p className="text-sm text-gray-900">{selectedOrder.service_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                    <p className="text-sm text-gray-900">{selectedOrder.budget_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Preference</label>
                    <p className="text-sm text-gray-900">{selectedOrder.delivery_preference || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {selectedOrder.requirements && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedOrder.requirements}</p>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedOrder.additional_notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedOrder.additional_notes}</p>
                  </div>
                </div>
              )}

              {/* Attachment Files */}
              {selectedOrder.attachment_files && selectedOrder.attachment_files.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Attachment Files</h3>
                  <div className="space-y-2">
                    {selectedOrder.attachment_files.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <Eye className="w-4 h-4 text-blue-600" />
                            ) : (
                              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedOrder.priority)}`}>
                      {selectedOrder.priority.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  {selectedOrder.contacted_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contacted</label>
                      <p className="text-sm text-gray-900">{new Date(selectedOrder.contacted_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">WhatsApp Actions</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openWhatsApp(selectedOrder, 'confirmation')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Confirmation</span>
                  </button>
                  <button
                    onClick={() => openWhatsApp(selectedOrder, 'update')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Update</span>
                  </button>
                  <button
                    onClick={() => openWhatsApp(selectedOrder, 'completion')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Completion</span>
                  </button>
                </div>
                {selectedOrder.whatsapp_sent && (
                  <p className="text-sm text-green-600 mt-2">✅ WhatsApp message has been sent</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
