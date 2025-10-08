import { useLanguage } from '../contexts/LanguageContext';
import { usePWA } from '../hooks/usePWA';
import { Download } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, installApp } = usePWA();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {t('hero.tagline')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        
        {/* Install App Button - Only show when native prompt is available */}
        {isInstallable && !isInstalled && (
          <div className="mb-8">
            <button
              onClick={installApp}
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              title="Install this app for faster access and offline use"
            >
              <Download className="w-6 h-6" />
              <span>{t('hero.installApp')}</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              {t('hero.installSubtext')}
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">1-16</div>
                <div className="text-sm text-gray-600">Days Delivery</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">₹999+</div>
                <div className="text-sm text-gray-600">Starting Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">WhatsApp</div>
                <div className="text-sm text-gray-600">Easy Ordering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
