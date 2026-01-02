import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // No authentication required - allow all routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [],
}; 