import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '../contexts/LanguageContext';

const InstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { t } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after delay if not installed and not dismissed
    const timer = setTimeout(() => {
      if (!isInstalled && !dismissed) {
        setShowPrompt(true);
      }
    }, 8000); // Wait 8 seconds to let user explore first

    return () => clearTimeout(timer);
  }, [isInstalled, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
  };

  const handleInstall = () => {
    installApp();
    setShowPrompt(false);
  };

  // Only show if not installed and not dismissed
  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-4 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className={`p-3 rounded-full ${isInstallable ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Download className={`w-6 h-6 ${isInstallable ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {t('hero.installApp')}
              {!isInstallable && <span className="text-xs text-gray-500 ml-2">(Manual)</span>}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {isInstallable ? t('hero.installSubtext') : 'Get installation instructions for your device'}
            </p>
            <button
              onClick={handleInstall}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                isInstallable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isInstallable ? t('header.install') : 'Get Instructions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
