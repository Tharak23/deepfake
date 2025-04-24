'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

// Custom logger for NextAuth
const customLogger = {
  error: (code: string, metadata: any) => {
    console.error(`NextAuth Error [${code}]:`, metadata);
  },
  warn: (code: string) => {
    console.warn(`NextAuth Warning [${code}]`);
  },
  debug: (code: string, metadata: any) => {
    console.log(`NextAuth Debug [${code}]:`, metadata);
  },
};

/**
 * Using a workaround for hydration issues by delaying rendering client components
 * until after browser extensions like form fillers have done their work.
 */
function Providers({ children }: { children: React.ReactNode }) {
  // Use client-side only rendering for hydration issues caused by browser extensions
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Clean up fdprocessedid attributes that cause hydration errors
    const cleanup = () => {
      document.querySelectorAll('[fdprocessedid]').forEach((el) => {
        el.removeAttribute('fdprocessedid');
      });
    };
    
    // Run cleanup immediately and periodically for a short time
    cleanup();
    
    // Create a small window of periodic cleanup to catch any attributes added after initial load
    const interval = setInterval(cleanup, 100);
    
    // After a short delay, stop cleaning up and mark as mounted
    setTimeout(() => {
      clearInterval(interval);
      setMounted(true);
    }, 500);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  
  // Suppress React hydration warning in production
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Filter out hydration warnings
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Hydration')) {
          return;
        }
        originalConsoleError(...args);
      };
      
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);

  return (
    <SessionProvider logger={customLogger} refetchInterval={5 * 60}>
      <AuthProvider>
        {mounted ? children : null}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#166534',
              },
            },
            error: {
              style: {
                background: '#991b1b',
              },
            },
          }}
        />
      </AuthProvider>
    </SessionProvider>
  );
}

// Support both default and named exports
export default Providers;
export { Providers }; 