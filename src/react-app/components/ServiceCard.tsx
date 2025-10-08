import { Clock, MessageCircle } from 'lucide-react';
import { Service } from '../data/services';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onServiceClick: (service: Service) => void;
  onOrderClick: (service: Service) => void;
}

const ServiceCard = ({ service, onServiceClick, onOrderClick }: ServiceCardProps) => {
  const { language, t } = useLanguage();
  


  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOrderClick(service);
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
          onClick={handleOrderClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{language === 'hi' ? 'ऑर्डर करें' : 'Order Now'}</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
