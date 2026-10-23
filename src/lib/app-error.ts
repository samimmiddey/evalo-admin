export class AppError extends Error {
   statusCode: number;
   constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
   }
}

export class UnauthorizedError extends AppError {
   constructor(message = "Unauthenticated") {
      super(message, 401);
   }
}

export class ForbiddenError extends AppError {
   constructor(message = "Forbidden") {
      super(message, 403);
   }
}

export class NotFoundError extends AppError {
   constructor(message = "Not found") {
      super(message, 404);
   }
}

export class ValidationError extends AppError {
   constructor(message = "Invalid input") {
      super(message, 400);
   }
}

export class ConflictError extends AppError {
   constructor(message = "Conflict") {
      super(message, 409);
   }
}

export class RateLimitError extends AppError {
   constructor(message = "Too many requests") {
      super(message, 429);
   }
}