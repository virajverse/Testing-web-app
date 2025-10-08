import { MessageCircle, Globe, Download, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePWA } from '../hooks/usePWA';
import { useAuth } from '@getmocha/users-service/react';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isInstalled, installApp } = usePWA();
  const { user, redirectToLogin } = useAuth();
  
  const whatsappNumber = '919876543210'; // Replace with actual number

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
            {user ? (
              <a
                href="/admin"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </a>
            ) : (
              <button
                onClick={redirectToLogin}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </button>
            )}
            {/* Install App Button - Always show for PWA */}
            {!isInstalled && (
              <button
                onClick={installApp}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
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
