interface SuccessResponse<T> {
   success: true;
   statusCode: number;
   data: T;
}

interface ErrorResponse {
   success: false;
   statusCode: number;
   error: string;
}

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;