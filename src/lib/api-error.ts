interface ApiErrorProps {
   error: unknown;
   fallbackMessage: string;
}

export const apiError = ({ error, fallbackMessage }: ApiErrorProps): never => {
   if (error instanceof Error) throw error;

   throw new Error(fallbackMessage);
};