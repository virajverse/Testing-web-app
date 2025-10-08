import { X, Clock, MessageCircle, Check } from 'lucide-react';
import { Service } from '../data/services';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceModal = ({ service, isOpen, onClose }: ServiceModalProps) => {
  const { language, t } = useLanguage();

  if (!isOpen || !service) return null;

  const whatsappNumber = '919876543210'; // Replace with actual number
  
  const handleWhatsAppOrder = () => {
    const serviceName = language === 'en' ? service.name : service.nameHi;
    const message = language === 'en' 
      ? `Hi Taliyo, I want to order "${serviceName}" (₹${service.price}). Please confirm.`
      : `हाय तलियो, मैं "${serviceName}" (₹${service.price}) ऑर्डर करना चाहता हूं। कृपया कन्फर्म करें।`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const serviceName = language === 'en' ? service.name : service.nameHi;
  const description = language === 'en' ? service.description : service.descriptionHi;
  const features = language === 'en' ? service.features : service.featuresHi;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={service.image}
            alt={serviceName}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {serviceName}
          </h2>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-blue-600">
                {t('currency')}{service.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-lg">{service.deliveryDays} {t('service.days')}</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {description}
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('service.features')}
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-colors font-semibold text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{t('service.order')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {t('service.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
