import { useState, useEffect } from 'react';

const MobileDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      screen: {
        width: screen.width,
        height: screen.height
      },
      support: {
        localStorage: typeof Storage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        promises: typeof Promise !== 'undefined',
        es6: typeof Symbol !== 'undefined'
      },
      errors: [] as string[]
    };

    // Capture any console errors
    const originalError = console.error;
    console.error = (...args) => {
      info.errors.push(args.join(' '));
      originalError.apply(console, args);
    };

    setDebugInfo(info);
  }, []);

  // Show debug info on triple tap
  useEffect(() => {
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout;

    const handleTap = () => {
      tapCount++;
      clearTimeout(tapTimer);
      
      if (tapCount === 3) {
        setShowDebug(true);
        tapCount = 0;
      } else {
        tapTimer = setTimeout(() => {
          tapCount = 0;
        }, 500);
      }
    };

    document.addEventListener('touchend', handleTap);
    return () => {
      document.removeEventListener('touchend', handleTap);
      clearTimeout(tapTimer);
    };
  }, []);

  if (!showDebug) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Mobile Debug Info</h3>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-4 text-xs">
          <div>
            <h4 className="font-semibold mb-2">User Agent:</h4>
            <p className="break-all">{debugInfo.userAgent}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Viewport:</h4>
            <p>Width: {debugInfo.viewport?.width}px</p>
            <p>Height: {debugInfo.viewport?.height}px</p>
            <p>Device Pixel Ratio: {debugInfo.viewport?.devicePixelRatio}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Screen:</h4>
            <p>Width: {debugInfo.screen?.width}px</p>
            <p>Height: {debugInfo.screen?.height}px</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Browser Support:</h4>
            {Object.entries(debugInfo.support || {}).map(([key, value]) => (
              <p key={key}>
                {key}: <span className={value ? 'text-green-600' : 'text-red-600'}>
                  {value ? '✓' : '✗'}
                </span>
              </p>
            ))}
          </div>
          
          {debugInfo.errors?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-red-600">Errors:</h4>
              {debugInfo.errors.map((error: string, index: number) => (
                <p key={index} className="text-red-600 break-all">{error}</p>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
                alert('Debug info copied to clipboard');
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm"
            >
              Copy Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDebug;