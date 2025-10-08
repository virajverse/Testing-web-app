import React, { useState } from 'react';
import { X, User, Phone, Mail, MessageSquare, Clock, DollarSign, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import FileUpload from './FileUpload';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: {
    id: number;
    name_en: string;
    name_hi: string;
    price: number;
    delivery_time: number;
  };
}

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerWhatsapp: string;
  requirements: string;
  budgetRange: string;
  deliveryPreference: string;
  additionalNotes: string;
}

interface AttachmentFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, selectedService }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerWhatsapp: '',
    requirements: '',
    budgetRange: '',
    deliveryPreference: '',
    additionalNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState<string>('');
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const budgetOptions = [
    { value: 'under-5k', label: 'Under ₹5,000', labelHi: '₹5,000 से कम' },
    { value: '5k-10k', label: '₹5,000 - ₹10,000', labelHi: '₹5,000 - ₹10,000' },
    { value: '10k-25k', label: '₹10,000 - ₹25,000', labelHi: '₹10,000 - ₹25,000' },
    { value: '25k-50k', label: '₹25,000 - ₹50,000', labelHi: '₹25,000 - ₹50,000' },
    { value: 'above-50k', label: 'Above ₹50,000', labelHi: '₹50,000 से अधिक' },
    { value: 'flexible', label: 'Flexible', labelHi: 'लचीला बजट' }
  ];

  const deliveryOptions = [
    { value: 'asap', label: 'ASAP', labelHi: 'जल्दी से जल्दी' },
    { value: '1-week', label: '1 Week', labelHi: '1 सप्ताह' },
    { value: '2-weeks', label: '2 Weeks', labelHi: '2 सप्ताह' },
    { value: '1-month', label: '1 Month', labelHi: '1 महीना' },
    { value: 'flexible', label: 'Flexible', labelHi: 'लचीला समय' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadFilesToSupabase = async (files: File[], orderId: string): Promise<AttachmentFile[]> => {
    const uploadedFiles: AttachmentFile[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `order-attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('order-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        continue; // Skip this file and continue with others
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('order-files')
        .getPublicUrl(filePath);

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size
      });
    }

    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate required fields
      if (!formData.customerName || !formData.customerPhone || !formData.requirements) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare WhatsApp number (use phone if WhatsApp not provided)
      const whatsappNumber = formData.customerWhatsapp || formData.customerPhone;

      // First, submit order to get order ID
      const { data, error } = await supabase
        .from('enhanced_orders')
        .insert({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          customer_whatsapp: whatsappNumber,
          service_id: selectedService?.id,
          service_name: language === 'hi' ? selectedService?.name_hi : selectedService?.name_en,
          service_price: selectedService?.price,
          requirements: formData.requirements,
          budget_range: formData.budgetRange || null,
          delivery_preference: formData.deliveryPreference || null,
          additional_notes: formData.additionalNotes || null,
          status: 'received'
        })
        .select('id, order_id')
        .single();

      if (error) throw error;

      // Upload files if any
      let attachmentFilesData: AttachmentFile[] = [];
      if (attachmentFiles.length > 0) {
        setUploadingFiles(true);
        attachmentFilesData = await uploadFilesToSupabase(attachmentFiles, data.order_id);
        
        // Update order with file attachments
        if (attachmentFilesData.length > 0) {
          const { error: updateError } = await supabase
            .from('enhanced_orders')
            .update({ attachment_files: attachmentFilesData })
            .eq('id', data.id);

          if (updateError) {
            console.error('Error updating order with files:', updateError);
          }
        }
        setUploadingFiles(false);
      }

      setOrderId(data.order_id);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerWhatsapp: '',
        requirements: '',
        budgetRange: '',
        deliveryPreference: '',
        additionalNotes: ''
      });
      setAttachmentFiles([]);

    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitStatus('error');
      setUploadingFiles(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'hi' ? 'ऑर्डर करें' : 'Place Order'}
            </h2>
            {selectedService && (
              <p className="text-sm text-gray-600 mt-1">
                {language === 'hi' ? selectedService.name_hi : selectedService.name_en} - ₹{selectedService.price.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === 'hi' ? 'ऑर्डर सफलतापूर्वक सबमिट हुआ!' : 'Order Submitted Successfully!'}
                </h3>
                <p className="text-sm">
                  {language === 'hi' 
                    ? `आपका ऑर्डर ID: ${orderId}. हम 24 घंटे में संपर्क करेंगे।`
                    : `Your Order ID: ${orderId}. We'll contact you within 24 hours.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">
              <h3 className="font-semibold">
                {language === 'hi' ? 'कुछ गलत हुआ' : 'Something went wrong'}
              </h3>
              <p className="text-sm">
                {language === 'hi' 
                  ? 'कृपया फिर से कोशिश करें या हमसे संपर्क करें।'
                  : 'Please try again or contact us directly.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{language === 'hi' ? 'आपकी जानकारी' : 'Your Information'}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'hi' ? 'नाम' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'hi' ? 'आपका पूरा नाम' : 'Enter your full name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {language === 'hi' ? 'फोन नंबर' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {language === 'hi' ? 'ईमेल' : 'Email'} (Optional)
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  {language === 'hi' ? 'व्हाट्सऐप नंबर' : 'WhatsApp Number'} (Optional)
                </label>
                <input
                  type="tel"
                  name="customerWhatsapp"
                  value={formData.customerWhatsapp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'hi' ? 'फोन नंबर से अलग हो तो' : 'If different from phone'}
                />
              </div>
            </div>
          </div>

          {/* Project Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{language === 'hi' ? 'प्रोजेक्ट की आवश्यकताएं' : 'Project Requirements'}</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'आपको क्या चाहिए? विस्तार से बताएं' : 'What do you need? Please describe in detail'} *
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'hi' 
                  ? 'जैसे: मुझे एक ई-कॉमर्स वेबसाइट चाहिए जिसमें पेमेंट गेटवे हो...'
                  : 'e.g., I need an e-commerce website with payment gateway...'
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  {language === 'hi' ? 'बजट रेंज' : 'Budget Range'}
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'hi' ? 'बजट चुनें' : 'Select Budget'}
                  </option>
                  {budgetOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'hi' ? option.labelHi : option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {language === 'hi' ? 'डिलीवरी की प्राथमिकता' : 'Delivery Preference'}
                </label>
                <select
                  name="deliveryPreference"
                  value={formData.deliveryPreference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'hi' ? 'समय चुनें' : 'Select Timeline'}
                  </option>
                  {deliveryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'hi' ? option.labelHi : option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'अतिरिक्त नोट्स' : 'Additional Notes'} (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'hi' 
                  ? 'कोई विशेष आवश्यकता या सवाल...'
                  : 'Any special requirements or questions...'
                }
              />
            </div>

            {/* File Upload Section */}
            <div>
              <FileUpload
                onFilesChange={setAttachmentFiles}
                maxFiles={5}
                maxSizePerFile={10}
                label={language === 'hi' ? 'फाइलें अपलोड करें (वैकल्पिक)' : 'Upload Files (Optional)'}
              />
              <p className="text-xs text-gray-500 mt-2">
                {language === 'hi' 
                  ? 'आप अपनी आवश्यकताओं से संबंधित इमेज, डॉक्यूमेंट या रेफरेंस फाइलें अपलोड कर सकते हैं'
                  : 'You can upload images, documents, or reference files related to your requirements'
                }
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || uploadingFiles}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {isSubmitting || uploadingFiles ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {uploadingFiles 
                      ? (language === 'hi' ? 'फाइलें अपलोड हो रही हैं...' : 'Uploading files...')
                      : (language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...')
                    }
                  </span>
                </>
              ) : (
                <span>{language === 'hi' ? 'ऑर्डर सबमिट करें' : 'Submit Order'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;