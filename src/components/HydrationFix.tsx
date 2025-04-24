'use client';

import { useEffect } from 'react';

/**
 * This component fixes hydration mismatches caused by browser extensions
 * that add fdprocessedid attributes to form elements and buttons.
 */
const HydrationFix = () => {
  useEffect(() => {
    // Remove all fdprocessedid attributes that cause hydration mismatches
    document.querySelectorAll('[fdprocessedid]').forEach((el) => {
      el.removeAttribute('fdprocessedid');
    });
  }, []);

  return null;
};

export default HydrationFix; 