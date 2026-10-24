export const sanitizeRedirectUrl = (
   url: string | null | undefined,
   fallback = ''
): string => {
   if (!url) return fallback;

   // Must start with a single '/' — rejects absolute URLs (https://...)
   // and protocol-relative URLs (//evil.com)
   if (!url.startsWith('/') || url.startsWith('//')) {
      return fallback;
   }

   // Reject backslash variants some browsers normalize as protocol-relative
   // (e.g. "/\evil.com" or "\\evil.com")
   if (url.startsWith('/\\') || url.includes('\\')) {
      return fallback;
   }

   // Confirm it parses as a valid relative URL against a dummy origin,
   // and that it didn't resolve to a different origin
   try {
      const parsed = new URL(url, 'https://placeholder.local');
      if (parsed.origin !== 'https://placeholder.local') {
         return fallback;
      }
   } catch {
      return fallback;
   }

   return url;
};