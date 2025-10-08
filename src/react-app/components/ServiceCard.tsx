import { Clock, MessageCircle } from 'lucide-react';
import { Service } from '../data/services';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onServiceClick: (service: Service) => void;
}

const ServiceCard = ({ service, onServiceClick }: ServiceCardProps) => {
  const { language, t } = useLanguage();
  
  const whatsappNumber = '919876543210'; // Replace with actual number

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const serviceName = language === 'en' ? service.name : service.nameHi;
    const message = language === 'en' 
      ? `Hi Taliyo, I want to order "${serviceName}" (₹${service.price}). Please confirm.`
      : `हाय तलियो, मैं "${serviceName}" (₹${service.price}) ऑर्डर करना चाहता हूं। कृपया कन्फर्म करें।`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const serviceName = language === 'en' ? service.name : service.nameHi;

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onServiceClick(service)}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={service.image}
          alt={serviceName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {serviceName}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-600">
              {t('currency')}{service.price.toLocaleString()}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{service.deliveryDays} {t('service.days')}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleWhatsAppOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('service.order')}</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
