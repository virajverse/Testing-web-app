import { MessageCircle, Globe, Download, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePWA } from '../hooks/usePWA';
import { useState } from 'react';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, isInstalled, installApp } = usePWA();
  // Check if user is admin (from session storage)
  const [isAdmin, setIsAdmin] = useState(false);
  
  useState(() => {
    const checkAdminStatus = () => {
      const isAuth = sessionStorage.getItem('admin_authenticated');
      setIsAdmin(isAuth === 'true');
    };
    
    checkAdminStatus();
    
    // Listen for storage changes (when admin logs in/out)
    window.addEventListener('storage', checkAdminStatus);
    
    return () => window.removeEventListener('storage', checkAdminStatus);
  });
  
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

  const handleWhatsAppClick = () => {
    const message = language === 'en' 
      ? 'Hi Taliyo, I want to know more about your digital services.'
      : 'हाय तलियो, मैं आपकी डिजिटल सेवाओं के बारे में और जानना चाहता हूं।';
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                Taliyo
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Technologies</p>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Admin Access */}
            {isAdmin && (
              <a
                href="/admin"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </a>
            )}
            
            {/* Install App Button - Only show when native prompt is available */}
            {isInstallable && !isInstalled && (
              <button
                onClick={installApp}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                title="Install this app on your device"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {t('header.install')}
                </span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {language === 'en' ? 'हिंदी' : 'English'}
              </span>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{t('header.whatsapp')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
