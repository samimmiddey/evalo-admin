export const getClerkErrorMessage = (error: {
   message?: string;
   errors?: { longMessage?: string }[];
}) => {
   return (
      error.errors?.[0]?.longMessage ??
      error.message ??
      'Something went wrong'
   );
};