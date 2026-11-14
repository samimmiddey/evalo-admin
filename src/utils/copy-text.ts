export const copyText = async (text: string): Promise<boolean> => {
   if (typeof window === "undefined" || !text) return false;

   if (navigator.clipboard?.writeText) {
      try {
         await navigator.clipboard.writeText(text);
         return true;
      } catch {
         // fall through to legacy fallback
      }
   }

   const textArea = document.createElement("textarea");
   textArea.value = text;
   textArea.setAttribute("readonly", "");
   textArea.style.position = "fixed";
   textArea.style.top = "-9999px";
   textArea.style.left = "-9999px";
   textArea.style.opacity = "0";

   const previouslyFocused = document.activeElement as HTMLElement | null;
   document.body.appendChild(textArea);

   try {
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      return document.execCommand("copy");
   } catch {
      return false;
   } finally {
      document.body.removeChild(textArea);
      previouslyFocused?.focus?.();
   }
};

