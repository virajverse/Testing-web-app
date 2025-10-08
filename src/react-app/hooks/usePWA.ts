import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(true); // Always show install option
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((registrationError) => {
          console.error('❌ SW registration failed:', registrationError);
        });
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      console.log('✅ App already installed');
      setIsInstalled(true);
      setIsInstallable(false);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('✅ beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('✅ App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    console.log('🔵 Install button clicked');
    console.log('🔵 Deferred prompt available:', !!deferredPrompt);
    
    if (deferredPrompt) {
      try {
        // Show the native install prompt
        await deferredPrompt.prompt();
        console.log('✅ Install prompt shown');
        
        // Wait for user response
        const { outcome } = await deferredPrompt.userChoice;
        console.log('🔵 User choice:', outcome);
        
        if (outcome === 'accepted') {
          console.log('✅ User accepted installation');
          setDeferredPrompt(null);
          setIsInstallable(false);
        } else {
          console.log('❌ User dismissed installation');
        }
      } catch (error) {
        console.error('❌ Error showing install prompt:', error);
      }
    } else {
      // Fallback for browsers that don't support PWA prompt
      console.log('⚠️ No deferred prompt available, showing fallback');
      alert('इस app को install करने के लिए:\n\n1. Chrome: Menu > "Add to Home screen"\n2. Safari: Share > "Add to Home Screen"\n3. Firefox: Menu > "Install"');
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
};
