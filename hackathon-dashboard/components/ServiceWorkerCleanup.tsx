'use client';

import { useEffect } from 'react';

/**
 * This component proactively unregisters any "ghost" service workers
 * that might be lingering in the user's browser from previous project
 * iterations or other apps running on the same port.
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Successfully unregistered "ghost" Service Worker');
              // Optionally reload to ensure clean state
              window.location.reload();
            }
          });
        }
      });
    }
  }, []);

  return null;
}
