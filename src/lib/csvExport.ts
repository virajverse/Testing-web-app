interface ExportData {
  [key: string]: any;
}

export const exportToCSV = (data: ExportData[], filename: string) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get all unique keys from all objects
  const allKeys = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Create CSV header
  const csvHeader = allKeys.join(',');

  // Create CSV rows
  const csvRows = data.map(item => {
    return allKeys.map(key => {
      const value = item[key];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle arrays and objects (like attachment_files)
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      // Handle strings with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatOrdersForExport = (orders: any[]) => {
  return orders.map(order => ({
    'Order ID': order.order_id,
    'Customer Name': order.customer_name,
    'Phone': order.customer_phone,
    'Email': order.customer_email || '',
    'WhatsApp': order.customer_whatsapp || '',
    'Service': order.service_name,
    'Service Price': order.service_price || '',
    'Requirements': order.requirements,
    'Budget Range': order.budget_range || '',
    'Delivery Preference': order.delivery_preference || '',
    'Additional Notes': order.additional_notes || '',
    'Status': order.status,
    'Priority': order.priority,
    'WhatsApp Sent': order.whatsapp_sent ? 'Yes' : 'No',
    'Admin Notes': order.admin_notes || '',
    'Attachment Files': order.attachment_files ? 
      order.attachment_files.map((f: any) => f.name).join('; ') : '',
    'Created Date': new Date(order.created_at).toLocaleDateString(),
    'Created Time': new Date(order.created_at).toLocaleTimeString(),
    'Updated Date': order.updated_at ? new Date(order.updated_at).toLocaleDateString() : '',
    'Contacted Date': order.contacted_at ? new Date(order.contacted_at).toLocaleDateString() : '',
    'Completed Date': order.completed_at ? new Date(order.completed_at).toLocaleDateString() : ''
  }));
};