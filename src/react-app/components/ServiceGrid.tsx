import { useState } from 'react';
import { useServices, Service } from '../hooks/useServices';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import OrderForm from './OrderForm';

interface ServiceGridProps {
  selectedCategory: string;
}

const ServiceGrid = ({ selectedCategory }: ServiceGridProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderService, setOrderService] = useState<Service | null>(null);
  const { services, loading } = useServices();

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleOrderClick = (service: Service) => {
    setOrderService(service);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setOrderService(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onServiceClick={handleServiceClick}
                onOrderClick={handleOrderClick}
              />
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        selectedService={orderService ? {
          id: parseInt(orderService.id),
          name_en: orderService.name,
          price: orderService.price,
          delivery_time: orderService.deliveryDays
        } : undefined}
      />
    </>
  );
};

export default ServiceGrid;
