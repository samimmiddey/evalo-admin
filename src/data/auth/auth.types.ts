import { AuthSchemaTypes, OtpSchemaTypes } from "@/features/auth/schemas/auth.schema";

export interface TelemetryDataPoint {
   time: string;
   current: number;
   baseline: number;
}

export interface MetricTile {
   value: string;
   label: string;
}

export interface AuthBrandCardData {
   title: string;
   subtitle: string;
   primaryMetric: {
      value: string;
      delta: string;
      comparison: string;
   };
   chartUnit: string;
   chartData: TelemetryDataPoint[];
   metrics: MetricTile[];
}

export interface AuthBrandData {
   headline: {
      prefix: string;
      highlight: string;
   };
   description: string;
   card: AuthBrandCardData;
   footer: {
      copyright: string;
      status: string;
   };
}

export interface InputData<T extends string = string> {
   name: T;
   type: string;
   label: string;
   placeholder: string;
}

export interface AuthFormData {
   title: string;
   description: string;
   emailInput: InputData<keyof AuthSchemaTypes>;
   passwordInput: InputData<keyof AuthSchemaTypes>;
   forgotPassword: string;
   submitButtonText: string;
}

export interface OtpFormData {
   title: string;
   description: string;
   codeInput: InputData<keyof OtpSchemaTypes>;
   submitButtonText: string;
   resendButtonText: string;
   useDifferentEmailText: string;
}

export interface AuthData {
   signIn: AuthFormData;
   otp: OtpFormData;
   brand: AuthBrandData;
}
