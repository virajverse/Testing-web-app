import { useState, useEffect } from 'react';

// TypeScript interface for the beforeinstallprompt event
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
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker on window load
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] ✅ Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.error('[PWA] ❌ Service Worker registration failed:', error);
          });
      } else {
        console.warn('[PWA] ⚠️ Service Worker not supported in this browser');
      }
    };

    // Register SW on window load for better performance
    if (document.readyState === 'complete') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', registerServiceWorker);
    }

    // 2. Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      if (isStandalone || isIOSStandalone) {
        console.log('[PWA] ✅ App is already installed');
        setIsInstalled(true);
        setIsInstallable(false);
        return true;
      }
      return false;
    };

    const alreadyInstalled = checkIfInstalled();

    // 3. Listen for beforeinstallprompt event (the key to native install prompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] 🎯 beforeinstallprompt event fired - PWA is installable!');
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      console.log('[PWA] ✅ Install prompt ready - showing install button');
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('[PWA] 🎉 App installed successfully!');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Only add listeners if not already installed
    if (!alreadyInstalled) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', registerServiceWorker);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 5. Function to trigger the native install prompt or show fallback
  const installApp = async () => {
    console.log('[PWA] 🚀 Install button clicked');
    
    if (deferredPrompt) {
      try {
        // Show the native install prompt
        console.log('[PWA] 📱 Showing native install prompt...');
        await deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] 👤 User response:', outcome);
        
        if (outcome === 'accepted') {
          console.log('[PWA] ✅ User accepted the install prompt');
        } else {
          console.log('[PWA] ❌ User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt so it can only be used once
        setDeferredPrompt(null);
        setIsInstallable(false);
        
      } catch (error) {
        console.error('[PWA] ❌ Error showing install prompt:', error);
      }
    } else {
      // Fallback: Show manual installation instructions
      console.log('[PWA] ⚠️ No native prompt available, showing manual instructions');
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let instructions = '';
      
      if (isIOS) {
        instructions = 'To install this app on iOS:\n\n1. Tap the Share button (⬆️)\n2. Select "Add to Home Screen"\n3. Tap "Add" to install';
      } else if (isAndroid) {
        instructions = 'To install this app on Android:\n\n1. Tap the menu (⋮) in your browser\n2. Select "Add to Home screen"\n3. Tap "Add" to install';
      } else {
        instructions = 'To install this app:\n\n• Chrome: Menu > "Install Taliyo..."\n• Edge: Menu > "Apps" > "Install this site as an app"\n• Or look for the install icon in your address bar';
      }
      
      alert(instructions);
    }
  };

  return {
    isInstallable,    // True when native install prompt is available
    isInstalled,      // True when app is already installed
    installApp        // Function to trigger native install prompt
  };
};
