import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = ['/sign-in', '/forgot-password', '/api'];

function isPublicRoutes(pathname: string) {
   return publicRoutes.some(p => pathname === p || pathname.startsWith(`${p}/`));
}

export default clerkMiddleware(async (auth, req) => {
   const { isAuthenticated, sessionClaims } = await auth();
   const { pathname, search } = req.nextUrl;
   const isAdmin = sessionClaims?.metadata?.role === 'ADMIN';

   // Redirect to dashboard page if user is logged in
   if (isAuthenticated && isAdmin && isPublicRoutes(pathname) && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
   }

   // Protect all routes except public routes
   if (!isPublicRoutes(pathname) && !isAuthenticated) {
      const signInUrl = new URL('/sign-in', req.url);
      const currentPath = pathname + search;
      if (currentPath !== '/') signInUrl.searchParams.set('redirect_url', currentPath);

      return NextResponse.redirect(signInUrl);
   }

   // Check if the user is admin or not
   if (isAuthenticated && !isAdmin && !isPublicRoutes(pathname)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
   }
});

export const config = {
   matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
      // Always run for Clerk-specific frontend API routes
      '/__clerk/(.*)',
   ],
};