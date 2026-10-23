import { Prisma } from "@/generated/prisma/client";
import { AppError, ConflictError, NotFoundError, ValidationError } from "./app-error";

const isDev = process.env.NODE_ENV === 'development';

interface ServerErrorProps {
   error: unknown;
   fallbackMessage?: string;
}

export const serverError = ({ error, fallbackMessage = "Something went wrong" }: ServerErrorProps): never => {
   if (error instanceof AppError) {
      throw error;
   }

   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
         case 'P2025':
            throw new NotFoundError("We couldn't find the requested record");
         case 'P2002':
            throw new ConflictError("A record with this value already exists");
         case 'P2003':
            throw new ValidationError("This action references a record that doesn't exist");
         default:
            throw new AppError(fallbackMessage, 500);
      }
   }

   if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ValidationError("Invalid data provided");
   }

   if (error instanceof Error) {
      throw new AppError(isDev ? error.message : fallbackMessage, 500);
   }

   throw new AppError(fallbackMessage, 500);
};