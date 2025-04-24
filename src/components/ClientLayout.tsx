'use client';

import Providers from './Providers';

/**
 * Client-side layout wrapper that handles authentication and providers
 * This helps contain hydration issues to client components.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
} 