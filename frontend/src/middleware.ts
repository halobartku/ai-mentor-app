import { authMiddleware } from '@clerk/nextjs';
 
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/api/webhook/clerk'],
});
 
export const config = {
  // Protects all routes, including api/trpc
  // Please edit this if you have different needs
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};