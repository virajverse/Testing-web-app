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
    // Only show prompt if native install is available and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        setShowPrompt(true);
      }
    }, 5000); // Wait 5 seconds to let user explore first

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
  };

  const handleInstall = () => {
    installApp();
    setShowPrompt(false);
  };

  // Only show if native install is available and not installed
  if (!showPrompt || !isInstallable || isInstalled) return null;

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
          <div className="bg-blue-100 p-3 rounded-full">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {t('hero.installApp')}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('hero.installSubtext')}
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {t('header.install')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
